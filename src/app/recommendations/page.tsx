import { AlertCard } from '@/components/dashboard/AlertCard';
import { Alert } from '@/types';

const recommendations: Alert[] = [
  {
    id: 'rec-1',
    type: 'opportunity',
    title: 'PDRN Serum: Increase US Allocation',
    description: 'Demand in the US has risen 25% MoM, but current inventory allocation is low. Shifting 15% of KR reserve to US warehouses could capture $450k in unfulfilled demand.',
    severity: 'high',
    country: 'US',
    category: 'Skincare'
  },
  {
    id: 'rec-2',
    type: 'risk',
    title: 'Color Balm: Impending KR Oversupply',
    description: 'Search trends have plateaued and dropped 12% in the last week. With high inventory levels remaining, consider initiating promotional bundling before Q3.',
    severity: 'medium',
    country: 'KR',
    category: 'Makeup'
  },
  {
    id: 'rec-3',
    type: 'opportunity',
    title: 'Cushion Foundation: JP Pricing Leverage',
    description: 'Strong sustained interest (Score: 92) in Japan despite JPY weakness. Price elasticity models suggest a 5% price increase will have negligible volume impact while recovering FX losses.',
    severity: 'medium',
    country: 'JP',
    category: 'Makeup'
  },
  {
    id: 'rec-4',
    type: 'info',
    title: 'Cleansing Balm: Maintain Status Quo',
    description: 'Demand across all 3 key markets is stable. Inventory levels are perfectly balanced. No immediate action required.',
    severity: 'low',
    category: 'Skincare'
  }
];

export default function RecommendationsPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white mb-2">Automated Actions</h2>
          <p className="text-neutral-400">AI-generated recommendations based on cross-referencing demand, FX, and sales/inventory data.</p>
        </div>
      </div>

      <div className="space-y-4">
        {recommendations.map(rec => (
          <AlertCard key={rec.id} alert={rec} />
        ))}
      </div>
    </div>
  );
}
