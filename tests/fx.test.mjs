import './typescript-loader.mjs';
import { test } from 'node:test';
import assert from 'node:assert/strict';
const { getFxSnapshot } = await import('../src/lib/api/fx.ts');

// Frankfurter 응답을 흉내 내 환율 계산(최신값·5영업일 변화율·추세)을 검증한다. 실제 네트워크는 쓰지 않는다.
test('latest rate, 5-business-day change and trend are computed from the series', async () => {
  const original = globalThis.fetch;
  const krw = [1300, 1301, 1302, 1303, 1304, 1310, 1320, 1330, 1340, 1350];
  const rates = Object.fromEntries(krw.map((v, i) => [`2026-10-${String(i + 10).padStart(2, '0')}`, { KRW: v, JPY: 150 }]));
  let calledUrl = '';
  globalThis.fetch = async (url) => { calledUrl = String(url); return new Response(JSON.stringify({ rates })); };
  try {
    const fx = await getFxSnapshot();
    assert.equal(fx.status, 'connected');
    assert.equal(fx.asOf, '2026-10-19');
    assert.match(calledUrl, /from=USD&to=KRW,JPY/);
    const k = fx.rates.find(r => r.currency === 'KRW');
    assert.equal(k.rate, 1350);
    assert.equal(k.change7d, Number((((1350 - 1304) / 1304) * 100).toFixed(2)));   // 5영업일 전 대비
    assert.equal(k.trend, 'up');
    const j = fx.rates.find(r => r.currency === 'JPY');
    assert.equal(j.trend, 'stable');                                                   // 변화 0.5% 미만은 보합
    assert.equal(j.volatility, 0);
    // 같은 프로세스 안에서는 캐시를 써서 다시 호출하지 않는다
    calledUrl = '';
    await getFxSnapshot();
    assert.equal(calledUrl, '');
  } finally {
    globalThis.fetch = original;
  }
});
