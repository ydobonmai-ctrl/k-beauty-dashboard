import './typescript-loader.mjs';
import { test } from 'node:test';
import assert from 'node:assert/strict';
const { getTrendsSnapshot, getMappedInsights } = await import('../src/lib/api/trends.ts');

test('country snapshots deduplicate requests, preserve country joins and expose failures', async () => {
  const original = globalThis.fetch;
  let calls = 0;
  globalThis.fetch = async (url) => {
    calls++;
    const parsed = new URL(url);
    if (parsed.pathname.endsWith('/trends/')) return new Response('');
    const req = JSON.parse(parsed.searchParams.get('req'));
    if (parsed.pathname.endsWith('/explore')) return new Response(JSON.stringify({ widgets: [
      { id: 'TIMESERIES', token: 'test', request: req },
    ] }));
    const geo = req.comparisonItem[0].geo;
    if (geo === 'JP') return new Response('upstream unavailable', { status: 503 });
    const size = req.comparisonItem.length;
    return new Response(JSON.stringify({ default: { timelineData: Array.from({ length: 30 }, (_, i) => ({
      time: String(1700000000 + i * 86400),
      value: Array.from({ length: size }, () => i < 23 ? 10 : geo === 'KR' ? 20 : 30),
    })) } }));
  };
  try {
    const [kr, duplicate] = await Promise.all([getTrendsSnapshot('KR'), getTrendsSnapshot('KR')]);
    assert.equal(kr, duplicate);
    assert.equal(kr.status, 'connected');
    assert.equal(kr.keywords.length, 12);
    const count = calls;
    await getTrendsSnapshot('KR');
    assert.equal(calls, count);
    const insights = await getMappedInsights();
    assert.equal(insights.filter(i => i.country === 'KR').length, 12);
    assert.equal(insights.filter(i => i.country === 'US').length, 12);
    assert.equal(insights.find(i => i.country === 'KR').growth, 100);
    assert.equal(insights.find(i => i.country === 'US').growth, 200);
    assert.equal(insights.filter(i => i.country === 'JP').length, 0);
    const jp = await getTrendsSnapshot('JP');
    assert.equal(jp.status, 'unavailable');
    assert.deepEqual(jp.timeline, []);
    assert.deepEqual(jp.keywords, []);
    assert.match(jp.error, /503/);
  } finally { globalThis.fetch = original; }
});
