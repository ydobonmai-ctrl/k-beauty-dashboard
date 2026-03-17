import { getInsightByContext } from '@/lib/api/trends';
import { Country, Category } from '@/types';
import { notFound } from 'next/navigation';
import { BrainCircuit, TrendingUp, AlertCircle, ShoppingBag, ArrowLeft, CheckCircle2, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import { StatCard } from '@/components/dashboard/StatCard';

interface PageProps {
  params: Promise<{
    country: string;
    category: string;
    keyword: string;
  }>;
}

export default async function AnalysisPage({ params }: PageProps) {
  const { country, category, keyword } = await params;

  // Decoding URL components (they might be encoded)
  const decodedKeyword = decodeURIComponent(keyword);
  const decodedCategory = decodeURIComponent(category) as Category;
  const decodedCountry = decodeURIComponent(country) as Country;

  const insight = await getInsightByContext(decodedCountry, decodedCategory, decodedKeyword);

  if (!insight) {
    notFound();
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Link
          href="/"
          className="flex items-center text-sm font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors w-fit"
        >
          <ArrowLeft size={16} className="mr-1" /> 대시보드로 돌아가기
        </Link>
        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-xs font-black text-zinc-600 dark:text-zinc-400 uppercase tracking-widest">
                {decodedCountry} MARKET
              </span>
              <span className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-xs font-black text-zinc-600 dark:text-zinc-400 uppercase tracking-widest">
                {decodedCategory}
              </span>
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-zinc-900 dark:text-zinc-100">
              {decodedKeyword} <span className="text-zinc-400">집중 분석</span>
            </h1>
          </div>
          <div className="hidden md:block">
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-1 mb-1 group/tooltip relative">
                <span className="text-[10px] font-black text-zinc-400 uppercase">AI Opportunity Score</span>
                <HelpCircle size={10} className="text-zinc-400 cursor-help" />

                {/* Tooltip Content */}
                <div className="absolute top-full right-0 mt-2 w-64 p-3 bg-zinc-900 dark:bg-zinc-800 text-[11px] text-zinc-200 rounded-xl shadow-xl border border-white/10 opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-300 z-50">
                  <p className="font-bold text-fuchsia-400 mb-1">산출 공식 (Calculation Formula)</p>
                  <p className="leading-relaxed">
                    (성장세 × 0.4) + (관심도 × 0.3) + (환율 우호도) + (재고 가중치)<br />
                    <span className="text-zinc-500 mt-1 block italic font-medium">실시간 데이터와 LLM 추론 엔진이 결합된 집계 점수입니다.</span>
                  </p>
                </div>
              </div>
              <div className="text-5xl font-black text-fuchsia-600 dark:text-fuchsia-400 tracking-tighter">
                {insight.opportunityScore}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="트렌드 지수"
          value={insight.trendScore.toString()}
          subtitle="Google Trends"
          trend={{ value: insight.growth, label: '관심도 점수' }}
          highlight
        />
        <StatCard
          title="현재 매출 (USD)"
          value={`$${insight.fxAdjustedRevenue.toLocaleString()}`}
          subtitle="최근 30일"
          trend={{ value: 8.2, label: '전월 대비' }}
        />
        <StatCard
          title="재고 상태"
          value={insight.inventoryLevel === 'low' ? '경고 (부족)' : insight.inventoryLevel === 'medium' ? '보통' : '양호'}
          subtitle="현재 가용 재고"
          trend={{ value: 0.5, label: '회전율' }}
        />
        <StatCard
          title="AI 컨피던스"
          value={`${insight.agentInsight?.confidence || 92}%`}
          subtitle="데이터 신뢰도"
          trend={{ value: 1.2, label: '정확도 향상중' }}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Rationale & Recommendations */}
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-fuchsia-100 dark:bg-fuchsia-900/30 rounded-xl text-fuchsia-600 dark:text-fuchsia-400">
                <BrainCircuit size={24} />
              </div>
              <h2 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">AI 에이전트 분석 결과</h2>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-black text-zinc-400 uppercase tracking-widest mb-3">전략적 근거 (Rationale)</h3>
                <p className="text-lg text-zinc-700 dark:text-zinc-300 leading-relaxed font-medium">
                  {insight.agentInsight?.rationale}
                </p>
              </div>

              <div className="p-6 bg-fuchsia-50/50 dark:bg-fuchsia-900/10 border border-fuchsia-100 dark:border-fuchsia-900/20 rounded-2xl">
                <h3 className="text-sm font-black text-fuchsia-700 dark:text-fuchsia-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <TrendingUp size={16} /> 즉각적인 실행 권고안
                </h3>
                <p className="text-zinc-800 dark:text-zinc-200 font-bold leading-relaxed">
                  {insight.agentInsight?.recommendation}
                </p>
              </div>
            </div>
          </section>

          <section className="bg-zinc-900 dark:bg-zinc-950 rounded-3xl p-8 text-white">
            <h2 className="text-2xl font-black tracking-tight mb-8">액션 아이템 체크리스트</h2>
            <div className="space-y-4">
              {[
                `해당 키워드 관련 ${decodedCountry} 타겟 광고 노출 즉시 확대`,
                '주요 인플루언서 3인 샘플 발송 및 포스팅 요청',
                insight.inventoryLevel === 'low' ? '안전 재고 확보를 위한 추가 발주 승인' : '프로모션 적용을 통한 판매 가속화',
                '현지 FX 변동성에 따른 탄력적 가격 정책 적용 검토'
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors cursor-pointer group">
                  <div className="mt-0.5 text-zinc-500 group-hover:text-fuchsia-400 transition-colors">
                    <CheckCircle2 size={20} />
                  </div>
                  <span className="font-bold text-zinc-200">{item}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar Context */}
        <div className="space-y-8">
          <div className="bg-zinc-50 dark:bg-zinc-800/30 rounded-3xl p-8 border border-zinc-100 dark:border-zinc-800">
            <h3 className="text-lg font-black tracking-tight mb-6">데이터 소스 및 가중치</h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-xs font-black text-zinc-400 uppercase mb-2">
                  <span>Google Search Trends</span>
                  <span>40%</span>
                </div>
                <div className="h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                  <div className="h-full bg-fuchsia-500 w-[40%]" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-black text-zinc-400 uppercase mb-2">
                  <span>Internal Sales Performance</span>
                  <span>30%</span>
                </div>
                <div className="h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 w-[30%]" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-black text-zinc-400 uppercase mb-2">
                  <span>SNS Social Listening</span>
                  <span>20%</span>
                </div>
                <div className="h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                  <div className="h-full bg-sky-500 w-[20%]" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-black text-zinc-400 uppercase mb-2">
                  <span>FX Favorability</span>
                  <span>10%</span>
                </div>
                <div className="h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[10%]" />
                </div>
              </div>
            </div>
          </div>

          <div className="border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 text-center space-y-4">
            <AlertCircle className="mx-auto text-zinc-300" size={32} />
            <div>
              <p className="text-sm font-bold text-zinc-500 dark:text-zinc-400">데이터 오차가 발견되었나요?</p>
              <button className="text-xs font-black text-fuchsia-600 dark:text-fuchsia-400 uppercase mt-2 hover:underline">
                실시간 데이터 재동기화 요청
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
