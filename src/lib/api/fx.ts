import { FxRate } from '@/types';

/**
 * 실제 환율: Frankfurter API (유럽중앙은행 기준 환율, 영업일 1회 갱신, API 키 불필요)
 * https://frankfurter.dev
 *
 * 최근 약 3주 시계열을 받아
 *  - rate: 가장 최근 영업일 환율 (1 USD 당)
 *  - change7d: 5영업일 전 대비 변화율(%)
 *  - volatility: 일별 변화율의 표준편차(%)
 * 를 계산한다. 실패하면 빈 배열과 오류를 돌려주고, 샘플 환율로 대체하지 않는다.
 */
export interface FxSnapshot {
  status: 'connected' | 'unavailable';
  asOf?: string;
  fetchedAt: string;
  error?: string;
  rates: FxRate[];
}

const API = 'https://api.frankfurter.app';
const CURRENCIES = ['KRW', 'JPY'] as const;
let cache: { expires: number; value: Promise<FxSnapshot> } | undefined;

function isoDaysAgo(days: number) {
  return new Date(Date.now() - days * 86_400_000).toISOString().slice(0, 10);
}

async function loadFx(): Promise<FxSnapshot> {
  const fetchedAt = new Date().toISOString();
  try {
    const res = await fetch(`${API}/${isoDaysAgo(21)}..?from=USD&to=${CURRENCIES.join(',')}`, {
      signal: AbortSignal.timeout(8000),
      cache: 'no-store',
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const body = await res.json() as { rates: Record<string, Record<string, number>> };
    const dates = Object.keys(body.rates ?? {}).sort();
    if (dates.length < 6) throw new Error('시계열이 너무 짧음');

    const rates: FxRate[] = [{ currency: 'USD', rate: 1, trend: 'stable', volatility: 0, change7d: 0 }];
    for (const cur of CURRENCIES) {
      const series = dates.map(d => body.rates[d][cur]).filter((v): v is number => typeof v === 'number');
      const last = series[series.length - 1];
      const weekAgo = series[series.length - 6];
      const change7d = ((last - weekAgo) / weekAgo) * 100;
      const daily = series.slice(1).map((v, i) => ((v - series[i]) / series[i]) * 100);
      const mean = daily.reduce((a, b) => a + b, 0) / daily.length;
      const volatility = Math.sqrt(daily.reduce((a, b) => a + (b - mean) ** 2, 0) / daily.length);
      rates.push({
        currency: cur,
        rate: Number(last.toFixed(2)),
        // 달러 대비 현지 통화 약세(환율 상승) = 달러 매출 환산 시 불리, 0.5% 미만은 보합
        trend: change7d > 0.5 ? 'up' : change7d < -0.5 ? 'down' : 'stable',
        volatility: Number(volatility.toFixed(2)),
        change7d: Number(change7d.toFixed(2)),
      });
    }
    return { status: 'connected', asOf: dates[dates.length - 1], fetchedAt, rates };
  } catch (e) {
    return { status: 'unavailable', fetchedAt, error: e instanceof Error ? e.message : String(e), rates: [] };
  }
}

export async function getFxSnapshot(): Promise<FxSnapshot> {
  if (cache && cache.expires > Date.now()) return cache.value;
  const entry = { expires: Infinity, value: loadFx() };
  cache = entry;
  void entry.value.then(s => { entry.expires = Date.now() + (s.status === 'connected' ? 60 * 60_000 : 5 * 60_000); });
  return entry.value;
}

export async function getFxRates(): Promise<FxRate[]> {
  return (await getFxSnapshot()).rates;
}
