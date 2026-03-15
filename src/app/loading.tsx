import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="w-full h-full min-h-[50vh] flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        <div className="absolute inset-0 bg-fuchsia-500 blur-xl opacity-30 rounded-full animate-pulse" />
        <Loader2 className="w-10 h-10 animate-spin text-fuchsia-400 relative z-10" />
      </div>
      <div className="text-neutral-400 font-medium tracking-tight uppercase text-sm">Aggregating Global Demand Signals...</div>
    </div>
  );
}
