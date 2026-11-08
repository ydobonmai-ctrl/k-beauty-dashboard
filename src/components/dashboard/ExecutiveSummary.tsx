"use client";

import { AlertCircle, TrendingUp, Zap, ArrowRight } from 'lucide-react';
import { MappedInsight } from '@/types';
import Link from 'next/link';

interface ExecutiveSummaryProps {
  insights: MappedInsight[];
}

export function ExecutiveSummary({ insights }: ExecutiveSummaryProps) {
  // Logic to find top 3 insights
  const topInsights = [...insights]
    .sort((a, b) => b.opportunityScore - a.opportunityScore)
    .slice(0, 3);

  return (
    <div className="bg-gradient-to-br from-fuchsia-600 to-pink-700 rounded-3xl p-8 text-white shadow-2xl shadow-fuchsia-200 relative overflow-hidden group">
      {/* Decorative patterns */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full -mr-20 -mt-20 group-hover:scale-110 transition-transform duration-700" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-pink-500/20 blur-2xl rounded-full -ml-20 -mb-20" />

      <div className="relative z-10">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-white/20 backdrop-blur-md p-2 rounded-xl border border-white/30">
            <Zap className="w-5 h-5 text-yellow-300 fill-yellow-300" />
          </div>
          <h3 className="text-xl font-black tracking-tighter">전략 요약 · 샘플 ERP 기반 시연</h3>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {topInsights.map((insight, idx) => (
            <Link
              key={idx}
              href={`/analysis/${insight.country}/${insight.category}/${insight.keyword}`}
              className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 cursor-pointer block group/card"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-black tracking-widest uppercase bg-white/20 px-2 py-0.5 rounded border border-white/20">
                  {insight.country} | {insight.category}
                </span>
                <TrendingUp className="w-4 h-4 text-emerald-300" />
              </div>
              <div className="text-lg font-black mb-2 tracking-tight line-clamp-1">{insight.keyword} 최적화 시급</div>
              <p className="text-xs text-white/80 leading-relaxed font-medium">
                기회 지수 {insight.opportunityScore}점으로 현재 가장 높은 잠재력을 보유하고 있습니다.
                {insight.inventoryLevel === 'low' ? ' 재고 확보가 선결 과제입니다.' : ' 마케팅 예산 집중 투여를 권장합니다.'}
              </p>
              <div className="mt-4 flex items-center text-[11px] font-black text-white/60 group-hover/card:text-white transition-colors">
                상세 분석 보기 <ArrowRight className="w-3 h-3 ml-1 group-hover/card:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
