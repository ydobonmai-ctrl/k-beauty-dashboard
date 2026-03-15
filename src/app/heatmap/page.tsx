import { getKeywordTrends } from '@/lib/api/trends';
import { Heatmap } from '@/components/charts/Heatmap';

export default async function HeatmapPage() {
  const [krSkincare, krMakeup, usSkincare, jpMakeup] = await Promise.all([
    getKeywordTrends('KR', '스킨케어'),
    getKeywordTrends('KR', '메이크업'),
    getKeywordTrends('US', '스킨케어'),
    getKeywordTrends('JP', '메이크업')
  ]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-neutral-800 mb-2">키워드 히트맵</h2>
          <p className="text-neutral-500">K-Beauty 주요 키워드별 검색 집약도(0-100) 및 성장 추이 시각화.</p>
        </div>
        <div className="flex gap-2">
          <select className="bg-white border border-neutral-200 shadow-sm text-sm rounded-xl px-4 py-2.5 text-neutral-700 outline-none focus:ring-2 focus:ring-fuchsia-100 transition-all font-medium">
            <option>전체 국가</option>
            <option>한국 (KR)</option>
            <option>미국 (US)</option>
            <option>일본 (JP)</option>
          </select>
        </div>
      </div>

      <div className="grid xl:grid-cols-2 gap-8">
        <Heatmap data={krSkincare} country="KR" category="스킨케어" />
        <Heatmap data={jpMakeup} country="JP" category="메이크업" />
        <Heatmap data={usSkincare} country="US" category="스킨케어" />
        <Heatmap data={krMakeup} country="KR" category="메이크업" />
      </div>
    </div>
  );
}
