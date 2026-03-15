import { getKeywordTrends } from '@/lib/api/trends';
import { Heatmap } from '@/components/charts/Heatmap';

export default async function HeatmapPage() {
  const [krSkincare, krMakeup, usSkincare, jpMakeup] = await Promise.all([
    getKeywordTrends('KR', 'Skincare'),
    getKeywordTrends('KR', 'Makeup'),
    getKeywordTrends('US', 'Skincare'),
    getKeywordTrends('JP', 'Makeup')
  ]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white mb-2">Keyword Heatmap</h2>
          <p className="text-neutral-400">Relative search intensity (0-100) and momentum for specific K-Beauty keywords.</p>
        </div>
        <div className="flex gap-2">
          <select className="bg-neutral-900 border border-neutral-700 text-sm rounded-lg px-4 py-2 text-white outline-none focus:border-fuchsia-500 transition-colors">
            <option>All Countries</option>
            <option>KR Only</option>
            <option>US Only</option>
            <option>JP Only</option>
          </select>
        </div>
      </div>

      <div className="grid xl:grid-cols-2 gap-8">
        <Heatmap data={krSkincare} country="KR" category="Skincare" />
        <Heatmap data={jpMakeup} country="JP" category="Makeup" />
        <Heatmap data={usSkincare} country="US" category="Skincare" />
        <Heatmap data={krMakeup} country="KR" category="Makeup" />
      </div>
    </div>
  );
}
