import { getTrendsData } from '@/lib/api/trends';
import { TrendChart } from '@/components/charts/TrendChart';

export default async function TrendsPage() {
  const [krTrends, usTrends, jpTrends] = await Promise.all([
    getTrendsData('KR', 30),
    getTrendsData('US', 30),
    getTrendsData('JP', 30),
  ]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white mb-2">Category Demand Trends</h2>
          <p className="text-neutral-400">Comparing Skincare and Makeup search interest across key regions.</p>
        </div>
        <div className="flex gap-2">
          <select className="bg-neutral-900 border border-neutral-700 text-sm rounded-lg px-4 py-2 text-white outline-none focus:border-fuchsia-500 transition-colors">
            <option>Last 30 Days</option>
            <option>Last 90 Days</option>
          </select>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          <TrendChart data={krTrends} title="South Korea (KR)" />
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          <TrendChart data={usTrends} title="United States (US)" />
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 lg:col-span-2">
          <TrendChart data={jpTrends} title="Japan (JP)" />
        </div>
      </div>
    </div>
  );
}
