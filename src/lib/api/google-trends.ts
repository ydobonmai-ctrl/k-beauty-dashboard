import type { Country } from '../../types/index';

// Public website endpoints, not the restricted Google Trends API alpha.
const BASE = 'https://trends.google.com/trends';
const headers = { 'User-Agent': 'Mozilla/5.0', 'Accept-Language': 'en-US,en;q=0.9' };
export interface InterestPoint { date: string; values: number[] }

export function parseGoogleJson(text: string): unknown {
  return JSON.parse(text.replace(/^\)\]\}',?\s*/, ''));
}

let session: Promise<string> | undefined;
let queue: Promise<unknown> = Promise.resolve();
let blockedUntil = 0;

async function request(url: string, cookie = '') {
  const response = await fetch(url, {
    headers: { ...headers, ...(cookie ? { Cookie: cookie } : {}) },
    cache: 'no-store', signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) {
    if (response.status === 429) blockedUntil = Date.now() + 5 * 60_000;
    throw new Error(`Google Trends HTTP ${response.status}`);
  }
  return response;
}

async function getCookie() {
  session ??= request(`${BASE}/?geo=US`).then(response =>
    response.headers.getSetCookie().map(value => value.split(';')[0]).join('; ')
  ).catch(error => { session = undefined; throw error; });
  return session;
}

async function query(country: Country, keywords: string[]): Promise<InterestPoint[]> {
  if (Date.now() < blockedUntil) throw new Error('Google Trends 요청 제한: 잠시 후 다시 시도하세요.');
  const cookie = await getCookie();
  const params = new URLSearchParams({ hl: 'en-US', tz: '0', req: JSON.stringify({
    comparisonItem: keywords.map(keyword => ({ keyword, geo: country, time: 'today 1-m' })),
    category: 0, property: '',
  }) });
  const explore = parseGoogleJson(await (await request(`${BASE}/api/explore?${params}`, cookie)).text()) as {
    widgets?: { id: string; token: string; request: unknown }[];
  };
  const widget = explore.widgets?.find(item => item.id === 'TIMESERIES');
  if (!widget?.token || !widget.request) throw new Error('Google Trends 시계열 데이터가 없습니다.');
  const timelineParams = new URLSearchParams({ hl: 'en-US', tz: '0', token: widget.token, req: JSON.stringify(widget.request) });
  const data = parseGoogleJson(await (await request(`${BASE}/api/widgetdata/multiline?${timelineParams}`, cookie)).text()) as {
    default?: { timelineData?: { time: string; value: number[]; isPartial?: boolean | boolean[]; hasData?: boolean[] }[] };
  };
  const rows = data.default?.timelineData;
  if (!Array.isArray(rows)) throw new Error('Google Trends 응답 형식이 변경되었습니다.');
  const points = rows.filter(row => !(Array.isArray(row.isPartial) ? row.isPartial.some(Boolean) : row.isPartial));
  if (points.length < 14) throw new Error('완료된 일별 데이터가 14일 미만입니다.');
  if (points.some(row => !Array.isArray(row.value) || row.value.length !== keywords.length ||
    row.value.some(value => !Number.isFinite(value) || value < 0 || value > 100) || !Number.isFinite(Number(row.time)))) {
    throw new Error('Google Trends 데이터 검증에 실패했습니다.');
  }
  if (!points.some(row => row.value.some(value => value > 0))) throw new Error('검색 데이터가 부족합니다.');
  return points.map(row => ({ date: new Date(Number(row.time) * 1000).toISOString().slice(0, 10), values: row.value }));
}

// Share requests across server renders and avoid bursts against Google.
export function fetchInterest(country: Country, keywords: string[]) {
  const job = queue.then(() => query(country, keywords));
  queue = job.catch(() => undefined).then(() => new Promise(resolve => setTimeout(resolve, 300)));
  return job;
}

export function summarizeInterest(points: InterestPoint[], index: number) {
  const values = points.map(point => point.values[index]);
  const average = (items: number[]) => items.reduce((sum, value) => sum + value, 0) / items.length;
  const current = average(values.slice(-7));
  const previous = average(values.slice(-14, -7));
  const peak = Math.max(...values);
  return {
    // Own-keyword peak normalization prevents comparing separately scaled batches.
    score: peak > 0 ? Math.round(current / peak * 100) : 0,
    growth: previous > 0 ? Math.round((current / previous - 1) * 1000) / 10 : 0,
    growthAvailable: previous > 0,
  };
}
