import { Country, MappedInsight } from '@/types';
import { FxSnapshot } from './fx';

/**
 * Gemini로 상위 키워드 제안 생성 (서버에서만 실행, API 키는 브라우저로 나가지 않음)
 *
 * - 근거로는 실제 데이터만 넘긴다: Google Trends 점수·성장률, 실제 환율 변화.
 *   샘플 매출·재고는 프롬프트에 넣지 않는다 (가짜 데이터로 그럴듯한 결론을 만들지 않게).
 * - 응답은 JSON 스키마로 강제하고, 요청하지 않은 키워드·형식이 틀린 응답은 버린다.
 * - 무료 한도를 아끼려고 3개를 한 번에 묻고 6시간 캐시한다. 한도·과부하면 가벼운 모델로 넘긴다.
 * - 키가 없거나 모두 실패하면 규칙 기반 제안으로 돌아가고, 화면에 그 사실을 표시한다.
 */
export interface AdviceItem {
  keyword: string;
  country: Country;
  score: number;
  growth: number;
  rationale: string;
  recommendation: string;
  watchout: string;
}
export interface AdvisorResult {
  source: 'gemini' | 'rule';
  model?: string;
  generatedAt: string;
  note?: string;
  items: AdviceItem[];
}

const MODELS = ['gemini-2.5-flash', 'gemini-2.5-flash-lite'];
const TTL = 6 * 60 * 60_000;
let cache: { key: string; expires: number; value: Promise<AdvisorResult> } | undefined;

const SCHEMA = {
  type: 'ARRAY',
  items: {
    type: 'OBJECT',
    properties: {
      keyword: { type: 'STRING' },
      country: { type: 'STRING', enum: ['KR', 'US', 'JP'] },
      rationale: { type: 'STRING', description: '입력 수치로 설명 가능한 해석 1~2문장' },
      recommendation: { type: 'STRING', description: '다음 주에 할 수 있는 구체적 행동 1문장' },
      watchout: { type: 'STRING', description: '이 데이터만으로 판단하면 안 되는 점 1문장' },
    },
    required: ['keyword', 'country', 'rationale', 'recommendation', 'watchout'],
  },
};

function pickTargets(insights: MappedInsight[]) {
  // 실제 데이터(검색 관심도 성장률) 기준 상위 3개. 샘플 매출이 섞인 opportunityScore 는 쓰지 않는다.
  return [...insights].filter(i => i.growthAvailable).sort((a, b) => b.growth - a.growth).slice(0, 3);
}

function ruleBased(targets: MappedInsight[], note: string): AdvisorResult {
  return {
    source: 'rule',
    generatedAt: new Date().toISOString(),
    note,
    items: targets.map(t => ({
      keyword: t.keyword, country: t.country, score: t.trendScore, growth: t.growth,
      rationale: t.agentInsight?.rationale ?? '',
      recommendation: t.agentInsight?.recommendation ?? '',
      watchout: '검색 관심도는 구매량·매출이 아닙니다.',
    })),
  };
}

function buildPrompt(targets: MappedInsight[], fx: FxSnapshot) {
  const fxLine = fx.status === 'connected'
    ? fx.rates.filter(r => r.currency !== 'USD')
        .map(r => `USD/${r.currency} ${r.rate} (5영업일 변화 ${r.change7d}%, 일 변동성 ${r.volatility}%)`).join(', ') + ` · 기준일 ${fx.asOf}`
    : '환율 데이터 없음';
  const rows = targets.map(t =>
    `- ${t.country} | ${t.category} | ${t.keyword} | 최근7일 관심도 점수 ${t.trendScore}/100 | 직전 7일 대비 ${t.growth}%`).join('\n');
  return `너는 K-뷰티 브랜드의 해외 마케팅 분석가다. 아래는 실제 Google Trends 검색 관심도와 실제 환율이다.

[검색 관심도 상승 상위 키워드]
${rows}

[환율] ${fxLine}

규칙:
- 위에 있는 숫자만 인용한다. 매출, 판매량, 시장 규모, 경쟁사 정보처럼 주어지지 않은 수치를 만들지 않는다.
- 검색 관심도는 구매 의도나 판매량이 아님을 전제로 해석한다.
- 키워드마다 한 항목씩, 입력과 같은 keyword·country 값으로 한국어로 답한다.`;
}

async function callGemini(prompt: string, apiKey: string) {
  let lastError = '';
  for (const model of MODELS) {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: 'application/json', responseSchema: SCHEMA, temperature: 0.3 },
      }),
      signal: AbortSignal.timeout(30_000),
      cache: 'no-store',
    });
    if (res.status === 429 || res.status === 503) { lastError = `${model} ${res.status}`; continue; }
    if (!res.ok) {
      // Gemini 오류 메시지(예: API key not valid)를 함께 남겨 원인을 바로 알 수 있게 한다. 키 값은 포함되지 않는다.
      const detail = await res.json().then(b => b?.error?.message as string | undefined).catch(() => undefined);
      throw new Error(`${model} HTTP ${res.status}${detail ? `: ${detail.slice(0, 120)}` : ''}`);
    }
    const body = await res.json();
    const text: string | undefined = body?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error(`${model} 빈 응답`);
    return { model, data: JSON.parse(text) as unknown };
  }
  throw new Error(`모든 모델 한도 초과 (${lastError})`);
}

async function generate(targets: MappedInsight[], fx: FxSnapshot): Promise<AdvisorResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return ruleBased(targets, 'GEMINI_API_KEY 없음 → 규칙 기반 제안');
  try {
    const { model, data } = await callGemini(buildPrompt(targets, fx), apiKey);
    if (!Array.isArray(data)) throw new Error('배열이 아닌 응답');
    const items: AdviceItem[] = [];
    for (const t of targets) {
      const hit = data.find((d: Record<string, unknown>) => d?.keyword === t.keyword && d?.country === t.country) as
        Record<string, string> | undefined;
      if (!hit || !hit.rationale || !hit.recommendation) continue; // 요청하지 않았거나 빠진 항목은 버림
      items.push({
        keyword: t.keyword, country: t.country, score: t.trendScore, growth: t.growth,
        rationale: hit.rationale.slice(0, 300), recommendation: hit.recommendation.slice(0, 200),
        watchout: (hit.watchout ?? '').slice(0, 200),
      });
    }
    if (items.length === 0) throw new Error('입력 키워드와 맞는 항목 없음');
    return { source: 'gemini', model, generatedAt: new Date().toISOString(), items };
  } catch (e) {
    return ruleBased(targets, `LLM 호출 실패 (${e instanceof Error ? e.message : e}) → 규칙 기반 제안`);
  }
}

export async function getAdvisor(insights: MappedInsight[], fx: FxSnapshot): Promise<AdvisorResult> {
  const targets = pickTargets(insights);
  if (targets.length === 0) return ruleBased([], 'Google Trends 데이터가 없어 제안을 만들지 않음');
  const key = targets.map(t => `${t.country}:${t.keyword}:${t.growth}`).join('|') + `|${fx.asOf ?? ''}`;
  if (cache && cache.key === key && cache.expires > Date.now()) return cache.value;
  const entry = { key, expires: Infinity, value: generate(targets, fx) };
  cache = entry;
  // 실패(규칙 기반)는 10분만 캐시해 곧 다시 시도한다
  void entry.value.then(r => { entry.expires = Date.now() + (r.source === 'gemini' ? TTL : 10 * 60_000); });
  return entry.value;
}
