import { getTrendsData } from '@/lib/api/trends';
import { getFxRates } from '@/lib/api/fx';
import { getInternalSales } from '@/lib/api/sales';
import { TrendChart } from '@/components/charts/TrendChart';
import { StatCard } from '@/components/dashboard/StatCard';
import { AlertCard } from '@/components/dashboard/AlertCard';
import { Alert } from '@/types';

export default async function OverviewPage() {
  const [krTrends, usTrends, fxRates] = await Promise.all([
    getTrendsData('KR', 14),
    getTrendsData('US', 14),
    getFxRates(),
  ]);

  const jpRate = fxRates.find(r => r.currency === 'JPY')?.rate || 151;
  const krRate = fxRates.find(r => r.currency === 'KRW')?.rate || 1350;

  const alerts: Alert[] = [
    {
      id: '1',
      type: 'opportunity',
      title: 'PDRN Serum breakout in KR',
      description: 'Search interest up 120% week-over-week. Inventory is currently marked as LOW. Immediate production increase recommended.',
      severity: 'high',
      country: 'KR',
      category: 'Skincare'
    },
    {
      id: '2',
      type: 'risk',
      title: 'JPY Exchange Rate Headwind',
      description: 'JPY depreciated 2% against USD. Margins on cushion foundation exports may be impacted. Consider FX hedging.',
      severity: 'medium',
      country: 'JP'
    },
    {
      id: '3',
      type: 'info',
      title: 'Lip Gloss trending steadily in US',
      description: 'US search volume for lip gloss has stabilized at high levels. Current inventory is sufficient to meet projected demand.',
      severity: 'low',
      country: 'US',
      category: 'Makeup'
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Global Brand Demand"
          value="84.2"
          subtitle="Google Trends Index"
          trend={{ value: 12.5, label: 'vs last week' }}
          highlight
        />
        <StatCard
          title="Top Category (KR)"
          value="Skincare"
          subtitle="PDRN Serum"
          trend={{ value: 45, label: 'MoM' }}
        />
        <StatCard
          title="USD/KRW Rate"
          value={krRate}
          subtitle="Export conversion"
          trend={{ value: 1.2, label: 'Favorable' }}
        />
        <StatCard
          title="USD/JPY Rate"
          value={jpRate}
          subtitle="Export conversion"
          trend={{ value: -0.8, label: 'Unfavorable' }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          <TrendChart data={krTrends} title="Korea Market Demand (14 Days)" />
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold tracking-tight text-white">Intelligence Alerts</h3>
            <span className="bg-rose-500/20 text-rose-400 text-xs font-bold px-2.5 py-1 rounded-full border border-rose-500/20">
              3 New
            </span>
          </div>
          <div className="flex-1 space-y-4 overflow-y-auto pr-2">
            {alerts.map(alert => (
              <AlertCard key={alert.id} alert={alert} />
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          <TrendChart data={usTrends} title="US Market Demand (14 Days)" />
        </div>
      </div>
    </div>
  );
}
