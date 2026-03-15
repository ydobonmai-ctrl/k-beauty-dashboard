interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    label?: string;
  };
  highlight?: boolean;
}

export function StatCard({ title, value, subtitle, trend, highlight }: StatCardProps) {
  return (
    <div className={`border rounded-xl p-6 flex flex-col justify-between transition-all ${highlight
        ? 'bg-gradient-to-br from-fuchsia-900/50 to-neutral-900 border-fuchsia-500/30 relative overflow-hidden'
        : 'bg-neutral-900 border-neutral-800'
      }`}>
      {highlight && (
        <div className="absolute -top-10 -right-10 w-24 h-24 bg-fuchsia-500/20 blur-2xl rounded-full" />
      )}
      <div className="text-sm font-medium text-neutral-400 mb-3 relative z-10">{title}</div>
      <div className={`text-4xl font-black tracking-tighter ${highlight ? 'text-white' : 'text-neutral-50'} mb-2 relative z-10`}>
        {value}
      </div>
      <div className="flex justify-between items-center mt-auto relative z-10">
        {subtitle && <div className="text-sm text-neutral-500">{subtitle}</div>}
        {trend && (
          <div className={`flex items-center text-sm font-bold px-2 py-0.5 rounded-md ${trend.value >= 0
              ? 'text-emerald-400 bg-emerald-400/10'
              : 'text-rose-400 bg-rose-400/10'
            }`}>
            {trend.value >= 0 ? '+' : ''}{trend.value}%
            {trend.label && <span className="text-neutral-400 ml-1.5 font-medium">{trend.label}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
