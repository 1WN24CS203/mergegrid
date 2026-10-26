'use client';

import React, { useState } from 'react';
import {
  Code2,
  Search,
  CheckCircle2,
  Filter,
  Play,
  Terminal,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronRight,
  BookOpen,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Problem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  acceptance: string;
  solved: boolean;
  companies: string[];
}

const problemsData: Problem[] = [
  {
    id: '1',
    title: 'Two Sum & Hash Map Lookups',
    difficulty: 'Easy',
    category: 'Arrays & Hashing',
    acceptance: '53.4%',
    solved: true,
    companies: ['Google', 'Amazon', 'Meta'],
  },
  {
    id: '2',
    title: 'Coin Change (Min Coins & DP)',
    difficulty: 'Medium',
    category: 'Dynamic Programming',
    acceptance: '42.8%',
    solved: true,
    companies: ['Microsoft', 'Uber', 'Atlassian'],
  },
  {
    id: '3',
    title: 'LRU Cache Design with Doubly Linked List',
    difficulty: 'Medium',
    category: 'Data Structures',
    acceptance: '41.2%',
    solved: false,
    companies: ['Amazon', 'Apple', 'Google'],
  },
  {
    id: '4',
    title: 'Median of Two Sorted Arrays',
    difficulty: 'Hard',
    category: 'Binary Search',
    acceptance: '38.6%',
    solved: false,
    companies: ['Google', 'Goldman Sachs'],
  },
  {
    id: '5',
    title: 'Merge K Sorted Lists',
    difficulty: 'Hard',
    category: 'Heaps & Priority Queues',
    acceptance: '50.1%',
    solved: false,
    companies: ['Amazon', 'Microsoft', 'Bloomberg'],
  },
  {
    id: '6',
    title: 'Course Schedule (Topological Sort / Kahn)',
    difficulty: 'Medium',
    category: 'Graphs',
    acceptance: '47.3%',
    solved: true,
    companies: ['Twitter', 'Salesforce', 'Meta'],
  },
  {
    id: '7',
    title: 'Valid Parentheses & Stack Evaluation',
    difficulty: 'Easy',
    category: 'Stacks',
    acceptance: '41.5%',
    solved: true,
    companies: ['Adobe', 'Cisco', 'PayPal'],
  },
  {
    id: '8',
    title: 'Word Search II (Trie & Backtracking)',
    difficulty: 'Hard',
    category: 'Backtracking',
    acceptance: '36.9%',
    solved: false,
    companies: ['Uber', 'Airbnb', 'Amazon'],
  },
];

export default function ProblemsPage() {
  const [search, setSearch] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [activeProblem, setActiveProblem] = useState<Problem | null>(null);

  const filtered = problemsData.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    const matchesDiff =
      selectedDifficulty === 'All' || p.difficulty === selectedDifficulty;
    return matchesSearch && matchesDiff;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">
            Problem Arena
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Master Data Structures, Algorithms, and System Design with collegiate peers.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            icon={<Sparkles className="w-4 h-4 text-brand-600" />}
            onClick={() => setActiveProblem(problemsData[0])}
          >
            Daily Challenge
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-xs font-medium text-neutral-500">Solved Total</p>
          <p className="text-2xl font-bold text-neutral-900 mt-1">4 / 8</p>
          <div className="w-full bg-neutral-100 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-brand-600 h-full rounded-full" style={{ width: '50%' }} />
          </div>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-medium text-neutral-500">Easy</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">2 / 2</p>
          <p className="text-xs text-neutral-400 mt-1">100% completion</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-medium text-neutral-500">Medium</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">2 / 3</p>
          <p className="text-xs text-neutral-400 mt-1">66% completion</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-medium text-neutral-500">Hard</p>
          <p className="text-2xl font-bold text-rose-600 mt-1">0 / 3</p>
          <p className="text-xs text-neutral-400 mt-1">Next up</p>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input
            placeholder="Search problems, topics, or companies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search className="w-4 h-4" />}
          />
        </div>
        <div className="flex items-center gap-2">
          {['All', 'Easy', 'Medium', 'Hard'].map((diff) => (
            <button
              key={diff}
              onClick={() => setSelectedDifficulty(diff)}
              className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-all ${
                selectedDifficulty === diff
                  ? 'bg-neutral-900 text-white shadow-sm'
                  : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Problem Table */}
      <Card className="overflow-hidden border border-neutral-200/80">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-50 border-b border-neutral-200 text-xs text-neutral-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4 w-12 text-center">Status</th>
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Difficulty</th>
                <th className="py-3 px-4">Acceptance</th>
                <th className="py-3 px-4">Companies</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filtered.map((problem) => (
                <tr
                  key={problem.id}
                  className="hover:bg-neutral-50/70 transition-colors group cursor-pointer"
                  onClick={() => setActiveProblem(problem)}
                >
                  <td className="py-3.5 px-4 text-center">
                    {problem.solved ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" />
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-neutral-300 mx-auto" />
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-neutral-900 group-hover:text-brand-600 transition-colors">
                    {problem.title}
                  </td>
                  <td className="py-3.5 px-4 text-neutral-600 text-xs">
                    {problem.category}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                        problem.difficulty === 'Easy'
                          ? 'bg-emerald-50 text-emerald-700'
                          : problem.difficulty === 'Medium'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-rose-50 text-rose-700'
                      }`}
                    >
                      {problem.difficulty}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-neutral-500 font-mono text-xs">
                    {problem.acceptance}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1">
                      {problem.companies.slice(0, 2).map((comp) => (
                        <span
                          key={comp}
                          className="px-1.5 py-0.5 rounded bg-neutral-100 text-[10px] text-neutral-600"
                        >
                          {comp}
                        </span>
                      ))}
                      {problem.companies.length > 2 && (
                        <span className="text-[10px] text-neutral-400">
                          +{problem.companies.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-brand-600 hover:text-brand-700 hover:bg-brand-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveProblem(problem);
                      }}
                    >
                      Solve <ChevronRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Solve Drawer / Modal */}
      {activeProblem && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full border border-neutral-200 overflow-hidden flex flex-col max-h-[90vh] animate-scale-in">
            {/* Modal Header */}
            <div className="p-4 sm:p-6 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-brand-50 text-brand-600">
                  <Code2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-neutral-900">
                    {activeProblem.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded ${
                        activeProblem.difficulty === 'Easy'
                          ? 'bg-emerald-100 text-emerald-800'
                          : activeProblem.difficulty === 'Medium'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {activeProblem.difficulty}
                    </span>
                    <span className="text-xs text-neutral-500">
                      Category: {activeProblem.category}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setActiveProblem(null)}
                className="text-neutral-400 hover:text-neutral-600 p-2 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4">
              <div>
                <h4 className="text-xs font-semibold uppercase text-neutral-500 mb-2">
                  Problem Description
                </h4>
                <p className="text-sm text-neutral-700 leading-relaxed">
                  Given an array of integers <code className="bg-neutral-100 px-1 py-0.5 rounded font-mono text-xs">nums</code> and an integer <code className="bg-neutral-100 px-1 py-0.5 rounded font-mono text-xs">target</code>, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution.
                </p>
              </div>

              {/* Code Window Mock */}
              <div className="rounded-xl bg-[#0d1117] text-neutral-200 p-4 font-mono text-xs overflow-x-auto border border-neutral-800">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-800 text-neutral-400 text-[11px] mb-3">
                  <span>Language: TypeScript 5.4</span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <Terminal className="w-3.5 h-3.5" /> Ready to Run
                  </span>
                </div>
                <pre className="text-neutral-300">
                  <code>
                    <span className="text-purple-400">function</span> <span className="text-blue-400">solve</span>(nums: <span className="text-teal-300">number[]</span>, target: <span className="text-teal-300">number</span>): <span className="text-teal-300">number[]</span> &#123;{'\n'}
                    {'  '}<span className="text-purple-400">const</span> map = <span className="text-purple-400">new</span> <span className="text-blue-400">Map</span>&lt;<span className="text-teal-300">number</span>, <span className="text-teal-300">number</span>&gt;();{'\n'}
                    {'  '}<span className="text-purple-400">for</span> (<span className="text-purple-400">let</span> i = <span className="text-amber-300">0</span>; i &lt; nums.length; i++) &#123;{'\n'}
                    {'    '}<span className="text-purple-400">const</span> complement = target - nums[i];{'\n'}
                    {'    '}<span className="text-purple-400">if</span> (map.has(complement)) &#123;{'\n'}
                    {'      '}<span className="text-purple-400">return</span> [map.get(complement)!, i];{'\n'}
                    {'    '}&#125;{'\n'}
                    {'    '}map.set(nums[i], i);{'\n'}
                    {'  '}&#125;{'\n'}
                    {'  '}<span className="text-purple-400">return</span> [];{'\n'}
                    &#125;
                  </code>
                </pre>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-neutral-200 bg-neutral-50 flex items-center justify-between">
              <Button variant="outline" size="sm" onClick={() => setActiveProblem(null)}>
                Close
              </Button>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" icon={<Play className="w-3.5 h-3.5" />}>
                  Run Code
                </Button>
                <Button size="sm" className="bg-brand-600 hover:bg-brand-700 text-white font-semibold">
                  Submit Solution
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
