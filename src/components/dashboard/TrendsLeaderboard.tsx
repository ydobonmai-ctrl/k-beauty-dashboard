"use client";

import { TrendingUp, Award, Globe } from 'lucide-react';
import { MappedInsight } from '@/types';

interface TrendsLeaderboardProps {
  insights: MappedInsight[];
}

export function TrendsLeaderboard({ insights }: TrendsLeaderboardProps) {
  const topTrending = [...insights]
    .sort((a, b) => b.growth - a.growth)
    .slice(0, 5);

  return (
    <div className="bg-white border border-neutral-200 rounded-3xl p-8 shadow-sm h-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-black text-neutral-800 tracking-tighter">글로벌 급상승 키워드 TOP 5</h3>
          <p className="text-sm text-neutral-500 font-medium">전체 시장 대상 가장 높은 성장률을 기록 중인 품목</p>
        </div>
        <div className="bg-fuchsia-100 p-2 rounded-xl">
          <Award className="w-5 h-5 text-fuchsia-600" />
        </div>
      </div>

      <div className="space-y-4">
        {topTrending.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between p-4 rounded-2xl hover:bg-neutral-50 transition-colors group">
            <div className="flex items-center space-x-4">
              <span className="text-lg font-black text-neutral-300 group-hover:text-fuchsia-400 transition-colors">0{idx + 1}</span>
              <div>
                <div className="text-[10px] font-black text-neutral-400 uppercase tracking-widest flex items-center">
                  <Globe className="w-3 h-3 mr-1" /> {item.country} | {item.category}
                </div>
                <div className="text-sm font-black text-neutral-800">{item.keyword}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[11px] font-black text-emerald-600 flex items-center justify-end">
                <TrendingUp className="w-3 h-3 mr-1" /> +{item.growth}%
              </div>
              <div className="text-[10px] font-bold text-neutral-400">성장 가속도</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
