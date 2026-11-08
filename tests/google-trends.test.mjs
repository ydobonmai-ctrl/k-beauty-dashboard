import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseGoogleJson, summarizeInterest, fetchInterest } from '../src/lib/api/google-trends.ts';

test('Google anti-XSSI prefixes are parsed for both endpoints', () => {
  assert.deepEqual(parseGoogleJson(")]}'\n{\"widgets\":[]}"), { widgets: [] });
  assert.deepEqual(parseGoogleJson(")]}',\n{\"default\":{}}"), { default: {} });
  assert.throws(() => parseGoogleJson('<html>blocked</html>'));
});
test('week-on-week growth and own-keyword normalization', () => {
  const points = Array.from({ length: 14 }, (_, i) => ({ date: `day${i}`, values: [i < 7 ? 10 : 20, 0] }));
  assert.deepEqual(summarizeInterest(points, 0), { score: 100, growth: 100, growthAvailable: true });
  assert.deepEqual(summarizeInterest(points, 1), { score: 0, growth: 0, growthAvailable: false });
});
test('partial rows are excluded and cookie session is reused', async () => {
  const original = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async (url, options) => {
    calls.push({ url: String(url), options });
    if (String(url).includes('/?geo=')) return new Response('', { headers: { 'set-cookie': 'NID=test-session; Path=/' } });
    if (String(url).includes('/api/explore?')) return new Response(JSON.stringify({ widgets: [{ id: 'TIMESERIES', token: 'token', request: {} }] }));
    return new Response(JSON.stringify({ default: { timelineData: Array.from({ length: 15 }, (_, i) => ({
      time: String(1700000000 + i * 86400), value: [10, 20], isPartial: i === 14,
    })) } }));
  };
  try {
    const points = await fetchInterest('US', ['skincare', 'makeup']);
    assert.equal(points.length, 14);
    assert.equal(calls[1].options.headers.Cookie, 'NID=test-session');
    assert.equal(new URL(calls[1].url).searchParams.get('req').includes('"geo":"US"'), true);
    await fetchInterest('JP', ['スキンケア', 'メイクアップ']);
    assert.equal(calls.filter(call => call.url.includes('/?geo=')).length, 1);
    let failedCalls = 0;
    globalThis.fetch = async () => { failedCalls++; return new Response('limited', { status: 429 }); };
    await assert.rejects(fetchInterest('KR', ['스킨케어', '메이크업']), /429/);
    await assert.rejects(fetchInterest('KR', ['스킨케어', '메이크업']), /요청 제한/);
    assert.equal(failedCalls, 1);
  } finally { globalThis.fetch = original; }
});
