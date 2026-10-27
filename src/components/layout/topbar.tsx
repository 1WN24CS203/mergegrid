'use client';

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Menu, Search, Bell } from 'lucide-react';
import { useSidebar } from './sidebar';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Home',
  '/problems': 'Problems',
  '/contests': 'Contests',
  '/discussions': 'Discussions',
  '/opensource': 'Open Source',
  '/projects': 'Projects',
  '/placements': 'Placements',
  '/leaderboard': 'Leaderboard',
  '/notifications': 'Notifications',
  '/profile': 'Profile',
  '/settings': 'Settings',
};

export function Topbar() {
  const { setMobileOpen } = useSidebar();
  const pathname = usePathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const title =
    Object.entries(pageTitles).find(([path]) => pathname.startsWith(path))?.[1] ||
    'MergeGrid';

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/problems?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="h-14 shrink-0 bg-white border-b border-neutral-200 flex items-center gap-3 px-4 sm:px-6">
      {/* Mobile menu toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden text-neutral-500 hover:text-neutral-700 transition-colors cursor-pointer"
        aria-label="Toggle Navigation Menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Page title */}
      <h1 className="text-base font-semibold text-neutral-900">{title}</h1>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Search */}
      <form
        onSubmit={handleSearch}
        className="hidden sm:flex items-center gap-2 bg-neutral-100 rounded-lg px-3 h-8 w-64 hover:bg-neutral-150 transition-colors group"
      >
        <Search className="w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search problems, topics..."
          className="bg-transparent text-sm text-neutral-700 placeholder-neutral-400 outline-none w-full"
        />
        <kbd className="hidden md:inline-flex text-[10px] text-neutral-400 bg-white border border-neutral-200 rounded px-1.5 py-0.5 font-mono">
          ↵
        </kbd>
      </form>

      {/* Notifications bell */}
      <Link
        href="/notifications"
        className="relative text-neutral-500 hover:text-neutral-700 transition-colors p-1.5 rounded-lg hover:bg-neutral-100"
        title="View Notifications"
      >
        <Bell className="w-5 h-5" />
        <span className="absolute top-1 right-1 w-2 h-2 bg-brand-600 rounded-full" />
      </Link>
    </header>
  );
}
