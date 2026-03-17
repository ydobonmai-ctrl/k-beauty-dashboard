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
    <div className={`border rounded-2xl p-7 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-neutral-200/50 ${highlight
      ? 'bg-white border-fuchsia-200 relative overflow-hidden ring-1 ring-fuchsia-100 shadow-lg shadow-fuchsia-100/50'
      : 'bg-white border-neutral-200 shadow-sm'
      }`}>
      {highlight && (
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-fuchsia-100/40 blur-3xl rounded-full" />
      )}
      <div className="text-[13px] font-black text-neutral-400 mb-4 relative z-10 tracking-widest uppercase">{title}</div>
      <div className={`text-4xl font-black tracking-tighter ${highlight ? 'text-fuchsia-600' : 'text-neutral-900'} mb-2 relative z-10`}>
        {value}
      </div>
      <div className="flex justify-between items-center mt-auto relative z-10 pt-4 border-t border-neutral-50">
        {subtitle && <div className="text-[13px] font-medium text-neutral-500">{subtitle}</div>}
        {trend && (
          <div className={`flex items-center whitespace-nowrap text-[13px] font-black px-2.5 py-1 rounded-lg ${trend.value >= 0
            ? 'text-emerald-600 bg-emerald-50'
            : 'text-rose-600 bg-rose-50'
            }`}>
            {trend.value >= 0 ? '▲' : '▼'} {Math.abs(trend.value)}%
            {trend.label && <span className="text-neutral-400 ml-1.5 font-bold whitespace-nowrap">{trend.label}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
