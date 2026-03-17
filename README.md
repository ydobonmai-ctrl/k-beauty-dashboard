# 💄 K-Beauty Demand Intelligence Dashboard (AI-Powered)

> **"비즈니스 문제를 기술적 파이프라인으로 해결하는 Product Engineer 프로젝트"**

본 프로젝트는 단순한 데이터 시각화를 넘어, 외부 시장 트렌드와 내부 매출 데이터를 결합하고 **LLM 에이전트**를 통해 경영진에게 **실행 가능한 전략(Actionable Insights)**을 제안하는 지능형 대시보드입니다.

---

## 🚀 Key Product Features

### 1. AI 에이전트 기반 전략 제안 (AI-Driven Rationale)
- 단순히 '수치'를 보여주는 것이 아니라, AI가 해당 지표의 의미를 해석하여 **'왜 이 키워드에 집중해야 하는지'** 전략적 근거를 제시합니다.
- 점수 산출 공식의 투명성을 위해 상세 페이지 내 **Opportunity Score 툴팁**을 제공합니다.

### 2. 맥락 기반 상세 분석 (Context-Aware Deep Analysis)
- `[국가]/[카테고리/키워드]` 기반의 **동적 라우팅(Dynamic Routing)**을 통해 제품별 맞춤형 분석 페이지를 제공합니다.
- 각 페이지는 해당 시장의 특수성(환율, 재고 등)을 반영한 개별 액션 아이템을 생성합니다.

### 3. 기술적 피드백 루프 (Iterative Improvement)
- AI가 제안한 조언에 대해 사용자가 'Helpful / Not Helpful' 피드백을 남길 수 있는 인터페이스를 구현했습니다. 
- 이는 현장의 피드백을 수집하여 AI 모델과 로직을 점진적으로 개선하는 **제품 엔지니어링의 핵심 사이클**을 반영합니다.

---

## 🏛 Technical Architecture

본 시스템은 확장성과 유지보수성을 고려하여 4개의 계층으로 설계되었습니다:

1.  **Data Layer**: Google Search Trends(외부) + 매출/재고 ERP 데이터(내부) + 실시간 환율 API 연동
2.  **Logic Layer**: 가중치 기반의 기회 지수(Opportunity Score) 산출 알고리즘 적용
3.  **Agent Layer**: LLM(추론 엔진) 기반의 전략적 근거 및 액션 아이템 생성
4.  **Presentation Layer**: Next.js 15(App Router) 기반의 고성능 반응형 UI

---

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Deployment**: Vercel (CI/CD 통합)
- **Architecture Tools**: Git history rewriting for unified authorship, Dynamic Contextual Routing

