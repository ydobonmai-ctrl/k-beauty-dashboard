'use client';

import { useState } from 'react';
import { Sparkles, TrendingUp, ThumbsUp, ThumbsDown, BrainCircuit, AlertTriangle } from 'lucide-react';
import { submitAgentFeedback } from '@/lib/api/agent';
import type { AdvisorResult } from '@/lib/api/llm-advisor';

interface AgentAdvisorProps {
  advisor: AdvisorResult;
}

export function AgentAdvisor({ advisor }: AgentAdvisorProps) {
  const [feedbackGiven, setFeedbackGiven] = useState<Record<string, 'helpful' | 'unhelpful' | null>>({});
  const isLlm = advisor.source === 'gemini';

  const handleFeedback = async (id: string, type: 'helpful' | 'unhelpful') => {
    await submitAgentFeedback(id, type);
    setFeedbackGiven(prev => ({ ...prev, [id]: type }));
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
      <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-800/30">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
            <BrainCircuit size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">AI Agent Advisor</h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {isLlm
                ? `${advisor.model} 생성 · 근거: Google Trends·환율 실데이터 (샘플 매출 미사용)`
                : '규칙 기반 제안'}
            </p>
          </div>
        </div>
        <div className={`px-2 py-1 rounded-md border ${isLlm ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50'}`}>
          <span className={`text-[10px] font-bold uppercase tracking-wider ${isLlm ? 'text-emerald-700' : 'text-amber-700'}`}>
            {isLlm ? 'LLM 연결' : 'LLM 미연결'}
          </span>
        </div>
      </div>

      {advisor.note && (
        <p className="px-6 pt-4 text-xs text-amber-700 flex items-center gap-1"><AlertTriangle size={12} />{advisor.note}</p>
      )}

      <div className="p-6 space-y-6">
        {advisor.items.length === 0 && <p className="text-sm text-zinc-500">표시할 제안이 없습니다.</p>}
        {advisor.items.map((item, idx) => {
          const feedbackId = `${item.keyword}-${item.country}`;
          const currentFeedback = feedbackGiven[feedbackId];

          return (
            <div key={feedbackId} className="relative group">
              <div className="flex items-start gap-4">
                <div className="mt-1 flex-shrink-0 w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-sm font-bold text-zinc-500">
                  {idx + 1}
                </div>
                <div className="flex-1 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-zinc-900 dark:text-zinc-100">{item.keyword}</span>
                      <span className="text-xs px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-zinc-600 dark:text-zinc-400">
                        {item.country}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                      <TrendingUp size={14} />
                      <span className="text-sm">관심도 {item.growth > 0 ? '+' : ''}{item.growth}%</span>
                    </div>
                  </div>

                  <div className="bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100/50 dark:border-indigo-900/20 p-4 rounded-xl space-y-2">
                    <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400 text-xs font-bold uppercase tracking-tight">
                      <Sparkles size={12} />
                      AI Rationale
                    </div>
                    <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed font-medium">{item.rationale}</p>
                    <div className="pt-2 border-t border-indigo-100/50 dark:border-indigo-900/20 space-y-1">
                      <p className="text-xs text-indigo-600 dark:text-indigo-500">
                        <span className="font-bold">Recommendation:</span> {item.recommendation}
                      </p>
                      {item.watchout && (
                        <p className="text-xs text-zinc-500"><span className="font-bold">주의:</span> {item.watchout}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-zinc-400">
                      관심도 점수 {item.score}/100 · 생성 {new Date(advisor.generatedAt).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}
                    </span>

                    {!currentFeedback ? (
                      <div className="flex items-center gap-2 border-l border-zinc-100 dark:border-zinc-800 pl-3">
                        <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-tighter">Feedback?</span>
                        <button onClick={() => handleFeedback(feedbackId, 'helpful')}
                          className="p-1 hover:bg-emerald-50 rounded transition-colors text-zinc-400 hover:text-emerald-500" title="Helpful">
                          <ThumbsUp size={14} />
                        </button>
                        <button onClick={() => handleFeedback(feedbackId, 'unhelpful')}
                          className="p-1 hover:bg-rose-50 rounded transition-colors text-zinc-400 hover:text-rose-500" title="Unhelpful">
                          <ThumbsDown size={14} />
                        </button>
                      </div>
                    ) : (
                      <span className="text-[10px] text-zinc-500 font-bold">피드백 기록됨</span>
                    )}
                  </div>
                </div>
              </div>
              {idx !== advisor.items.length - 1 && (
                <div className="absolute -bottom-3 left-4 right-0 h-px bg-zinc-100 dark:bg-zinc-800" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
