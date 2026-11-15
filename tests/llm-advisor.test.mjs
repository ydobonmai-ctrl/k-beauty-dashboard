import './typescript-loader.mjs';
import { test } from 'node:test';
import assert from 'node:assert/strict';
const { getAdvisor } = await import('../src/lib/api/llm-advisor.ts');

const fx = { status: 'connected', asOf: '2026-11-06', fetchedAt: '', rates: [] };
const insight = (keyword, growth, country = 'KR') => ({
  keyword, country, category: '스킨케어', trendScore: 50, growth, growthAvailable: true,
  fxAdjustedRevenue: 0, inventoryLevel: 'low', opportunityScore: 0,
  agentInsight: { rationale: `rule:${keyword}`, recommendation: 'rule', confidence: 0 },
});
const geminiReply = (items) => new Response(JSON.stringify({
  candidates: [{ content: { parts: [{ text: JSON.stringify(items) }] } }],
}));

test('without an API key the advisor falls back to labeled rule-based advice', async () => {
  delete process.env.GEMINI_API_KEY;
  const r = await getAdvisor([insight('a', 10), insight('b', 30), insight('c', 20)], fx);
  assert.equal(r.source, 'rule');
  assert.match(r.note, /GEMINI_API_KEY/);
  assert.deepEqual(r.items.map(i => i.keyword), ['b', 'c', 'a']);   // 실데이터(관심도 성장률) 기준 정렬
});

test('LLM output is validated: unrequested keywords dropped, sample sales never sent', async () => {
  process.env.GEMINI_API_KEY = 'test-key';
  const original = globalThis.fetch;
  let prompt = '';
  globalThis.fetch = async (_url, options) => {
    prompt = JSON.parse(options.body).contents[0].parts[0].text;
    return geminiReply([
      { keyword: 'PDRN 세럼', country: 'KR', rationale: 'r1', recommendation: 'do1', watchout: 'w1' },
      { keyword: '지어낸 키워드', country: 'KR', rationale: 'x', recommendation: 'x', watchout: 'x' },
      { keyword: '립틴트', country: 'US', rationale: '', recommendation: 'missing rationale', watchout: '' },
    ]);
  };
  try {
    const r = await getAdvisor([insight('PDRN 세럼', 90), insight('립틴트', 50, 'US'), insight('수분 크림', 5)], fx);
    assert.equal(r.source, 'gemini');
    assert.deepEqual(r.items.map(i => i.keyword), ['PDRN 세럼']);     // 요청 외 키워드·빈 항목은 폐기
    assert.doesNotMatch(prompt, /inventory|재고|매출 \d/);              // 샘플 매출·재고는 프롬프트에 없음
  } finally {
    globalThis.fetch = original;
  }
});

test('rate limit on the main model falls back to the lighter model', async () => {
  process.env.GEMINI_API_KEY = 'test-key';
  const original = globalThis.fetch;
  const models = [];
  globalThis.fetch = async (url) => {
    models.push(String(url).match(/models\/([^:]+)/)[1]);
    if (models.length === 1) return new Response('{}', { status: 429 });
    return geminiReply([{ keyword: '선크림', country: 'JP', rationale: 'r', recommendation: 'd', watchout: 'w' }]);
  };
  try {
    const r = await getAdvisor([insight('선크림', 70, 'JP')], fx);
    assert.deepEqual(models, ['gemini-2.5-flash', 'gemini-2.5-flash-lite']);
    assert.equal(r.model, 'gemini-2.5-flash-lite');
  } finally {
    globalThis.fetch = original;
  }
});
