"use client";

import { Star, TrendingUp } from 'lucide-react';
import { MappedInsight } from '@/types';

interface RisingStarsProps {
  insights: MappedInsight[];
}

export function RisingStars({ insights }: RisingStarsProps) {
  const stars = insights
    .filter(i => i.growthAvailable && i.growth > 30)
    .sort((a, b) => b.opportunityScore - a.opportunityScore)
    .slice(0, 4);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stars.length === 0 && <p className="text-neutral-500">표시할 고성장 검색어가 없습니다.</p>}
      {stars.map((star, idx) => (
        <div key={idx} className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-sm hover:border-fuchsia-300 transition-all group">
          <div className="flex justify-between items-start mb-3">
            <div className="bg-fuchsia-50 p-2 rounded-lg group-hover:bg-fuchsia-100 transition-colors">
              <Star className="w-4 h-4 text-fuchsia-600 fill-fuchsia-100 group-hover:fill-fuchsia-300 transition-all" />
            </div>
            <span className="text-[10px] font-black px-2 py-0.5 rounded bg-neutral-100 text-neutral-500 uppercase">
              {star.country}
            </span>
          </div>
          <div className="text-sm font-black text-neutral-800 mb-1">{star.keyword}</div>
          <div className="flex items-center text-xs font-bold text-emerald-600">
            <TrendingUp className="w-3 h-3 mr-1" />
            성장률 {star.growth}%
          </div>
        </div>
      ))}
    </div>
  );
}
