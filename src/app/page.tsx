import { getFxSnapshot } from '@/lib/api/fx';
import { getTrendsData, getMappedInsights } from '@/lib/api/trends';
import { getAdvisor } from '@/lib/api/llm-advisor';
import { StatCard } from '@/components/dashboard/StatCard';
import { AlertCard } from '@/components/dashboard/AlertCard';
import { TrendChart } from '@/components/charts/TrendChart';
import { ExecutiveSummary } from '@/components/dashboard/ExecutiveSummary';
import { OpportunityMatrix } from '@/components/charts/OpportunityMatrix';
import { AgentAdvisor } from '@/components/dashboard/AgentAdvisor';
import { Alert } from '@/types';
import { TrendsSource } from '@/components/dashboard/TrendsSource';

export default async function DashboardOverview() {
  const [fx, krTrends, insights] = await Promise.all([
    getFxSnapshot(),
    getTrendsData('KR', 14),
    getMappedInsights()
  ]);
  const advisor = await getAdvisor(insights, fx);

  const krw = fx.rates.find(f => f.currency === 'KRW');
  const jpy = fx.rates.find(f => f.currency === 'JPY');
  const fxSubtitle = fx.status === 'connected' ? `ECB 기준 환율 · ${fx.asOf}` : `환율 연결 실패 (${fx.error})`;

  const topKeyword = [...insights].filter(i => i.growthAvailable).sort((a, b) => b.growth - a.growth)[0];
  const krTop = [...insights].filter(i => i.country === 'KR' && i.growthAvailable).sort((a, b) => b.growth - a.growth)[0];
  const alerts: Alert[] = insights.filter(i => i.growthAvailable && i.growth > 30).slice(0, 3).map(i => ({
    id: `${i.country}-${i.keyword}`, type: 'info', title: `${i.country} · ${i.keyword} 검색 관심도 상승`,
    description: `최근 7일 평균 관심도가 직전 7일 대비 ${i.growth}% 상승했습니다. 검색 관심도는 구매량이나 매출을 의미하지 않습니다.`,
    severity: 'high', country: i.country, category: i.category,
  }));

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      <TrendsSource />
      {/* 1. Pulse Metrics Layer */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="최고 검색 관심도 성장 키워드"
          value={topKeyword?.keyword ?? '데이터 없음'}
          subtitle={topKeyword ? `${topKeyword.country} · Google Trends` : '연결 상태 확인'}
          trend={topKeyword ? { value: topKeyword.growth, label: '직전 7일 대비' } : undefined}
          highlight
        />
        <StatCard
          title="한국 검색 관심도 성장 키워드"
          value={krTop?.keyword ?? '데이터 없음'}
          subtitle={krTop?.category ?? '연결 상태 확인'}
          trend={krTop ? { value: krTop.growth, label: '직전 7일 대비' } : undefined}
        />
        <StatCard
          title="환율 (USD/KRW)"
          value={krw ? krw.rate.toLocaleString() : '연결 실패'}
          subtitle={fxSubtitle}
          trend={krw ? { value: krw.change7d, label: '5영업일 대비' } : undefined}
        />
        <StatCard
          title="환율 (USD/JPY)"
          value={jpy ? jpy.rate.toLocaleString() : '연결 실패'}
          subtitle={fxSubtitle}
          trend={jpy ? { value: jpy.change7d, label: '5영업일 대비' } : undefined}
        />
      </div>

      {/* 2. Executive Strategy & Urgent Risks Layer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ExecutiveSummary insights={insights} />
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 rounded-3xl p-8 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black tracking-tighter text-neutral-800 dark:text-neutral-200">검색 관심도 변화</h3>
            <span className="bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 text-[11px] font-black px-3 py-1 rounded-full border border-rose-100 dark:border-rose-900/50 uppercase tracking-wider">
              {alerts.length}개 키워드
            </span>
          </div>
          <div className="flex-1 space-y-6 overflow-y-auto max-h-[320px] pr-2 custom-scrollbar">
            {alerts.length === 0 && <p className="text-neutral-500">표시할 급상승 키워드가 없습니다.</p>}
            {alerts.filter(a => a.severity === 'high').map(alert => (
              <AlertCard key={alert.id} alert={alert} />
            ))}
          </div>
        </div>
      </div>

      {/* 3. Intelligence & Visual Analysis Layer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <AgentAdvisor advisor={advisor} />
        </div>

        <div className="lg:col-span-2 space-y-8">
          <OpportunityMatrix insights={insights} />

          <div className="bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 rounded-3xl p-8 shadow-sm">
            <TrendChart data={krTrends} title="한국 시장 수요 트렌드 (14일)" />
          </div>
        </div>
      </div>
    </div>
  );
}
