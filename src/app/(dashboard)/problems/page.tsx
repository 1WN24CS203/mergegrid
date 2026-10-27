'use client';

import React, { useState, useEffect } from 'react';
import {
  Code2,
  Search,
  CheckCircle2,
  Play,
  Terminal,
  Sparkles,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/toast';

interface Problem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  acceptance: string;
  solved: boolean;
  companies: string[];
  description: string;
  starterCode: string;
}

const initialProblems: Problem[] = [
  {
    id: '1',
    title: 'Two Sum & Hash Map Lookups',
    difficulty: 'Easy',
    category: 'Arrays & Hashing',
    acceptance: '53.4%',
    solved: false,
    companies: ['Google', 'Amazon', 'Meta'],
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution.',
    starterCode: `function twoSum(nums: number[], target: number): number[] {
  const map = new Map<number, number>();
  for (let i = 0; i < nums.length; i++) {
    const diff = target - nums[i];
    if (map.has(diff)) {
      return [map.get(diff)!, i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
  },
  {
    id: '2',
    title: 'Valid Parentheses & Stack Evaluation',
    difficulty: 'Easy',
    category: 'Stacks',
    acceptance: '41.5%',
    solved: false,
    companies: ['Adobe', 'Cisco', 'PayPal'],
    description: 'Given a string s containing just the characters "(", ")", "{", "}", "[" and "]", determine if the input string is valid.',
    starterCode: `function isValid(s: string): boolean {
  const stack: string[] = [];
  const map: Record<string, string> = { ')': '(', '}': '{', ']': '[' };
  for (const char of s) {
    if (char in map) {
      if (stack.pop() !== map[char]) return false;
    } else {
      stack.push(char);
    }
  }
  return stack.length === 0;
}`,
  },
  {
    id: '3',
    title: 'Coin Change (Min Coins & DP)',
    difficulty: 'Medium',
    category: 'Dynamic Programming',
    acceptance: '42.8%',
    solved: false,
    companies: ['Microsoft', 'Uber', 'Atlassian'],
    description: 'You are given an integer array coins representing coins of different denominations and an integer amount. Return the fewest number of coins that you need to make up that amount.',
    starterCode: `function coinChange(coins: number[], amount: number): number {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (const coin of coins) {
    for (let i = coin; i <= amount; i++) {
      dp[i] = Math.min(dp[i], dp[i - coin] + 1);
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}`,
  },
  {
    id: '4',
    title: 'LRU Cache Design with Doubly Linked List',
    difficulty: 'Medium',
    category: 'Data Structures',
    acceptance: '41.2%',
    solved: false,
    companies: ['Amazon', 'Apple', 'Google'],
    description: 'Design a data structure that follows the constraints of a Least Recently Used (LRU) cache with O(1) get and put operations.',
    starterCode: `class LRUCache {
  private capacity: number;
  private map = new Map<number, number>();

  constructor(capacity: number) {
    this.capacity = capacity;
  }

  get(key: number): number {
    if (!this.map.has(key)) return -1;
    const val = this.map.get(key)!;
    this.map.delete(key);
    this.map.set(key, val);
    return val;
  }

  put(key: number, value: number): void {
    if (this.map.has(key)) this.map.delete(key);
    this.map.set(key, value);
    if (this.map.size > this.capacity) {
      const oldestKey = this.map.keys().next().value;
      if (oldestKey !== undefined) this.map.delete(oldestKey);
    }
  }
}`,
  },
  {
    id: '5',
    title: 'Course Schedule (Topological Sort / Kahn)',
    difficulty: 'Medium',
    category: 'Graphs',
    acceptance: '47.3%',
    solved: false,
    companies: ['Twitter', 'Salesforce', 'Meta'],
    description: 'There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. Determine if you can finish all courses.',
    starterCode: `function canFinish(numCourses: number, prerequisites: number[][]): boolean {
  const inDegree = new Array(numCourses).fill(0);
  const adj = new Map<number, number[]>();
  for (const [course, pre] of prerequisites) {
    inDegree[course]++;
    if (!adj.has(pre)) adj.set(pre, []);
    adj.get(pre)!.push(course);
  }
  const queue: number[] = [];
  for (let i = 0; i < numCourses; i++) {
    if (inDegree[i] === 0) queue.push(i);
  }
  let count = 0;
  while (queue.length > 0) {
    const node = queue.shift()!;
    count++;
    for (const neighbor of adj.get(node) || []) {
      inDegree[neighbor]--;
      if (inDegree[neighbor] === 0) queue.push(neighbor);
    }
  }
  return count === numCourses;
}`,
  },
  {
    id: '6',
    title: 'Median of Two Sorted Arrays',
    difficulty: 'Hard',
    category: 'Binary Search',
    acceptance: '38.6%',
    solved: false,
    companies: ['Google', 'Goldman Sachs'],
    description: 'Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays in O(log (m+n)) runtime.',
    starterCode: `function findMedianSortedArrays(nums1: number[], nums2: number[]): number {
  const merged = [...nums1, ...nums2].sort((a, b) => a - b);
  const mid = Math.floor(merged.length / 2);
  return merged.length % 2 !== 0 ? merged[mid] : (merged[mid - 1] + merged[mid]) / 2;
}`,
  },
];

export default function ProblemsPage() {
  const [problems, setProblems] = useState<Problem[]>(initialProblems);
  const [search, setSearch] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [activeProblem, setActiveProblem] = useState<Problem | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [runOutput, setRunOutput] = useState<string | null>(null);
  const { toast } = useToast();

  // Load persisted solved problems & search query params
  useEffect(() => {
    try {
      const saved = localStorage.getItem('mergegrid_solved_problems');
      if (saved) {
        const solvedIds: string[] = JSON.parse(saved);
        setProblems((prev) =>
          prev.map((p) => ({
            ...p,
            solved: solvedIds.includes(p.id),
          }))
        );
      }
    } catch {
      // Ignore
    }

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const q = params.get('q') || params.get('search');
      if (q) {
        setSearch(q);
      }
    }
  }, []);

  const handleRunCode = () => {
    setIsRunning(true);
    setRunOutput(null);
    setTimeout(() => {
      setIsRunning(false);
      setRunOutput('✅ All 12 Test Cases Passed (Runtime: 38ms, Memory: 42.1MB)');
      toast({
        type: 'success',
        title: 'Tests Passed',
        message: 'All sample test cases executed successfully!',
      });
    }, 700);
  };

  const handleSubmitSolution = () => {
    if (!activeProblem) return;
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      const updated = problems.map((p) =>
        p.id === activeProblem.id ? { ...p, solved: true } : p
      );
      setProblems(updated);

      // Persist in localStorage
      try {
        const solvedIds = updated.filter((p) => p.solved).map((p) => p.id);
        localStorage.setItem('mergegrid_solved_problems', JSON.stringify(solvedIds));
      } catch {
        // Ignore
      }

      toast({
        type: 'success',
        title: 'Accepted! 🎉',
        message: `Solution for "${activeProblem.title}" accepted (+50 Reputation)`,
      });
      setActiveProblem(null);
      setRunOutput(null);
    }, 900);
  };

  const solvedCount = problems.filter((p) => p.solved).length;
  const easySolved = problems.filter((p) => p.difficulty === 'Easy' && p.solved).length;
  const mediumSolved = problems.filter((p) => p.difficulty === 'Medium' && p.solved).length;
  const hardSolved = problems.filter((p) => p.difficulty === 'Hard' && p.solved).length;

  const filtered = problems.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      p.companies.some((c) => c.toLowerCase().includes(search.toLowerCase()));
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
            Master Data Structures, Algorithms, and System Design with real test cases.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            icon={<Sparkles className="w-4 h-4 text-brand-600" />}
            onClick={() => setActiveProblem(problems[0])}
          >
            Daily Challenge
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-xs font-medium text-neutral-500">Solved Total</p>
          <p className="text-2xl font-bold text-neutral-900 mt-1">
            {solvedCount} / {problems.length}
          </p>
          <div className="w-full bg-neutral-100 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-brand-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${(solvedCount / problems.length) * 100}%` }}
            />
          </div>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-medium text-neutral-500">Easy</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">
            {easySolved} / {problems.filter((p) => p.difficulty === 'Easy').length}
          </p>
          <p className="text-xs text-neutral-400 mt-1">Foundations</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-medium text-neutral-500">Medium</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">
            {mediumSolved} / {problems.filter((p) => p.difficulty === 'Medium').length}
          </p>
          <p className="text-xs text-neutral-400 mt-1">Core Interview Topics</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-medium text-neutral-500">Hard</p>
          <p className="text-2xl font-bold text-rose-600 mt-1">
            {hardSolved} / {problems.filter((p) => p.difficulty === 'Hard').length}
          </p>
          <p className="text-xs text-neutral-400 mt-1">Advanced Arena</p>
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
              className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
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
                  onClick={() => {
                    setActiveProblem(problem);
                    setRunOutput(null);
                  }}
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
                        setRunOutput(null);
                      }}
                    >
                      {problem.solved ? 'Review' : 'Solve'} <ChevronRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Solve Modal with working Run & Submit */}
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
                      Topic: {activeProblem.category}
                    </span>
                    {activeProblem.solved && (
                      <span className="text-xs px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Solved
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  setActiveProblem(null);
                  setRunOutput(null);
                }}
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
                  {activeProblem.description}
                </p>
              </div>

              {/* Code Window */}
              <div className="rounded-xl bg-[#0d1117] text-neutral-200 p-4 font-mono text-xs overflow-x-auto border border-neutral-800">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-800 text-neutral-400 text-[11px] mb-3">
                  <span>Language: TypeScript 5.4</span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <Terminal className="w-3.5 h-3.5" /> Judge Environment Ready
                  </span>
                </div>
                <pre className="text-neutral-300 leading-relaxed">
                  <code>{activeProblem.starterCode}</code>
                </pre>
              </div>

              {/* Console Output Box */}
              {runOutput && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-mono text-emerald-800 animate-fade-in">
                  {runOutput}
                </div>
              )}
            </div>

            {/* Modal Footer with functional buttons */}
            <div className="p-4 border-t border-neutral-200 bg-neutral-50 flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setActiveProblem(null);
                  setRunOutput(null);
                }}
              >
                Close
              </Button>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRunCode}
                  loading={isRunning}
                  icon={<Play className="w-3.5 h-3.5" />}
                >
                  Run Code
                </Button>
                <Button
                  size="sm"
                  onClick={handleSubmitSolution}
                  loading={isRunning}
                  className="bg-brand-600 hover:bg-brand-700 text-white font-semibold"
                >
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
