'use client';

import React, { useState } from 'react';
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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast';

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
  starterCode: {
    typescript: string;
    python: string;
    cpp: string;
    java: string;
  };
}

interface ProposeProblemModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingTitles: string[];
  onProblemApproved: (problem: ProposedProblemData) => void;
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

  const [isReviewing, setIsReviewing] = useState(false);
  const [reviewResult, setReviewResult] = useState<{
    decision: 'APPROVED' | 'NEEDS_REVISION' | 'DUPLICATE';
    impactScore: number;
    summary: string;
    similarityCheck: {
      exists: boolean;
      similarTo: string | null;
      similarityScore: number;
    };
    strengths: string[];
    recommendations: string[];
    starterCode: {
      typescript: string;
      python: string;
      cpp: string;
      java: string;
    };
  } | null>(null);

  const { toast } = useToast();

  if (!isOpen) return null;

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
          title: 'Review Complete: Revisions Needed',
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
    if (!reviewResult) return;

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
      starterCode: reviewResult.starterCode,
    };

    onProblemApproved(newProblem);
    toast({
      type: 'success',
      title: 'Problem Published to Arena! 🚀',
      message: `"${newProblem.title}" is now available in your practice arena.`,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full border border-neutral-200 overflow-hidden flex flex-col max-h-[92vh] animate-scale-in">
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
                  AI Evaluated
                </span>
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Submit an algorithmic challenge. AI automatically evaluates originality, edge case coverage, and interview impact.
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
          <form onSubmit={handleRunAiReview} className="space-y-4">
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
                  className="w-full text-sm border border-neutral-300 rounded-lg p-2.5 bg-white text-neutral-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1">
                  Topic / Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full text-sm border border-neutral-300 rounded-lg p-2.5 bg-white text-neutral-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
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

            <div>
              <label className="text-xs font-semibold text-neutral-700 block mb-1">
                Problem Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Given an array of integers nums... explain the inputs, what needs to be returned, and boundary conditions."
                className="w-full text-sm border border-neutral-300 rounded-lg p-3 bg-white text-neutral-900 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none leading-relaxed"
                required
              />
            </div>

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

            <div>
              <label className="text-xs font-semibold text-neutral-700 block mb-1">
                Constraints
              </label>
              <input
                value={constraints}
                onChange={(e) => setConstraints(e.target.value)}
                placeholder="e.g. 1 <= s.length <= 1000, s consists of lowercase letters"
                className="w-full text-xs font-mono border border-neutral-300 rounded-lg p-2.5 bg-neutral-50 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-xs text-neutral-400">
                AI will inspect for duplicates, assess rigor, and generate starter code.
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
              <div className="p-3 rounded-lg bg-white border border-neutral-200 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck
                    className={`w-4 h-4 ${
                      reviewResult.similarityCheck.exists ? 'text-rose-500' : 'text-emerald-500'
                    }`}
                  />
                  <span className="font-semibold text-neutral-800">Originality &amp; Duplicate Check:</span>
                  <span className="text-neutral-600">
                    {reviewResult.similarityCheck.exists
                      ? `High similarity with "${reviewResult.similarityCheck.similarTo}" (${reviewResult.similarityCheck.similarityScore}% match)`
                      : reviewResult.similarityCheck.similarTo
                      ? `Moderate likeness to "${reviewResult.similarityCheck.similarTo}" (${reviewResult.similarityCheck.similarityScore}% match)`
                      : 'No duplicate questions detected in Arena or LeetCode catalog'}
                  </span>
                </div>
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

              {/* Action */}
              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs text-neutral-500">
                  Starter code for TypeScript, Python, C++, and Java will be auto-attached.
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
