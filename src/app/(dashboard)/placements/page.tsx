'use client';

import React, { useState } from 'react';
import {
  GraduationCap,
  Building2,
  BookOpen,
  CheckCircle2,
  Search,
  ExternalLink,
  ChevronRight,
  Sparkles,
  FileText,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

interface CompanyArchive {
  id: string;
  name: string;
  rounds: string;
  difficulty: 'High' | 'Medium';
  hiringCycle: string;
  topics: string[];
  solvedCount: number;
  totalQuestions: number;
}

const companiesData: CompanyArchive[] = [
  {
    id: 'comp-1',
    name: 'Google',
    rounds: 'Online Assessment + 3 Technical Coding + 1 Googliness',
    difficulty: 'High',
    hiringCycle: 'Campus 2025-2026',
    topics: ['Segment Trees', 'Trie', 'Dynamic Programming', 'Concurrency'],
    solvedCount: 18,
    totalQuestions: 45,
  },
  {
    id: 'comp-2',
    name: 'Amazon',
    rounds: 'OA (2 Coding + Work Style) + 3 Technical Rounds',
    difficulty: 'High',
    hiringCycle: 'SDE 1 Full Time',
    topics: ['Graphs / BFS-DFS', 'Heaps', 'Leadership Principles', 'System Design'],
    solvedCount: 29,
    totalQuestions: 50,
  },
  {
    id: 'comp-3',
    name: 'Microsoft',
    rounds: 'Codility OA + 3 Tech Virtual Onsites',
    difficulty: 'Medium',
    hiringCycle: 'Internship & FTE',
    topics: ['Linked Lists', 'Binary Trees', 'Strings', 'DBMS Concepts'],
    solvedCount: 34,
    totalQuestions: 40,
  },
  {
    id: 'comp-4',
    name: 'Atlassian',
    rounds: 'Karat Screening + System Design + DSA Deep Dive',
    difficulty: 'High',
    hiringCycle: 'FTE 2026',
    topics: ['Data Structures', 'Distributed Rate Limiter', 'Clean Code'],
    solvedCount: 12,
    totalQuestions: 25,
  },
];

export default function PlacementsPage() {
  const [search, setSearch] = useState('');

  const filtered = companiesData.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">
            Placement & Interview Hub
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Company-specific question archives, interview rounds breakdown, and core CS cheat sheets.
          </p>
        </div>
      </div>

      {/* Quick Prep Tracks */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link href="/problems?search=Arrays" className="group">
          <Card className="p-4 bg-gradient-to-br from-brand-50 to-white border-brand-200/80 group-hover:border-brand-400 group-hover:shadow-sm transition-all h-full">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-brand-600 text-white">
                <FileText className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-neutral-900 text-sm group-hover:text-brand-600 transition-colors">
                Blind 75 & Grind 169
              </h3>
            </div>
            <p className="text-xs text-neutral-500">
              Hand-picked optimal collection of must-do algorithmic patterns.
            </p>
          </Card>
        </Link>

        <Link href="/problems?search=Stacks" className="group">
          <Card className="p-4 bg-gradient-to-br from-cyan-50 to-white border-cyan-200/80 group-hover:border-cyan-400 group-hover:shadow-sm transition-all h-full">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-cyan-600 text-white">
                <BookOpen className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-neutral-900 text-sm group-hover:text-cyan-600 transition-colors">
                OS & DBMS Essentials
              </h3>
            </div>
            <p className="text-xs text-neutral-500">
              Indexing, ACID transactions, paging, deadlocks, and virtual memory.
            </p>
          </Card>
        </Link>

        <Link href="/problems?search=Dynamic" className="group">
          <Card className="p-4 bg-gradient-to-br from-purple-50 to-white border-purple-200/80 group-hover:border-purple-400 group-hover:shadow-sm transition-all h-full">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-purple-600 text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-neutral-900 text-sm group-hover:text-purple-600 transition-colors">
                System Design Primers
              </h3>
            </div>
            <p className="text-xs text-neutral-500">
              Designing URL shorteners, news feeds, WhatsApp chat architecture.
            </p>
          </Card>
        </Link>
      </div>

      {/* Search */}
      <Input
        placeholder="Search company archives (Google, Amazon, Microsoft...)"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        icon={<Search className="w-4 h-4" />}
      />

      {/* Company Archives List */}
      <div className="space-y-4">
        {filtered.map((company) => (
          <Card key={company.id} className="p-5 hover:border-neutral-300 transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-bold text-neutral-900">
                    {company.name}
                  </h3>
                  <span
                    className={`text-xs px-2 py-0.5 rounded font-semibold ${
                      company.difficulty === 'High'
                        ? 'bg-rose-50 text-rose-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    {company.difficulty} Bar
                  </span>
                  <span className="text-xs text-neutral-400 font-mono">
                    {company.hiringCycle}
                  </span>
                </div>
                <p className="text-xs text-neutral-600">
                  {company.rounds}
                </p>

                <div className="flex flex-wrap gap-1.5 mt-3">
                  {company.topics.map((t) => (
                    <span
                      key={t}
                      className="text-[10px] px-2 py-0.5 rounded bg-neutral-100 text-neutral-600 font-medium"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="sm:text-right shrink-0">
                <div className="text-xs text-neutral-500 mb-1">
                  Progress: {company.solvedCount} / {company.totalQuestions} Solved
                </div>
                <div className="w-44 bg-neutral-100 h-2 rounded-full overflow-hidden mb-3">
                  <div
                    className="bg-brand-600 h-full rounded-full"
                    style={{
                      width: `${(company.solvedCount / company.totalQuestions) * 100}%`,
                    }}
                  />
                </div>
                <Link href={`/problems?search=${encodeURIComponent(company.name)}`}>
                  <Button size="sm" variant="outline" className="hover:border-brand-500 hover:text-brand-600">
                    Practice Set <ChevronRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
