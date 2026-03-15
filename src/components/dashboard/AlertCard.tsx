import { Alert } from '@/types';
import { AlertCircle, AlertTriangle, TrendingUp } from 'lucide-react';

interface AlertCardProps {
  alert: Alert;
}

export function AlertCard({ alert }: AlertCardProps) {
  const getIcon = () => {
    switch (alert.type) {
      case 'risk': return <AlertTriangle className="w-5 h-5 text-rose-500 mt-0.5" />;
      case 'opportunity': return <TrendingUp className="w-5 h-5 text-emerald-500 mt-0.5" />;
      default: return <AlertCircle className="w-5 h-5 text-fuchsia-500 mt-0.5" />;
    }
  };

  const getStyle = () => {
    if (alert.severity === 'high') return 'border-rose-100 bg-rose-50/50';
    if (alert.severity === 'medium') return 'border-amber-100 bg-amber-50/50';
    return 'border-neutral-100 bg-white shadow-sm';
  };

  return (
    <div className={`border rounded-2xl p-6 flex gap-5 transition-all hover:shadow-md hover:border-neutral-200 group ${getStyle()}`}>
      <div className="shrink-0 flex items-start">
        {getIcon()}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <h4 className="font-bold text-neutral-800 group-hover:text-neutral-900 transition-colors">{alert.title}</h4>
          <div className="flex gap-1.5 ml-auto">
            {alert.country && (
              <span className="px-2 py-0.5 text-[9px] font-black bg-neutral-100 text-neutral-500 rounded-md uppercase tracking-widest border border-neutral-200">
                {alert.country}
              </span>
            )}
            {alert.category && (
              <span className="px-2 py-0.5 text-[9px] font-black bg-fuchsia-50 text-fuchsia-600 rounded-md tracking-widest border border-fuchsia-100 italic">
                {alert.category}
              </span>
            )}
          </div>
        </div>
        <p className="text-[13px] text-neutral-500 leading-relaxed font-medium">
          {alert.description}
        </p>
      </div>
    </div>
  );
}
