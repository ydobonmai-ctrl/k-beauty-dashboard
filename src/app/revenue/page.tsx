import { getInternalSales } from '@/lib/api/sales';
import { getFxRates } from '@/lib/api/fx';

export default async function RevenuePage() {
  const [krSales, usSales, fxRates] = await Promise.all([
    getInternalSales('KR'),
    getInternalSales('US'),
    getFxRates(),
  ]);

  const allSales = [...krSales, ...usSales].sort((a, b) => b.revenue - a.revenue);
  const krwRate = fxRates.find(r => r.currency === 'KRW')?.rate || 1350;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-neutral-800 mb-2">수익 분석 (환율 반영)</h2>
          <p className="text-neutral-500">통화 변동성을 반영하여 USD로 환산된 내부 매출 실적 보고서.</p>
        </div>
        <div className="px-4 py-2.5 bg-white border border-neutral-200 shadow-sm rounded-xl text-sm text-neutral-600 font-bold">
          기준 통화: <span className="text-fuchsia-600 ml-1">USD</span>
        </div>
      </div>

      <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-neutral-600">
            <thead className="bg-neutral-50 text-neutral-500 uppercase text-[11px] font-black border-b border-neutral-100 italic tracking-widest">
              <tr>
                <th className="px-8 py-5">제품 / 키워드</th>
                <th className="px-8 py-5">카테고리</th>
                <th className="px-8 py-5">지역</th>
                <th className="px-8 py-5 text-right">현지 매출 (추정)</th>
                <th className="px-8 py-5 text-right">USD 환산</th>
                <th className="px-8 py-5">변동 영향</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {allSales.map((sale, idx) => {
                const isKR = sale.country === 'KR';
                const localStr = isKR ? `₩${(sale.revenue * krwRate).toLocaleString()}` : `$${sale.revenue.toLocaleString()}`;
                const usdStr = `$${sale.revenue.toLocaleString()}`;

                return (
                  <tr key={idx} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-8 py-5 font-bold text-neutral-900">{sale.keyword}</td>
                    <td className="px-8 py-5 text-neutral-500 font-medium">{sale.category}</td>
                    <td className="px-8 py-5">
                      <span className="bg-neutral-100 text-neutral-700 px-2.5 py-1 rounded-lg text-[11px] font-black">{sale.country}</span>
                    </td>
                    <td className="px-8 py-5 text-right font-mono text-neutral-500">{localStr}</td>
                    <td className="px-8 py-5 text-right font-mono font-black text-fuchsia-600">{usdStr}</td>
                    <td className="px-8 py-5">
                      {isKR ? (
                        <span className="text-emerald-600 text-[11px] font-black px-2 py-0.5 bg-emerald-50 rounded-md">+1.2%</span>
                      ) : (
                        <span className="text-neutral-300 text-xs px-2 py-1">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
