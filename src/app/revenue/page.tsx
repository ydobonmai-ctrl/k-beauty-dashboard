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
          <h2 className="text-2xl font-bold tracking-tight text-white mb-2">FX-Adjusted Revenue</h2>
          <p className="text-neutral-400">Internal sales performance normalized to USD with currency impacts.</p>
        </div>
        <div className="px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-sm text-neutral-300">
          Base: <span className="text-emerald-400 font-bold ml-1">USD</span>
        </div>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-neutral-300">
            <thead className="bg-neutral-950/50 text-neutral-400 uppercase text-xs font-semibold border-b border-neutral-800">
              <tr>
                <th className="px-6 py-4">Product / Keyword</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Region</th>
                <th className="px-6 py-4 text-right">Local Rev (Est)</th>
                <th className="px-6 py-4 text-right">USD Adjusted</th>
                <th className="px-6 py-4">Impact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/50">
              {allSales.map((sale, idx) => {
                const isKR = sale.country === 'KR';
                const localStr = isKR ? `₩${(sale.revenue * krwRate).toLocaleString()}` : `$${sale.revenue.toLocaleString()}`;
                const usdStr = `$${sale.revenue.toLocaleString()}`;

                return (
                  <tr key={idx} className="hover:bg-neutral-800/20 transition-colors">
                    <td className="px-6 py-4 font-medium text-white">{sale.keyword}</td>
                    <td className="px-6 py-4 text-neutral-400">{sale.category}</td>
                    <td className="px-6 py-4">
                      <span className="bg-neutral-800 px-2 py-1 rounded text-xs font-bold">{sale.country}</span>
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-neutral-400">{localStr}</td>
                    <td className="px-6 py-4 text-right font-mono font-bold text-fuchsia-300">{usdStr}</td>
                    <td className="px-6 py-4">
                      {isKR ? (
                        <span className="text-emerald-400 text-xs font-bold px-2 py-1 bg-emerald-400/10 rounded">+1.2%</span>
                      ) : (
                        <span className="text-neutral-500 text-xs px-2 py-1">—</span>
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
