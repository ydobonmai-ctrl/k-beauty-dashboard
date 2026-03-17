import { getFxRates } from '@/lib/api/fx';
import { getTrendsData, getMappedInsights } from '@/lib/api/trends';
import { StatCard } from '@/components/dashboard/StatCard';
import { AlertCard } from '@/components/dashboard/AlertCard';
import { TrendChart } from '@/components/charts/TrendChart';
import { ExecutiveSummary } from '@/components/dashboard/ExecutiveSummary';
import { OpportunityMatrix } from '@/components/charts/OpportunityMatrix';
import { AgentAdvisor } from '@/components/dashboard/AgentAdvisor';
import { Alert } from '@/types';

export default async function DashboardOverview() {
  const [fxRates, krTrends, usTrends, insights] = await Promise.all([
    getFxRates(),
    getTrendsData('KR', 14),
    getTrendsData('US', 14),
    getMappedInsights()
  ]);

  const krRate = fxRates.find(f => f.currency === 'KRW')?.rate.toLocaleString() || '0';
  const jpRate = fxRates.find(f => f.currency === 'JPY')?.rate.toLocaleString() || '0';

  const alerts: Alert[] = [
    {
      id: '1',
      type: 'opportunity',
      title: 'PDRN 세럼 한국 시장 급성장',
      description: '검색 관심도가 전주 대비 120% 상승했습니다. 현재 재고 수준은 "낮음"으로 확인됩니다. 즉시 생산량 확대를 권장합니다.',
      severity: 'high',
      country: 'KR',
      category: '스킨케어'
    },
    {
      id: '2',
      type: 'risk',
      title: '엔저 현상에 따른 수익성 악화 우려',
      description: '엔화 가치가 달러 대비 2% 하락했습니다. 쿠션 파운데이션 수출 마진에 영향이 예상됩니다. FX 헤징 검토가 필요합니다.',
      severity: 'medium',
      country: 'JP'
    },
    {
      id: '3',
      type: 'info',
      title: '미국 시장 립글로스 수요 안정세',
      description: '미국 내 립글로스 검색량이 높은 수준에서 안정화되었습니다. 현재 재고로 예상 수요 대응이 가능합니다.',
      severity: 'low',
      country: 'US',
      category: '메이크업'
    }
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      {/* 1. Pulse Metrics Layer */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="글로벌 브랜드 수요 지수"
          value="84.2"
          subtitle="구글 트렌드 색인"
          trend={{ value: 12.5, label: '전주 대비' }}
          highlight
        />
        <StatCard
          title="최고 인기 카테고리 (KR)"
          value="스킨케어"
          subtitle="PDRN 세럼"
          trend={{ value: 45, label: '전월 대비' }}
        />
        <StatCard
          title="환율 (USD/KRW)"
          value={krRate}
          subtitle="수출 환산 기준"
          trend={{ value: 1.2, label: '우호적' }}
        />
        <StatCard
          title="환율 (USD/JPY)"
          value={jpRate}
          subtitle="수출 환산 기준"
          trend={{ value: -0.8, label: '주의' }}
        />
      </div>

      {/* 2. Executive Strategy & Urgent Risks Layer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ExecutiveSummary insights={insights} />
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 rounded-3xl p-8 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black tracking-tighter text-neutral-800 dark:text-neutral-200">긴급 이슈</h3>
            <span className="bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 text-[11px] font-black px-3 py-1 rounded-full border border-rose-100 dark:border-rose-900/50 uppercase tracking-wider">
              2개 처리 필요
            </span>
          </div>
          <div className="flex-1 space-y-6 overflow-y-auto max-h-[320px] pr-2 custom-scrollbar">
            {alerts.filter(a => a.severity === 'high').map(alert => (
              <AlertCard key={alert.id} alert={alert} />
            ))}
          </div>
        </div>
      </div>

      {/* 3. Intelligence & Visual Analysis Layer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <AgentAdvisor insights={insights} />
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
