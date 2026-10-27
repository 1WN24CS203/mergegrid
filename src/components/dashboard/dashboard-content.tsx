'use client';

import React, { useState, useEffect } from 'react';
import {
  Flame,
  Target,
  Code2,
  Trophy,
  MessageSquare,
  GitFork,
  FolderKanban,
  GraduationCap,
  TrendingUp,
  Clock,
  CheckCircle2,
  ArrowRight,
  Zap,
  BookOpen,
  Users,
  Calendar,
} from 'lucide-react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface DashboardContentProps {
  displayName: string;
}

export function DashboardContent({ displayName }: DashboardContentProps) {
  const [greeting, setGreeting] = useState('Welcome back');

  useEffect(() => {
    const hour = new Date().getHours();
    setGreeting(
      hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
    );
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Greeting section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900">
            {greeting}, {displayName} 👋
          </h1>
          <p className="text-sm text-neutral-500 mt-0.5">
            Here&apos;s what&apos;s happening in your workspace
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" icon={<Target className="w-3.5 h-3.5" />}>
            <Link href="/settings">Set Goals</Link>
          </Button>
          <Button size="sm" icon={<Code2 className="w-3.5 h-3.5" />}>
            <Link href="/problems">Solve Problems</Link>
          </Button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          icon={<Flame className="w-4 h-4 text-orange-500" />}
          label="Day Streak"
          value="0"
          sublabel="Start solving today!"
          color="orange"
        />
        <StatCard
          icon={<CheckCircle2 className="w-4 h-4 text-green-500" />}
          label="Solved"
          value="0"
          sublabel="problems completed"
          color="green"
        />
        <StatCard
          icon={<Trophy className="w-4 h-4 text-brand-500" />}
          label="Contests"
          value="0"
          sublabel="participated"
          color="blue"
        />
        <StatCard
          icon={<TrendingUp className="w-4 h-4 text-purple-500" />}
          label="Reputation"
          value="0"
          sublabel="points earned"
          color="purple"
        />
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left column - 2/3 */}
        <div className="lg:col-span-2 space-y-4">
          {/* Weekly goals */}
          <Card>
            <CardHeader>
              <CardTitle>
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-brand-600" />
                  Weekly Goals
                </div>
              </CardTitle>
              <Link
                href="/settings"
                className="text-xs text-brand-600 hover:text-brand-700 flex items-center gap-1 transition-colors"
              >
                Manage <ArrowRight className="w-3 h-3" />
              </Link>
            </CardHeader>
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center mb-3">
                <Target className="w-5 h-5 text-neutral-400" />
              </div>
              <p className="text-sm text-neutral-500">No goals set for this week</p>
              <p className="text-xs text-neutral-400 mt-1">
                Set your first weekly goal to track progress
              </p>
              <Button variant="outline" size="sm" className="mt-4">
                <Link href="/settings">Create a goal</Link>
              </Button>
            </div>
          </Card>

          {/* Recommended problems */}
          <Card>
            <CardHeader>
              <CardTitle>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500" />
                  Recommended Problems
                </div>
              </CardTitle>
              <Link
                href="/problems"
                className="text-xs text-brand-600 hover:text-brand-700 flex items-center gap-1 transition-colors"
              >
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </CardHeader>
            <div className="space-y-1">
              {sampleProblems.map((problem, i) => (
                <Link
                  key={i}
                  href={`/problems/${problem.slug}`}
                  className="flex items-center justify-between p-2.5 rounded-lg hover:bg-neutral-50 transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                      problem.difficulty === 'easy'
                        ? 'bg-green-500'
                        : problem.difficulty === 'medium'
                        ? 'bg-amber-500'
                        : 'bg-red-500'
                    }`} />
                    <span className="text-sm text-neutral-700 group-hover:text-neutral-900 truncate transition-colors">
                      {problem.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    <Badge
                      variant={
                        problem.difficulty === 'easy'
                          ? 'success'
                          : problem.difficulty === 'medium'
                          ? 'warning'
                          : 'error'
                      }
                    >
                      {problem.difficulty}
                    </Badge>
                    <ArrowRight className="w-3.5 h-3.5 text-neutral-300 group-hover:text-neutral-500 transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          </Card>

          {/* Recent discussions */}
          <Card>
            <CardHeader>
              <CardTitle>
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-brand-600" />
                  Recent Discussions
                </div>
              </CardTitle>
              <Link
                href="/discussions"
                className="text-xs text-brand-600 hover:text-brand-700 flex items-center gap-1 transition-colors"
              >
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </CardHeader>
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center mb-3">
                <MessageSquare className="w-5 h-5 text-neutral-400" />
              </div>
              <p className="text-sm text-neutral-500">No discussions yet</p>
              <p className="text-xs text-neutral-400 mt-1">
                Start a conversation with the community
              </p>
              <Button variant="outline" size="sm" className="mt-4">
                <Link href="/discussions">Ask a question</Link>
              </Button>
            </div>
          </Card>
        </div>

        {/* Right column - 1/3 */}
        <div className="space-y-4">
          {/* Upcoming contests */}
          <Card>
            <CardHeader>
              <CardTitle>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-brand-600" />
                  Upcoming Contests
                </div>
              </CardTitle>
            </CardHeader>
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center mb-3">
                <Trophy className="w-5 h-5 text-neutral-400" />
              </div>
              <p className="text-sm text-neutral-500">No upcoming contests</p>
              <Link
                href="/contests"
                className="text-xs text-brand-600 hover:text-brand-700 mt-2 transition-colors"
              >
                Browse contests →
              </Link>
            </div>
          </Card>

          {/* Quick links */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Links</CardTitle>
            </CardHeader>
            <div className="space-y-1">
              {quickLinks.map((link, i) => (
                <Link
                  key={i}
                  href={link.href}
                  className="flex items-center gap-2.5 p-2 rounded-lg text-sm text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition-colors"
                >
                  <link.icon className="w-4 h-4 text-neutral-400" />
                  {link.label}
                </Link>
              ))}
            </div>
          </Card>

          {/* Open source */}
          <Card>
            <CardHeader>
              <CardTitle>
                <div className="flex items-center gap-2">
                  <GitFork className="w-4 h-4 text-brand-600" />
                  Open Source
                </div>
              </CardTitle>
            </CardHeader>
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center mb-3">
                <GitFork className="w-5 h-5 text-neutral-400" />
              </div>
              <p className="text-sm text-neutral-500">Discover projects</p>
              <p className="text-xs text-neutral-400 mt-1">
                Find open-source issues to contribute to
              </p>
              <Link
                href="/opensource"
                className="text-xs text-brand-600 hover:text-brand-700 mt-2 transition-colors"
              >
                Explore →
              </Link>
            </div>
          </Card>

          {/* Career prep */}
          <Card>
            <CardHeader>
              <CardTitle>
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-brand-600" />
                  Placements
                </div>
              </CardTitle>
            </CardHeader>
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center mb-3">
                <GraduationCap className="w-5 h-5 text-neutral-400" />
              </div>
              <p className="text-sm text-neutral-500">Prepare for placements</p>
              <Link
                href="/placements"
                className="text-xs text-brand-600 hover:text-brand-700 mt-2 transition-colors"
              >
                Get started →
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ---- Helper Components ---- */

function StatCard({
  icon,
  label,
  value,
  sublabel,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sublabel: string;
  color: string;
}) {
  return (
    <Card padding="sm">
      <div className="flex items-center gap-2.5 mb-2">
        <div className="w-7 h-7 rounded-lg bg-neutral-50 flex items-center justify-center">
          {icon}
        </div>
        <span className="text-xs text-neutral-500 font-medium">{label}</span>
      </div>
      <div className="text-xl font-bold text-neutral-900">{value}</div>
      <div className="text-[11px] text-neutral-400 mt-0.5">{sublabel}</div>
    </Card>
  );
}

/* ---- Demo Data ---- */

const sampleProblems = [
  { title: 'Two Sum', slug: 'two-sum', difficulty: 'easy' as const },
  { title: 'Valid Parentheses', slug: 'valid-parentheses', difficulty: 'easy' as const },
  { title: 'Longest Substring Without Repeating Characters', slug: 'longest-substring', difficulty: 'medium' as const },
  { title: 'Container With Most Water', slug: 'container-with-most-water', difficulty: 'medium' as const },
  { title: 'Merge K Sorted Lists', slug: 'merge-k-sorted-lists', difficulty: 'hard' as const },
];

const quickLinks = [
  { label: 'Solve a Problem', href: '/problems', icon: Code2 },
  { label: 'Join a Contest', href: '/contests', icon: Trophy },
  { label: 'Ask a Question', href: '/discussions', icon: MessageSquare },
  { label: 'Find Projects', href: '/projects', icon: FolderKanban },
  { label: 'Contribute to OSS', href: '/opensource', icon: GitFork },
  { label: 'View Leaderboard', href: '/leaderboard', icon: Users },
  { label: 'Study Resources', href: '/placements', icon: BookOpen },
];
