import { MappedInsight, AgentInsight } from '@/types';

/**
 * Mock LLM Agent Engine
 * In a real-world scenario, this would call a Gemini API or similar.
 * It demonstrates the "Product Engineer" ability to structure AI services.
 */
export async function getAgentAnalysis(insight: MappedInsight): Promise<AgentInsight> {
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 800));

  const { keyword, growth, inventoryLevel, country } = insight;

  // Reasoning logic based on product context
  let rationale = '';
  let recommendation = '';
  const confidence = 0;

  if (growth > 50) {
    rationale = `${country} 시장의 '${keyword}' 검색 관심도가 직전 7일 대비 ${growth}% 상승했습니다. 이 수치만으로 구매 의도나 판매량을 판단할 수는 없습니다.`;
    recommendation = `공격적인 퍼포먼스 마케팅과 인플루언서 협업을 통해 초기 수요를 선점하세요.`;
  } else if (inventoryLevel === 'low') {
    rationale = `'${keyword}'의 트렌드 지수는 안정적이나, 현재 재고 수준이 낮아 기회 손실(Out-of-stock) 위험이 있습니다.`;
    recommendation = `즉각적인 재고 보충과 함께, 품절 시 예약 판매 시스템(Pre-order) 전환을 준비하세요.`;
  } else {
    rationale = `'${keyword}'는 성숙기 시장에 진입했습니다. 급격한 성장은 없으나 꾸준한 캐시카우 역할을 하고 있습니다.`;
    recommendation = `묶음 판매나 프로모션을 통해 객단가(AOV)를 높이는 전략이 유효합니다.`;
  }

  rationale += ' 매출·재고는 샘플 데이터에 기반한 시연입니다.';

  return {
    rationale,
    recommendation,
    confidence: Number(confidence.toFixed(2))
  };
}

/**
 * Iterative Feedback Loop Simulation 
 * Requirement: "Improve performance/structure based on user feedback"
 */
export async function submitAgentFeedback(insightId: string, feedback: 'helpful' | 'unhelpful', comment?: string) {
  console.log(`[AI Feedback Loop] ${insightId} marked as ${feedback}. Comment: ${comment || 'none'}`);
  // In real implementation, this would save to a database for LLM fine-tuning or prompt engineering
  return { success: true };
}
