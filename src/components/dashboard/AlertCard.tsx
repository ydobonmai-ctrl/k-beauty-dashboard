import { Alert } from '@/types';
import { AlertCircle, AlertTriangle, TrendingUp } from 'lucide-react';

interface AlertCardProps {
  alert: Alert;
}

export function AlertCard({ alert }: AlertCardProps) {
  const getIcon = () => {
    switch (alert.type) {
      case 'risk': return <AlertTriangle className="w-5 h-5 text-rose-500 mt-0.5" />;
      case 'opportunity': return <TrendingUp className="w-5 h-5 text-emerald-400 mt-0.5" />;
      default: return <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5" />;
    }
  };

  const getStyle = () => {
    if (alert.severity === 'high') return 'border-rose-500/30 bg-rose-500/5';
    if (alert.severity === 'medium') return 'border-amber-500/30 bg-amber-500/5';
    return 'border-neutral-800 bg-neutral-900';
  };

  return (
    <div className={`border rounded-xl p-5 flex gap-4 transition-all hover:bg-neutral-800 focus:outline-none ${getStyle()}`}>
      <div className="shrink-0 flex items-start">
        {getIcon()}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-semibold text-neutral-100">{alert.title}</h4>
          {alert.country && (
            <span className="px-1.5 py-0.5 text-[10px] font-bold bg-black/40 text-neutral-300 rounded uppercase tracking-wider border border-white/5">
              {alert.country}
            </span>
          )}
          {alert.category && (
            <span className="px-1.5 py-0.5 text-[10px] font-bold bg-black/40 text-fuchsia-300 rounded tracking-wider border border-white/5">
              {alert.category}
            </span>
          )}
        </div>
        <p className="text-sm text-neutral-400 leading-relaxed mt-1.5">
          {alert.description}
        </p>
      </div>
    </div>
  );
}
