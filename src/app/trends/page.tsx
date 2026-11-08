import { getTrendsData, getMappedInsights } from '@/lib/api/trends';
import { TrendChart } from '@/components/charts/TrendChart';
import { TrendsLeaderboard } from '@/components/dashboard/TrendsLeaderboard';
import { RisingStars } from '@/components/dashboard/RisingStars';
import { TrendsSource } from '@/components/dashboard/TrendsSource';

export default async function TrendsPage() {
  const [krTrends, usTrends, jpTrends, insights] = await Promise.all([
    getTrendsData('KR', 30),
    getTrendsData('US', 30),
    getTrendsData('JP', 30),
    getMappedInsights()
  ]);
  const comparable = insights.filter(i => i.growthAvailable);
  const leader = [...comparable].sort((a, b) => b.growth - a.growth)[0];
  const averageGrowth = comparable.length ? comparable.reduce((sum, i) => sum + i.growth, 0) / comparable.length : null;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <TrendsSource />
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tighter text-neutral-800 mb-2">글로벌 수요 인텔리전스</h2>
          <p className="text-neutral-500 font-medium text-lg italic">Data-driven Trend Analysis for Strategic Expansion</p>
        </div>
        <div className="bg-white/50 backdrop-blur-md border border-neutral-200 rounded-2xl p-4 shadow-sm flex items-center space-x-6">
          <div className="text-center">
            <div className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">분석 대상</div>
            <div className="text-sm font-black text-neutral-800">3개 국가 / 12개 검색어 · 수집 {insights.length}건</div>
          </div>
          <div className="w-px h-8 bg-neutral-200" />
          <div className="text-center">
            <div className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">데이터 기준일</div>
            <div className="text-sm font-black text-neutral-800">최근 30일 간</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <TrendsLeaderboard insights={insights} />
        </div>
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-2xl rounded-full -mr-16 -mt-16" />
            <h4 className="text-sm font-black tracking-widest uppercase text-neutral-400 mb-4">Market Insight</h4>
            <p className="text-lg font-bold leading-relaxed mb-6">{leader ? `${leader.country}의 '${leader.keyword}' 검색 관심도 변화율이 ${leader.growth}%로 수집한 검색어 중 가장 높습니다.` : '비교할 검색 데이터가 없습니다.'}</p>
          </div>

          <div className="bg-white border border-neutral-200 rounded-3xl p-6 shadow-sm">
            <h4 className="text-xs font-black tracking-widest uppercase text-neutral-500 mb-4">주요 성장 지표</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-neutral-500 font-bold">수집 검색어 평균 관심도 변화율</span>
                <span className="font-black text-emerald-600">{averageGrowth === null ? '비교 불가' : `${averageGrowth.toFixed(1)}%`}</span>
              </div>
              <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.min(100, Math.max(0, averageGrowth ?? 0))}%` }} />
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-neutral-500 font-bold">성장률 비교 가능 데이터</span>
                <span className="font-black text-fuchsia-600">{comparable.length} / {insights.length}건</span>
              </div>
              <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                <div className="h-full bg-fuchsia-500 rounded-full" style={{ width: `${insights.length ? comparable.length / insights.length * 100 : 0}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-black text-neutral-800 tracking-tighter">Rising Stars (고성장 유망주)</h3>
        <RisingStars insights={insights} />
      </div>

      <div className="pt-8 border-t border-neutral-100">
        <h3 className="text-xl font-black text-neutral-800 tracking-tighter mb-8">국가별 상세 트렌드 추이</h3>
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white border border-neutral-200 rounded-3xl p-8 shadow-sm">
            <TrendChart data={krTrends} title="대한민국 (KR)" />
          </div>
          <div className="bg-white border border-neutral-200 rounded-3xl p-8 shadow-sm">
            <TrendChart data={usTrends} title="미국 (US)" />
          </div>
          <div className="bg-white border border-neutral-200 rounded-3xl p-8 shadow-sm lg:col-span-2">
            <TrendChart data={jpTrends} title="일본 (JP)" />
          </div>
        </div>
      </div>
    </div>
  );
}
