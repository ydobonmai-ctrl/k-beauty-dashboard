"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, TrendingUp, Grid, CircleDollarSign, AlertCircle } from 'lucide-react';

const navItems = [
  { name: '대시보드 개요', href: '/', icon: LayoutDashboard },
  { name: '키워드 트렌드', href: '/trends', icon: TrendingUp },
  { name: '카테고리 히트맵', href: '/heatmap', icon: Grid },
  { name: '수익 분석 (FX)', href: '/revenue', icon: CircleDollarSign },
  { name: 'AI 추천 액션', href: '/recommendations', icon: AlertCircle },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-neutral-50 text-neutral-900 font-sans selection:bg-fuchsia-500/30">
      {/* Sidebar */}
      <aside className="w-64 border-r border-neutral-200 bg-white flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-neutral-100">
          <h1 className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-600 to-pink-600 tracking-tighter">
            K-BEAUTY INTEL
          </h1>
        </div>
        <nav className="flex-1 px-4 py-8 space-y-1.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                    ? 'bg-fuchsia-50 text-fuchsia-600 font-bold shadow-sm shadow-fuchsia-100'
                    : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900'
                  }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-fuchsia-600' : 'text-neutral-400'}`} />
                <span className="text-[15px]">{item.name}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-6 border-t border-neutral-100 bg-neutral-50/50">
          <div className="text-[10px] font-bold text-neutral-400 mb-2 tracking-widest uppercase">데이터 연결 상태</div>
          <div className="flex items-center space-x-2 text-sm text-emerald-600 font-medium">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Google Trends · 페이지에서 상태 확인</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col max-h-screen overflow-hidden">
        <header className="h-16 flex items-center justify-between px-8 border-b border-neutral-200 bg-white/80 backdrop-blur-xl sticky top-0 z-10">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-bold text-neutral-800">
              {navItems.find(i => i.href === pathname)?.name || '대시보드'}
            </h2>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-xs font-semibold text-neutral-500 bg-neutral-100 px-3 py-1.5 rounded-full border border-neutral-200">
              개인 프로젝트 · ERP 데이터는 샘플
            </div>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-fuchsia-500 to-pink-600 flex items-center justify-center font-bold text-white shadow-lg shadow-fuchsia-200">
              KR
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-8 space-y-8 bg-neutral-50/30">
          <p className="text-sm text-neutral-500">개인 프로젝트: 검색 관심도(Google Trends)·환율(ECB)은 실데이터, 매출·재고와 ERP 기반 전략 요약은 샘플입니다. AI 제안은 실데이터만 근거로 Gemini가 생성합니다.</p>
          {children}
        </div>
      </main>
    </div>
  );
}
