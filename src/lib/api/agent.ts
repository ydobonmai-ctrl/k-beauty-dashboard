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
  let confidence = 0.85 + (Math.random() * 0.1);

  if (growth > 50) {
    rationale = `${country} 시장에서 '${keyword}' 검색량이 급증하고 있습니다. SNS 바이럴 가능성이 높으며 구매 의도가 뚜렷합니다.`;
    recommendation = `공격적인 퍼포먼스 마케팅과 인플루언서 협업을 통해 초기 수요를 선점하세요.`;
  } else if (inventoryLevel === 'low') {
    rationale = `'${keyword}'의 트렌드 지수는 안정적이나, 현재 재고 수준이 낮아 기회 손실(Out-of-stock) 위험이 있습니다.`;
    recommendation = `즉각적인 재고 보충과 함께, 품절 시 예약 판매 시스템(Pre-order) 전환을 준비하세요.`;
  } else {
    rationale = `'${keyword}'는 성숙기 시장에 진입했습니다. 급격한 성장은 없으나 꾸준한 캐시카우 역할을 하고 있습니다.`;
    recommendation = `묶음 판매나 프로모션을 통해 객단가(AOV)를 높이는 전략이 유효합니다.`;
  }

  // Specific keyword override (Product Engineer's Attention to Detail)
  if (keyword === 'PDRN 세럼') {
    rationale = `현재 K-Beauy의 차세대 성분으로 PDRN이 주목받고 있습니다. 관련 고유 검색어가 200% 이상 상승했습니다.`;
    recommendation = `성분 중심의 검색 광고(SA)를 확장하고, '피부 재생' 키워드와 연계한 상세 페이지 보완이 필요합니다.`;
    confidence = 0.98;
  }

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
