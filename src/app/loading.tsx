import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="w-full h-full min-h-[50vh] flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        <div className="absolute inset-0 bg-fuchsia-500 blur-2xl opacity-20 rounded-full animate-pulse" />
        <Loader2 className="w-12 h-12 animate-spin text-fuchsia-600 relative z-10" />
      </div>
      <div className="text-neutral-500 font-black tracking-widest uppercase text-xs italic">글로벌 수요 시그널 집계 중...</div>
    </div>
  );
}
