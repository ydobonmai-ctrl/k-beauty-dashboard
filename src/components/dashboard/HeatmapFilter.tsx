'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';

export function HeatmapFilter({ selected }: { selected: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleFilterChange = (country: string) => {
    const params = new URLSearchParams(searchParams);
    if (country === '전체') {
      params.delete('country');
    } else {
      params.set('country', country);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <select
      value={selected}
      onChange={(e) => handleFilterChange(e.target.value)}
      className="bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 shadow-sm text-sm rounded-xl px-4 py-2.5 text-neutral-700 dark:text-zinc-300 outline-none focus:ring-2 focus:ring-fuchsia-100 dark:focus:ring-fuchsia-900/30 transition-all font-medium"
    >
      <option value="전체">전체 국가</option>
      <option value="KR">한국 (KR)</option>
      <option value="US">미국 (US)</option>
      <option value="JP">일본 (JP)</option>
    </select>
  );
}
