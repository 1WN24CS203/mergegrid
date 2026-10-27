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
  const [solvedCount, setSolvedCount] = useState(0);
  const [contestsCount, setContestsCount] = useState(0);

  useEffect(() => {
    const hour = new Date().getHours();
    setGreeting(
      hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
    );

    try {
      const savedSolved = localStorage.getItem('mergegrid_solved_problems');
      if (savedSolved) {
        const parsed = JSON.parse(savedSolved);
        if (Array.isArray(parsed)) setSolvedCount(parsed.length);
      }
      const savedContests = localStorage.getItem('mergegrid_registered_contests');
      if (savedContests) {
        const parsed = JSON.parse(savedContests);
        if (Array.isArray(parsed)) setContestsCount(parsed.length);
      }
    } catch {
      // Ignore
    }
  }, []);

  const quickLinks = [
    { label: 'Problem Arena', href: '/problems', icon: Code2 },
    { label: 'Live Contests', href: '/contests', icon: Trophy },
    { label: 'Discussions', href: '/discussions', icon: MessageSquare },
    { label: 'Open Source Hub', href: '/opensource', icon: GitFork },
    { label: 'Student Projects', href: '/projects', icon: FolderKanban },
    { label: 'Placement Archives', href: '/placements', icon: GraduationCap },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Greeting section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900">
            {greeting}, {displayName} 👋
          </h1>
          <p className="text-sm text-neutral-500 mt-0.5">
            Your developer workspace is ready.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/settings">
            <Button variant="outline" size="sm" icon={<Target className="w-3.5 h-3.5" />}>
              Account Settings
            </Button>
          </Link>
          <Link href="/problems">
            <Button size="sm" icon={<Code2 className="w-3.5 h-3.5" />}>
              Solve Problems
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          icon={<Flame className="w-4 h-4 text-orange-500" />}
          label="Day Streak"
          value="1"
          sublabel="Daily active streak"
          color="orange"
        />
        <StatCard
          icon={<CheckCircle2 className="w-4 h-4 text-green-500" />}
          label="Solved"
          value={String(solvedCount)}
          sublabel="problems completed"
          color="green"
        />
        <StatCard
          icon={<Trophy className="w-4 h-4 text-brand-500" />}
          label="Contests"
          value={String(contestsCount)}
          sublabel="registered"
          color="blue"
        />
        <StatCard
          icon={<TrendingUp className="w-4 h-4 text-purple-500" />}
          label="Reputation"
          value={String(100 + solvedCount * 50)}
          sublabel="developer points"
          color="purple"
        />
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left column - 2/3 */}
        <div className="lg:col-span-2 space-y-4">
          {/* Quick Problem Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500" />
                  Recommended Starter Problems
                </div>
              </CardTitle>
              <Link
                href="/problems"
                className="text-xs text-brand-600 hover:text-brand-700 flex items-center gap-1 transition-colors"
              >
                View all in Arena <ArrowRight className="w-3 h-3" />
              </Link>
            </CardHeader>
            <div className="space-y-1">
              {[
                { title: 'Two Sum & Hash Map Lookups', difficulty: 'Easy', category: 'Arrays & Hashing' },
                { title: 'Valid Parentheses & Stack Evaluation', difficulty: 'Easy', category: 'Stacks' },
                { title: 'Coin Change (Min Coins & DP)', difficulty: 'Medium', category: 'Dynamic Programming' },
              ].map((problem, i) => (
                <Link
                  key={i}
                  href="/problems"
                  className="flex items-center justify-between p-2.5 rounded-lg hover:bg-neutral-50 transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                        problem.difficulty === 'Easy' ? 'bg-green-500' : 'bg-amber-500'
                      }`}
                    />
                    <div>
                      <span className="text-sm font-medium text-neutral-800 group-hover:text-brand-600 truncate transition-colors">
                        {problem.title}
                      </span>
                      <span className="text-xs text-neutral-400 block">{problem.category}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    <Badge variant={problem.difficulty === 'Easy' ? 'success' : 'warning'}>
                      {problem.difficulty}
                    </Badge>
                    <ArrowRight className="w-3.5 h-3.5 text-neutral-300 group-hover:text-neutral-500 transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          </Card>

          {/* Clean Discussions Preview */}
          <Card>
            <CardHeader>
              <CardTitle>
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-brand-600" />
                  Technical Discussions
                </div>
              </CardTitle>
              <Link
                href="/discussions"
                className="text-xs text-brand-600 hover:text-brand-700 flex items-center gap-1 transition-colors"
              >
                Go to Forum <ArrowRight className="w-3 h-3" />
              </Link>
            </CardHeader>
            <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-100 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-neutral-900">
                  Join collegiate developer discussions
                </p>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Share interview debriefs, ask architecture questions, or discuss algorithm solutions.
                </p>
              </div>
              <Link href="/discussions">
                <Button size="sm" variant="outline">
                  Browse Forum
                </Button>
              </Link>
            </div>
          </Card>
        </div>

        {/* Right column - 1/3 */}
        <div className="space-y-4">
          {/* Quick links */}
          <Card>
            <CardHeader>
              <CardTitle>Platform Navigation</CardTitle>
            </CardHeader>
            <div className="space-y-1">
              {quickLinks.map((link, i) => (
                <Link
                  key={i}
                  href={link.href}
                  className="flex items-center gap-2.5 p-2.5 rounded-lg text-sm text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition-colors"
                >
                  <link.icon className="w-4 h-4 text-neutral-400" />
                  {link.label}
                </Link>
              ))}
            </div>
          </Card>

          {/* Upcoming Contests */}
          <Card>
            <CardHeader>
              <CardTitle>
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-500" />
                  Contests Arena
                </div>
              </CardTitle>
            </CardHeader>
            <div className="p-3 bg-gradient-to-br from-amber-50/60 to-white rounded-xl border border-amber-200/60">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                <span className="text-xs font-bold text-rose-600 uppercase">Clash Scheduled</span>
              </div>
              <h4 className="text-sm font-bold text-neutral-900">Inter-College Clash #14</h4>
              <p className="text-xs text-neutral-500 mt-1">
                Compete with engineering peers in 4 algorithmic challenges.
              </p>
              <div className="mt-3">
                <Link href="/contests">
                  <Button size="sm" className="w-full bg-brand-600 hover:bg-brand-700 text-white font-medium">
                    View Contest Details
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  sublabel,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sublabel: string;
  color: string;
}) {
  return (
    <Card className="p-3.5">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-neutral-500">{label}</span>
        {icon}
      </div>
      <div className="text-2xl font-bold text-neutral-900">{value}</div>
      <p className="text-xs text-neutral-400 mt-0.5">{sublabel}</p>
    </Card>
  );
}
