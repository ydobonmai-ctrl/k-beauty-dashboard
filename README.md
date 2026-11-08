# K-Beauty Demand Intelligence Dashboard

개인 프로젝트용 검색 트렌드 대시보드입니다.

## 실제 데이터와 샘플 데이터

- **Google Trends:** 실제 공개 웹 데이터를 서버에서 수집합니다. 한국·미국·일본의 현지 언어 검색어를 사용합니다.
- **환율:** 실제 데이터입니다. Frankfurter API(유럽중앙은행 기준 환율, 키 불필요)에서 최근 3주 시계열을 받아 최신값·5영업일 변화율·일 변동성을 계산합니다. 1시간 캐시, 실패 시 샘플로 대체하지 않고 "연결 실패"를 표시합니다.
- **AI 제안 (대시보드 AI Agent Advisor):** Gemini API로 생성합니다. 검색 관심도 상승 상위 3개 키워드의 실제 Trends 수치와 실제 환율만 프롬프트에 넣고, 샘플 매출·재고는 넣지 않습니다.
- **매출·재고:** 샘플 데이터입니다. ERP에 연결되어 있지 않으며, 이를 쓰는 기회 지수·전략 요약·추천 액션 페이지는 시연용입니다.

## LLM 연결 (`src/lib/api/llm-advisor.ts`)

- 서버에서만 호출하고 API 키(`GEMINI_API_KEY`)는 브라우저로 보내지 않습니다. 로컬은 `.env.local`, 배포는 Vercel 환경변수에 넣습니다.
- 응답을 JSON 스키마로 강제하고, 요청하지 않은 키워드나 빠진 항목은 버립니다. 주어지지 않은 수치를 만들지 말라고 지시합니다.
- 무료 한도를 아끼려고 3개를 한 번에 묻고 6시간 캐시합니다. 429·503이면 `gemini-2.5-flash` → `gemini-2.5-flash-lite`로 넘깁니다.
- 키가 없거나 모두 실패하면 규칙 기반 제안으로 돌아가고, 화면에 "LLM 미연결"과 사유를 표시합니다.

## Google Trends 연결

`src/lib/api/google-trends.ts`가 공개 사이트 세션을 생성하고 `api/explore`의 시계열 토큰을 받아 `api/widgetdata/multiline`에서 실제 데이터를 가져옵니다. API 키는 필요하지 않습니다. 이는 공식 Google Trends API alpha가 아닌 공개 웹 엔드포인트 사용이며, Google의 응답 형식 변경이나 요청 제한으로 수집이 실패할 수 있습니다.

- 최근 30일, 국가별 스킨케어·메이크업 추이와 12개 검색어.
- 부분 집계 중인 날짜는 제외합니다. 완료된 일별 데이터만 표시합니다.
- 키워드 점수: 각 검색어의 기간 내 최고치를 100으로 환산한 최근 7일 평균. 별도 요청 묶음이나 국가 사이의 검색량 비교에 사용하지 않습니다.
- 변화율: 최근 7일 평균 / 직전 7일 평균의 변화. 이전 값이 0이면 비교 불가이며, 검색 데이터가 없는 검색어는 제외합니다.
- 카테고리 차트는 해당 국가의 스킨케어·메이크업 검색어를 같은 요청으로 비교한 Google 원본 지수입니다.
- 서버 프로세스 내 1시간 캐시와 동시 요청 공유, 직렬 수집을 적용합니다. 실패는 5분 캐시하고 429 응답 시 5분간 요청을 중단합니다.
- 실패하면 데이터와 순위를 비우고 연결 상태를 표시합니다. 샘플 트렌드로 대체하지 않습니다.
- 화면에 국가별 수집 시각(KST), 마지막 데이터 날짜, 연결 상태를 표시합니다.

검색 관심도는 검색 횟수, 매출, 구매 의도를 의미하지 않습니다. 샘플 ERP를 포함한 기회 지수는 시연용입니다.

## 실행과 검증

Node.js 22 이상을 권장합니다(Next.js 16은 Node.js 20.9 이상 필요).

```sh
npm install
npm run dev
npm run build
node --test tests/google-trends.test.mjs
npx tsc --noEmit
```

Google Trends 수집과 기존 Inter 폰트 다운로드를 위해 인터넷 연결이 필요합니다. 개발 서버 재시작 시 메모리 캐시는 초기화됩니다.

## 기술

Next.js 16.1.6 App Router · React 19 · TypeScript · Tailwind CSS 4 · Recharts · Lucide React

## 코드 위치

- `src/lib/api/google-trends.ts`: 세션, 공개 데이터 요청, 검증, 계산
- `src/lib/api/trends.ts`: 국가별 검색어, 캐시, 화면 데이터와 샘플 ERP 결합
- `src/components/dashboard/TrendsSource.tsx`: 데이터 출처와 연결 상태
- `src/lib/api/fx.ts`: 실제 환율 (Frankfurter/ECB)
- `src/lib/api/llm-advisor.ts`: Gemini 제안 생성·검증·캐시
- `src/lib/api/sales.ts`: 샘플 ERP
