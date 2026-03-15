import { AlertCard } from '@/components/dashboard/AlertCard';
import { Alert } from '@/types';

const recommendations: Alert[] = [
  {
    id: 'rec-1',
    type: 'opportunity',
    title: 'PDRN 세럼: 미국 수출 물량 확대 제안',
    description: '미국 내 수요가 전월 대비 25% 상승했으나 현지 재고가 매우 부족합니다. 한국 예비 물량의 15%를 미국 창고로 전환 배치하면 약 45만 달러의 추가 매출 창출이 가능합니다.',
    severity: 'high',
    country: 'US',
    category: '스킨케어'
  },
  {
    id: 'rec-2',
    type: 'risk',
    title: '컬러 밤: 한국 시장 공급 과잉 주의',
    description: '검색 트렌드가 고점에 도달한 후 최근 1주일간 12% 하락했습니다. 높은 재고 수준을 고려하여 3분기 전 세트 구성 및 프로모션 진행을 권장합니다.',
    severity: 'medium',
    country: 'KR',
    category: '메이크업'
  },
  {
    id: 'rec-3',
    type: 'opportunity',
    title: '쿠션 파운데이션: 일본 시장 가격 정책 조정',
    description: '엔저 심화에도 불구하고 일본 내 브랜드 선호도가 매우 높습니다(관심도 92). 가격 탄력성 분석 결과, 5% 가격 인상 시에도 판매량 감소 없이 환차손 보전이 가능할 것으로 보입니다.',
    severity: 'medium',
    country: 'JP',
    category: '메이크업'
  },
  {
    id: 'rec-4',
    type: 'info',
    title: '클렌징 밤: 글로벌 시장 현상 유지',
    description: '주요 3개 시장 모두 수요가 안정적입니다. 재고 수준과 공급망 흐름이 최적의 균형을 유지하고 있어 추가 조치가 필요하지 않습니다.',
    severity: 'low',
    category: '스킨케어'
  }
];

export default function RecommendationsPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-10">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-neutral-800 mb-2">AI 기반 전략 제언</h2>
          <p className="text-neutral-500">수요 데이터, 환율, 재고 상태를 종합 분석하여 도출된 최적의 비즈니스 액션 아이템입니다.</p>
        </div>
      </div>

      <div className="grid gap-5">
        {recommendations.map(rec => (
          <AlertCard key={rec.id} alert={rec} />
        ))}
      </div>
    </div>
  );
}
