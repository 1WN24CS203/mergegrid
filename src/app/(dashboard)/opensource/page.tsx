'use client';

import React, { useState, useEffect } from 'react';
import {
  GitFork,
  Star,
  ExternalLink,
  Search,
  Plus,
} from 'lucide-react';
import { Github } from '@/components/ui/icons';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/toast';

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

const defaultRepos: Repo[] = [
  {
    id: 'r-1',
    name: 'mergegrid',
    owner: '1WN24CS203',
    description: 'The all-in-one developer collaboration & competition platform built with Next.js & Supabase.',
    stars: 1,
    forks: 0,
    openIssues: 0,
    language: 'TypeScript',
    topics: ['NextJS', 'Supabase', 'Tailwind', 'Competitive-Coding'],
    goodFirstIssues: 0,
    githubUrl: 'https://github.com/1WN24CS203/mergegrid',
  },
];

export default function OpenSourcePage() {
  const [repos, setRepos] = useState<Repo[]>(defaultRepos);
  const [search, setSearch] = useState('');
  const [selectedLang, setSelectedLang] = useState('All');
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [repoName, setRepoName] = useState('');
  const [repoOwner, setRepoOwner] = useState('');
  const [repoDesc, setRepoDesc] = useState('');
  const [repoLang, setRepoLang] = useState('TypeScript');
  const [repoUrl, setRepoUrl] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    try {
      const saved = localStorage.getItem('mergegrid_repos');
      if (saved) {
        setRepos(JSON.parse(saved));
      }
    } catch {
      // Ignore
    }
  }, []);

  const handleAddRepo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoName.trim() || !repoUrl.trim()) {
      toast({ type: 'error', title: 'Please provide repository name and URL' });
      return;
    }

    const newRepo: Repo = {
      id: `r-${Date.now()}`,
      name: repoName.trim(),
      owner: repoOwner.trim() || 'developer',
      description: repoDesc.trim() || 'Open source developer project seeking contributors.',
      stars: 1,
      forks: 0,
      openIssues: 1,
      language: repoLang,
      topics: [repoLang, 'OpenSource'],
      goodFirstIssues: 1,
      githubUrl: repoUrl.trim(),
    };

    const updated = [newRepo, ...repos];
    setRepos(updated);
    try {
      localStorage.setItem('mergegrid_repos', JSON.stringify(updated));
    } catch {
      // Ignore
    }

    setRepoName('');
    setRepoOwner('');
    setRepoDesc('');
    setRepoUrl('');
    setShowSubmitModal(false);
    toast({ type: 'success', title: 'Repository submitted to radar!' });
  };

  const filtered = repos.filter((r) => {
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
          className="bg-neutral-900 hover:bg-neutral-800 text-white cursor-pointer"
          onClick={() => setShowSubmitModal(true)}
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
          {['All', 'TypeScript', 'Python', 'Go', 'Rust'].map((lang) => (
            <button
              key={lang}
              onClick={() => setSelectedLang(lang)}
              className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
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

      {/* Submit Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full border border-neutral-200 p-6 animate-scale-in">
            <h3 className="text-lg font-bold text-neutral-900 mb-4">
              Submit Open Source Repository
            </h3>
            <form onSubmit={handleAddRepo} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-neutral-700 block mb-1">
                    Owner / Organization
                  </label>
                  <Input
                    placeholder="e.g. 1WN24CS203"
                    value={repoOwner}
                    onChange={(e) => setRepoOwner(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-700 block mb-1">
                    Repository Name
                  </label>
                  <Input
                    placeholder="e.g. mergegrid"
                    value={repoName}
                    onChange={(e) => setRepoName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Explain what the repository does..."
                  value={repoDesc}
                  onChange={(e) => setRepoDesc(e.target.value)}
                  className="w-full text-sm border border-neutral-200 rounded-lg p-2.5 bg-white text-neutral-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-neutral-700 block mb-1">
                    Primary Language
                  </label>
                  <select
                    value={repoLang}
                    onChange={(e) => setRepoLang(e.target.value)}
                    className="w-full text-sm border border-neutral-200 rounded-lg p-2.5 bg-white text-neutral-800"
                  >
                    <option value="TypeScript">TypeScript</option>
                    <option value="Python">Python</option>
                    <option value="Go">Go</option>
                    <option value="Rust">Rust</option>
                    <option value="JavaScript">JavaScript</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-700 block mb-1">
                    GitHub URL
                  </label>
                  <Input
                    placeholder="https://github.com/..."
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowSubmitModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-brand-600 hover:bg-brand-700 text-white font-medium">
                  Submit to Radar
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
