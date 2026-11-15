import './typescript-loader.mjs';
import { test } from 'node:test';
import assert from 'node:assert/strict';
const { getFxSnapshot } = await import('../src/lib/api/fx.ts');

// 환율 API가 실패하면 샘플 값으로 채우지 않고 '연결 실패'를 그대로 드러내야 한다.
test('upstream failure is reported, never replaced with sample rates', async () => {
  const original = globalThis.fetch;
  globalThis.fetch = async () => new Response('Too Many Requests', { status: 429 });
  try {
    const fx = await getFxSnapshot();
    assert.equal(fx.status, 'unavailable');
    assert.match(fx.error, /HTTP 429/);
    assert.deepEqual(fx.rates, []);
  } finally {
    globalThis.fetch = original;
  }
});
