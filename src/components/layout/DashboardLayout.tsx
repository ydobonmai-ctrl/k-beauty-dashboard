"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, TrendingUp, Grid, CircleDollarSign, AlertCircle } from 'lucide-react';

const navItems = [
  { name: 'Overview', href: '/', icon: LayoutDashboard },
  { name: 'Trends', href: '/trends', icon: TrendingUp },
  { name: 'Heatmap', href: '/heatmap', icon: Grid },
  { name: 'Revenue', href: '/revenue', icon: CircleDollarSign },
  { name: 'Actions', href: '/recommendations', icon: AlertCircle },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-neutral-900 text-white font-sans selection:bg-fuchsia-500/30">
      {/* Sidebar */}
      <aside className="w-64 border-r border-neutral-800 bg-neutral-950 flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-neutral-800">
          <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 to-pink-600 tracking-tight">
            K-BEAUTY INTEL
          </h1>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${isActive
                  ? 'bg-fuchsia-500/10 text-fuchsia-400 font-medium'
                  : 'text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200'
                  }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-fuchsia-400' : 'text-neutral-500'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-neutral-800">
          <div className="text-xs text-neutral-500 mb-1">DATA MODE</div>
          <div className="flex items-center space-x-2 text-sm text-green-400">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span>Mock Connect</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col max-h-screen overflow-hidden">
        <header className="h-16 flex items-center justify-between px-8 border-b border-neutral-800 bg-neutral-900/50 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold capitalize tracking-tight">
              {navItems.find(i => i.href === pathname)?.name || 'Dashboard'}
            </h2>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-neutral-400 bg-neutral-800 px-3 py-1.5 rounded-full border border-neutral-700">
              Updated: {new Date().toLocaleDateString()}
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-fuchsia-500 to-pink-500 flex items-center justify-center font-bold text-xs ring-2 ring-neutral-800">
              KR
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-8 space-y-8 bg-black/20">
          {children}
        </div>
      </main>
    </div>
  );
}
