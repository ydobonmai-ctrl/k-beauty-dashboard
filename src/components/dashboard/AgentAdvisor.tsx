'use client';

import { useState } from 'react';
import { MappedInsight } from '@/types';
import { Sparkles, TrendingUp, AlertCircle, ThumbsUp, ThumbsDown, BrainCircuit } from 'lucide-react';
import { submitAgentFeedback } from '@/lib/api/agent';

interface AgentAdvisorProps {
  insights: MappedInsight[];
}

export function AgentAdvisor({ insights }: AgentAdvisorProps) {
  const [feedbackGiven, setFeedbackGiven] = useState<Record<string, boolean>>({});

  // Get top 3 opportunities by score
  const topOpportunities = [...insights]
    .sort((a, b) => b.opportunityScore - a.opportunityScore)
    .slice(0, 3);

  const handleFeedback = async (id: string, type: 'helpful' | 'unhelpful') => {
    await submitAgentFeedback(id, type);
    setFeedbackGiven(prev => ({ ...prev, [id]: true }));
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
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Market intelligence & recommendation engine</p>
          </div>
        </div>
        <div className="px-2 py-1 bg-white dark:bg-zinc-950 border border-indigo-200 dark:border-indigo-800 rounded-md">
          <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Live Analysis</span>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {topOpportunities.map((insight, idx) => (
          <div key={`${insight.keyword}-${insight.country}`} className="relative group">
            <div className="flex items-start gap-4">
              <div className="mt-1 flex-shrink-0 w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-sm font-bold text-zinc-500">
                {idx + 1}
              </div>
              <div className="flex-1 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">{insight.keyword}</span>
                    <span className="text-xs px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-zinc-600 dark:text-zinc-400">
                      {insight.country}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                    <TrendingUp size={14} />
                    <span className="text-sm">Score: {insight.opportunityScore}</span>
                  </div>
                </div>

                {insight.agentInsight && (
                  <div className="bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100/50 dark:border-indigo-900/20 p-4 rounded-xl space-y-2">
                    <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400 text-xs font-bold uppercase tracking-tight">
                      <Sparkles size={12} />
                      AI Rationale
                    </div>
                    <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed font-medium">
                      {insight.agentInsight.rationale}
                    </p>
                    <div className="pt-2 border-t border-indigo-100/50 dark:border-indigo-900/20">
                      <p className="text-xs text-indigo-600 dark:text-indigo-500 italic">
                        <span className="font-bold">Recommendation:</span> {insight.agentInsight.recommendation}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-zinc-400 uppercase">Confidence: {insight.agentInsight?.confidence}%</span>
                  </div>

                  {!feedbackGiven[`${insight.keyword}-${insight.country}`] ? (
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-zinc-400">Feedback?</span>
                      <button
                        onClick={() => handleFeedback(`${insight.keyword}-${insight.country}`, 'helpful')}
                        className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition-colors text-zinc-400 hover:text-emerald-500"
                      >
                        <ThumbsUp size={14} />
                      </button>
                      <button
                        onClick={() => handleFeedback(`${insight.keyword}-${insight.country}`, 'unhelpful')}
                        className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition-colors text-zinc-400 hover:text-rose-500"
                      >
                        <ThumbsDown size={14} />
                      </button>
                    </div>
                  ) : (
                    <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-1">
                      <ThumbsUp size={10} /> Feedback Recorded
                    </span>
                  )}
                </div>
              </div>
            </div>
            {idx !== topOpportunities.length - 1 && (
              <div className="absolute -bottom-3 left-4 right-0 h-px bg-zinc-100 dark:bg-zinc-800" />
            )}
          </div>
        ))}
      </div>

      <div className="p-4 bg-zinc-50 dark:bg-zinc-800/30 border-t border-zinc-100 dark:border-zinc-800">
        <button className="w-full py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity">
          Generate Full Strategic Report
        </button>
      </div>
    </div>
  );
}
