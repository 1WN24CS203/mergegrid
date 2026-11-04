'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Code2,
  Building2,
  X,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Terminal,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast';

export type ProblemLanguage =
  | 'c'
  | 'cpp'
  | 'java'
  | 'python'
  | 'typescript'
  | 'javascript'
  | 'go'
  | 'rust';

export const ALL_LANGUAGES: { key: ProblemLanguage; label: string; badge: string }[] = [
  { key: 'c', label: 'C (C17)', badge: 'C' },
  { key: 'cpp', label: 'C++ (20)', badge: 'C++' },
  { key: 'java', label: 'Java 21', badge: 'Java' },
  { key: 'python', label: 'Python 3.12', badge: 'Python' },
  { key: 'typescript', label: 'TypeScript', badge: 'TS' },
  { key: 'javascript', label: 'JavaScript', badge: 'JS' },
  { key: 'go', label: 'Go (1.22)', badge: 'Go' },
  { key: 'rust', label: 'Rust (1.76)', badge: 'Rust' },
];

export interface ProposedProblemData {
  id: string;
  slug: string;
  title: string;
  platform: 'LeetCode' | 'Codeforces' | 'HackerRank' | 'CodeChef';
  platformId: string;
  platformUrl: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  acceptance: string;
  solved: boolean;
  companies: string[];
  description: string;
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  constraints: string[];
  starterCode: Record<string, string>;
}

interface ProposeProblemModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingTitles: string[];
  onProblemApproved: (problem: ProposedProblemData) => void;
}

function generateDefaultTemplates(title: string): Record<ProblemLanguage, string> {
  const fnName =
    title
      .trim()
      .replace(/[^a-zA-Z0-9 ]/g, '')
      .split(' ')
      .filter(Boolean)
      .map((word, index) =>
        index === 0
          ? word.toLowerCase()
          : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      )
      .join('') || 'solve';

  return {
    c: `/**\n * Solution for ${title || 'Challenge'}\n * Note: The returned array must be malloced, assume caller calls free().\n */\nint* ${fnName}(int* nums, int numsSize, int* returnSize) {\n    // Write your solution here\n    *returnSize = 0;\n    return NULL;\n}`,
    cpp: `class Solution {\npublic:\n    int ${fnName}(vector<int>& nums) {\n        // Write your solution here\n        return 0;\n    }\n};`,
    java: `class Solution {\n    public int ${fnName}(int[] nums) {\n        // Write your solution here\n        return 0;\n    }\n}`,
    python: `class Solution:\n    def ${fnName}(self, nums: list[int]) -> int:\n        # Write your solution here\n        pass`,
    typescript: `function ${fnName}(nums: number[]): number {\n  // Write your solution here\n  return 0;\n}`,
    javascript: `/**\n * @param {number[]} nums\n * @return {number}\n */\nvar ${fnName} = function(nums) {\n  // Write your solution here\n  return 0;\n};`,
    go: `package main\n\nfunc ${fnName}(nums []int) int {\n    // Write your solution here\n    return 0\n}`,
    rust: `impl Solution {\n    pub fn ${fnName}(nums: Vec<i32>) -> i32 {\n        // Write your solution here\n        0\n    }\n}`,
  };
}

export function ProposeProblemModal({
  isOpen,
  onClose,
  existingTitles,
  onProblemApproved,
}: ProposeProblemModalProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Arrays & Hashing');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [companiesStr, setCompaniesStr] = useState('Google, Amazon');
  const [description, setDescription] = useState('');
  const [sampleInput, setSampleInput] = useState('');
  const [sampleOutput, setSampleOutput] = useState('');
  const [constraints, setConstraints] = useState('1 <= n <= 10^5, time complexity target O(n)');

  // Starter Code across all 8 languages
  const [activeLangTab, setActiveLangTab] = useState<ProblemLanguage>('c');
  const [starterCodes, setStarterCodes] = useState<Record<ProblemLanguage, string>>(() =>
    generateDefaultTemplates('')
  );

  const [isReviewing, setIsReviewing] = useState(false);
  const [reviewResult, setReviewResult] = useState<{
    decision: 'APPROVED' | 'NEEDS_REVISION' | 'DUPLICATE';
    impactScore: number;
    summary: string;
    similarityCheck: {
      exists: boolean;
      isConceptualMatch?: boolean;
      similarTo: string | null;
      similarityScore: number;
      explanation?: string;
    };
    strengths: string[];
    recommendations: string[];
    starterCode?: Record<string, string>;
  } | null>(null);

  const { toast } = useToast();

  // Auto-refresh starter templates when title changes if user hasn't heavily modified them
  useEffect(() => {
    if (title.trim()) {
      setStarterCodes((prev) => {
        const generated = generateDefaultTemplates(title);
        const updated = { ...prev };
        for (const lang of Object.keys(generated) as ProblemLanguage[]) {
          // If code is still default/empty, update it with new function name
          if (!updated[lang] || updated[lang].includes('solve') || updated[lang].includes('Challenge')) {
            updated[lang] = generated[lang];
          }
        }
        return updated;
      });
    }
  }, [title]);

  if (!isOpen) return null;

  const handleStarterCodeChange = (lang: ProblemLanguage, code: string) => {
    setStarterCodes((prev) => ({
      ...prev,
      [lang]: code,
    }));
  };

  const handleResetLangTemplate = (lang: ProblemLanguage) => {
    const templates = generateDefaultTemplates(title);
    setStarterCodes((prev) => ({
      ...prev,
      [lang]: templates[lang],
    }));
    toast({ type: 'info', title: `Reset ${lang.toUpperCase()} template` });
  };

  const handleRunAiReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      toast({
        type: 'error',
        title: 'Missing information',
        message: 'Please provide both a problem title and description before requesting AI review.',
      });
      return;
    }

    setIsReviewing(true);
    setReviewResult(null);

    const companies = companiesStr
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);

    try {
      const res = await fetch('/api/ai/review-problem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          category,
          difficulty,
          companies,
          description: description.trim(),
          sampleInput: sampleInput.trim(),
          sampleOutput: sampleOutput.trim(),
          constraints: constraints.trim(),
          existingTitles,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to complete review');
      }

      setReviewResult(data);

      // If AI generated starter code for all languages, merge it into starterCodes
      if (data.starterCode) {
        setStarterCodes((prev) => ({
          ...prev,
          ...data.starterCode,
        }));
      }

      if (data.decision === 'APPROVED') {
        toast({
          type: 'success',
          title: 'AI Review Complete: Approved! 🎯',
          message: `Impact score: ${data.impactScore}/100. High quality challenge.`,
        });
      } else if (data.decision === 'DUPLICATE') {
        toast({
          type: 'error',
          title: 'Duplicate Detected',
          message: `Similar to existing problem: "${data.similarityCheck.similarTo}"`,
        });
      } else {
        toast({
          type: 'info',
          title: 'Review Complete: Revisions Suggested',
          message: 'Review suggestions below to improve challenge quality.',
        });
      }
    } catch (err: any) {
      toast({
        type: 'error',
        title: 'Review Failed',
        message: err?.message || 'Could not reach AI review engine.',
      });
    } finally {
      setIsReviewing(false);
    }
  };

  const handlePublishToArena = () => {
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const companies = companiesStr
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);

    const newProblem: ProposedProblemData = {
      id: `custom-${Date.now()}`,
      slug,
      title: title.trim(),
      platform: 'LeetCode',
      platformId: `Community #${Math.floor(Math.random() * 800 + 100)}`,
      platformUrl: `https://leetcode.com/problemset/all/?search=${encodeURIComponent(title.trim())}`,
      difficulty,
      category,
      acceptance: `${Math.floor(Math.random() * 25 + 40)}%`,
      solved: false,
      companies: companies.length > 0 ? companies : ['Community'],
      description: description.trim(),
      examples: [
        {
          input: sampleInput.trim() || 'Input data',
          output: sampleOutput.trim() || 'Expected output',
        },
      ],
      constraints: constraints
        .split('\n')
        .map((c) => c.trim())
        .filter(Boolean),
      starterCode: starterCodes,
    };

    onProblemApproved(newProblem);
    toast({
      type: 'success',
      title: 'Problem Published to Arena! 🚀',
      message: `"${newProblem.title}" with starter templates for 8 languages is now available.`,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full border border-neutral-200 overflow-hidden flex flex-col max-h-[92vh] animate-scale-in">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between bg-gradient-to-r from-neutral-900 to-neutral-800 text-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-brand-500/20 text-brand-400 border border-brand-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                Propose New Arena Challenge
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-brand-500 text-white">
                  Multi-Language &amp; AI Evaluated
                </span>
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Submit an algorithmic challenge with starter code for C, C++, Java, Python, TypeScript, JavaScript, Go, and Rust.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <form onSubmit={handleRunAiReview} className="space-y-5">
            {/* Title & Difficulty */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-neutral-700 block mb-1">
                  Problem Title <span className="text-red-500">*</span>
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Longest Palindromic Substring"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1">
                  Difficulty
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as any)}
                  className="w-full text-sm border border-neutral-300 rounded-lg p-2.5 bg-white text-neutral-900 focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
            </div>

            {/* Category & Companies */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1">
                  Topic / Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full text-sm border border-neutral-300 rounded-lg p-2.5 bg-white text-neutral-900 focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
                >
                  <option value="Arrays & Hashing">Arrays & Hashing</option>
                  <option value="Two Pointers">Two Pointers</option>
                  <option value="Sliding Window">Sliding Window</option>
                  <option value="Stacks & Queues">Stacks & Queues</option>
                  <option value="Binary Search">Binary Search</option>
                  <option value="Linked Lists">Linked Lists</option>
                  <option value="Trees & Graphs">Trees & Graphs</option>
                  <option value="Dynamic Programming">Dynamic Programming</option>
                  <option value="Greedy & Heaps">Greedy & Heaps</option>
                  <option value="Backtracking">Backtracking</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1">
                  Target Companies (comma separated)
                </label>
                <Input
                  value={companiesStr}
                  onChange={(e) => setCompaniesStr(e.target.value)}
                  placeholder="e.g. Google, Amazon, Uber"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-xs font-semibold text-neutral-700 block mb-1">
                Problem Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Given an array of integers nums... explain the inputs, return requirements, and edge cases."
                className="w-full text-sm border border-neutral-300 rounded-lg p-3 bg-white text-neutral-900 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none leading-relaxed"
                required
              />
            </div>

            {/* Sample Test Cases */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1">
                  Sample Input
                </label>
                <input
                  value={sampleInput}
                  onChange={(e) => setSampleInput(e.target.value)}
                  placeholder='e.g. s = "babad"'
                  className="w-full text-xs font-mono border border-neutral-300 rounded-lg p-2.5 bg-neutral-50 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1">
                  Sample Output
                </label>
                <input
                  value={sampleOutput}
                  onChange={(e) => setSampleOutput(e.target.value)}
                  placeholder='e.g. "bab"'
                  className="w-full text-xs font-mono border border-neutral-300 rounded-lg p-2.5 bg-neutral-50 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            {/* Constraints */}
            <div>
              <label className="text-xs font-semibold text-neutral-700 block mb-1">
                Constraints
              </label>
              <input
                value={constraints}
                onChange={(e) => setConstraints(e.target.value)}
                placeholder="e.g. 1 <= s.length <= 1000, s consists of lowercase English letters"
                className="w-full text-xs font-mono border border-neutral-300 rounded-lg p-2.5 bg-neutral-50 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            {/* MULTI-LANGUAGE STARTER CODE SECTION */}
            <div className="border border-neutral-200 rounded-xl bg-neutral-50 overflow-hidden">
              <div className="p-3 bg-neutral-100/80 border-b border-neutral-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-brand-600" />
                  <span className="text-xs font-bold text-neutral-900">
                    Starter Code Templates (All 8 Supported Languages)
                  </span>
                </div>
                <span className="text-[11px] text-neutral-500">
                  Switch tabs to customize boilerplate for each language
                </span>
              </div>

              {/* Language Tabs Bar */}
              <div className="flex items-center gap-1 p-2 bg-neutral-100 overflow-x-auto border-b border-neutral-200 scrollbar-none">
                {ALL_LANGUAGES.map((lang) => (
                  <button
                    key={lang.key}
                    type="button"
                    onClick={() => setActiveLangTab(lang.key)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                      activeLangTab === lang.key
                        ? 'bg-neutral-900 text-white shadow-sm'
                        : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                    }`}
                  >
                    <span>{lang.label}</span>
                    {starterCodes[lang.key] && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    )}
                  </button>
                ))}
              </div>

              {/* Active Language Editor */}
              <div className="p-3 bg-[#0d1117] text-white">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-800 text-xs">
                  <span className="text-neutral-400 font-mono text-[11px]">
                    Editing {ALL_LANGUAGES.find((l) => l.key === activeLangTab)?.label} starter code
                  </span>
                  <button
                    type="button"
                    onClick={() => handleResetLangTemplate(activeLangTab)}
                    className="text-neutral-400 hover:text-white flex items-center gap-1 text-[11px] cursor-pointer transition-colors"
                  >
                    <RefreshCw className="w-3 h-3" /> Reset Template
                  </button>
                </div>

                <textarea
                  value={starterCodes[activeLangTab] || ''}
                  onChange={(e) => handleStarterCodeChange(activeLangTab, e.target.value)}
                  rows={7}
                  spellCheck={false}
                  className="w-full bg-[#0d1117] text-neutral-100 font-mono text-xs leading-relaxed outline-none resize-y selection:bg-brand-500/40"
                  placeholder={`// Enter starter code for ${activeLangTab}...`}
                />
              </div>
            </div>

            {/* Review Button */}
            <div className="pt-2 flex items-center justify-between">
              <span className="text-xs text-neutral-400">
                AI will inspect for duplicates, assess rigor, and verify all language templates.
              </span>
              <Button
                type="submit"
                loading={isReviewing}
                className="bg-brand-600 hover:bg-brand-700 text-white font-semibold shadow-sm flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                {isReviewing ? 'Analyzing with AI...' : 'Analyze & Review with AI'}
              </Button>
            </div>
          </form>

          {/* AI Review Results Card */}
          {reviewResult && (
            <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-5 space-y-4 animate-fade-in">
              {/* Verdict Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-neutral-200">
                <div className="flex items-center gap-2.5">
                  {reviewResult.decision === 'APPROVED' ? (
                    <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                  ) : reviewResult.decision === 'DUPLICATE' ? (
                    <div className="p-2 rounded-lg bg-rose-100 text-rose-700">
                      <XCircle className="w-5 h-5" />
                    </div>
                  ) : (
                    <div className="p-2 rounded-lg bg-amber-100 text-amber-700">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                  )}

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-neutral-900">AI Evaluation Verdict:</span>
                      <Badge
                        variant={
                          reviewResult.decision === 'APPROVED'
                            ? 'success'
                            : reviewResult.decision === 'DUPLICATE'
                            ? 'error'
                            : 'warning'
                        }
                      >
                        {reviewResult.decision === 'APPROVED'
                          ? 'Approved for Arena'
                          : reviewResult.decision === 'DUPLICATE'
                          ? 'Duplicate Question'
                          : 'Needs Refinement'}
                      </Badge>
                    </div>
                    <p className="text-xs text-neutral-600 mt-0.5">{reviewResult.summary}</p>
                  </div>
                </div>

                {/* Impact Gauge */}
                <div className="sm:text-right shrink-0">
                  <span className="text-xs text-neutral-500 font-medium">Impact Score</span>
                  <div className="flex items-baseline sm:justify-end gap-1">
                    <span
                      className={`text-2xl font-black ${
                        reviewResult.impactScore >= 75
                          ? 'text-emerald-600'
                          : reviewResult.impactScore >= 50
                          ? 'text-amber-600'
                          : 'text-rose-600'
                      }`}
                    >
                      {reviewResult.impactScore}
                    </span>
                    <span className="text-xs text-neutral-400">/ 100</span>
                  </div>
                </div>
              </div>

              {/* Duplicate & Originality Check */}
              <div className="p-3 rounded-lg bg-white border border-neutral-200 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck
                      className={`w-4 h-4 ${
                        reviewResult.similarityCheck.exists ? 'text-rose-500' : 'text-emerald-500'
                      }`}
                    />
                    <span className="font-semibold text-neutral-800">
                      {reviewResult.similarityCheck.isConceptualMatch
                        ? 'Conceptual & Algorithmic Duplicate Check:'
                        : 'Originality & Duplicate Check:'}
                    </span>
                    <span className="text-neutral-600">
                      {reviewResult.similarityCheck.exists
                        ? `High similarity with "${reviewResult.similarityCheck.similarTo}" (${reviewResult.similarityCheck.similarityScore}% match)`
                        : reviewResult.similarityCheck.similarTo
                        ? `Moderate likeness to "${reviewResult.similarityCheck.similarTo}" (${reviewResult.similarityCheck.similarityScore}% match)`
                        : 'No duplicate questions detected in Arena or LeetCode catalog'}
                    </span>
                  </div>
                  {reviewResult.similarityCheck.isConceptualMatch && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-100 text-amber-800 border border-amber-200">
                      Semantic Match
                    </span>
                  )}
                </div>
                {reviewResult.similarityCheck.explanation && (
                  <p className="text-[11px] text-neutral-500 pl-6 border-l-2 border-amber-400 font-sans">
                    {reviewResult.similarityCheck.explanation}
                  </p>
                )}
              </div>

              {/* Strengths & Recommendations */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {reviewResult.strengths.length > 0 && (
                  <div className="p-3 rounded-lg bg-emerald-50/60 border border-emerald-100">
                    <p className="font-bold text-emerald-900 mb-1.5 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Evaluation Highlights
                    </p>
                    <ul className="space-y-1 text-emerald-800">
                      {reviewResult.strengths.map((s, idx) => (
                        <li key={idx}>• {s}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {reviewResult.recommendations.length > 0 && (
                  <div className="p-3 rounded-lg bg-amber-50/60 border border-amber-100">
                    <p className="font-bold text-amber-900 mb-1.5 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Improvement Suggestions
                    </p>
                    <ul className="space-y-1 text-amber-800">
                      {reviewResult.recommendations.map((r, idx) => (
                        <li key={idx}>• {r}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Publish Action */}
              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs text-neutral-500">
                  Starter code for all 8 languages will be published with this challenge.
                </span>
                <Button
                  onClick={handlePublishToArena}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-sm flex items-center gap-1.5"
                >
                  Publish to Arena <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
