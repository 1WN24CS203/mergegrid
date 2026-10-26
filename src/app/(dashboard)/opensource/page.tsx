'use client';

import React, { useState } from 'react';
import {
  GitFork,
  Star,
  ExternalLink,
  Search,
  Filter,
  CheckCircle,
  Tag,
  Github,
  Plus,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Repo {
  id: string;
  name: string;
  owner: string;
  description: string;
  stars: number;
  forks: number;
  openIssues: number;
  language: string;
  topics: string[];
  goodFirstIssues: number;
  githubUrl: string;
}

const repositoriesData: Repo[] = [
  {
    id: 'r-1',
    name: 'MergeGrid-Core',
    owner: 'mergegrid',
    description: 'The distributed judge engine and contest scoring microservice for MergeGrid.',
    stars: 348,
    forks: 72,
    openIssues: 18,
    language: 'TypeScript',
    topics: ['JudgeEngine', 'NextJS', 'Supabase', 'Docker'],
    goodFirstIssues: 5,
    githubUrl: 'https://github.com',
  },
  {
    id: 'r-2',
    name: 'campus-interview-vault',
    owner: 'bmsce-foss',
    description: 'Community-driven open repository of verified campus interview problems and company blueprints.',
    stars: 182,
    forks: 41,
    openIssues: 12,
    language: 'Python',
    topics: ['DSA', 'LeetCode-Solutions', 'Interviews'],
    goodFirstIssues: 4,
    githubUrl: 'https://github.com',
  },
  {
    id: 'r-3',
    name: 'dev-resume-parser-wasm',
    owner: 'rvce-devs',
    description: 'High-speed client-side resume ATS keyword evaluator running completely in WebAssembly.',
    stars: 215,
    forks: 36,
    openIssues: 8,
    language: 'Rust',
    topics: ['WebAssembly', 'ATS', 'Rust', 'PDF'],
    goodFirstIssues: 3,
    githubUrl: 'https://github.com',
  },
  {
    id: 'r-4',
    name: 'algo-visualizer-react',
    owner: 'iitb-acm',
    description: 'Visual step-by-step debugger for sorting, graph traversals, and dynamic programming tables.',
    stars: 490,
    forks: 110,
    openIssues: 24,
    language: 'TypeScript',
    topics: ['Algorithms', 'Canvas', 'React', 'Education'],
    goodFirstIssues: 8,
    githubUrl: 'https://github.com',
  },
];

export default function OpenSourcePage() {
  const [search, setSearch] = useState('');
  const [selectedLang, setSelectedLang] = useState('All');

  const filtered = repositoriesData.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase());
    const matchesLang = selectedLang === 'All' || r.language === selectedLang;
    return matchesSearch && matchesLang;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">
            Open Source Hub
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Discover student projects, claim &quot;good first issues&quot;, and build real-world git commits.
          </p>
        </div>
        <Button
          icon={<Github className="w-4 h-4" />}
          className="bg-neutral-900 hover:bg-neutral-800 text-white"
        >
          Submit Repository
        </Button>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input
            placeholder="Search open source projects, languages, tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search className="w-4 h-4" />}
          />
        </div>
        <div className="flex items-center gap-2">
          {['All', 'TypeScript', 'Python', 'Rust'].map((lang) => (
            <button
              key={lang}
              onClick={() => setSelectedLang(lang)}
              className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-all ${
                selectedLang === lang
                  ? 'bg-neutral-900 text-white shadow-sm'
                  : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      {/* Repositories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((repo) => (
          <Card key={repo.id} className="p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-neutral-400 font-mono">
                  {repo.owner} /
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                  {repo.goodFirstIssues} Good First Issues
                </span>
              </div>
              <h3 className="text-base font-bold text-neutral-900 hover:text-brand-600 transition-colors">
                {repo.name}
              </h3>
              <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed line-clamp-2">
                {repo.description}
              </p>

              <div className="flex flex-wrap gap-1.5 mt-3">
                {repo.topics.map((t) => (
                  <span
                    key={t}
                    className="text-[10px] px-2 py-0.5 rounded bg-neutral-100 text-neutral-600 font-mono"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-neutral-100 flex items-center justify-between">
              <div className="flex items-center gap-4 text-xs text-neutral-500 font-mono">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-brand-500" /> {repo.language}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> {repo.stars}
                </span>
                <span className="flex items-center gap-1">
                  <GitFork className="w-3.5 h-3.5 text-neutral-400" /> {repo.forks}
                </span>
              </div>
              <a
                href={repo.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700"
              >
                Contribute <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
