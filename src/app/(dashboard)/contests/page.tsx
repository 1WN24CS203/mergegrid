'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Trophy,
  Calendar,
  Clock,
  Users,
  Award,
  Sparkles,
  ArrowRight,
  Shield,
  CheckCircle2,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';

interface Contest {
  id: string;
  title: string;
  status: 'live' | 'upcoming' | 'ended';
  startTime: string;
  duration: string;
  registeredCount: number;
  prizePool: string;
  difficulty: 'Beginner' | 'Open' | 'Hardcore';
  description: string;
  registered?: boolean;
}

const contestsData: Contest[] = [
  {
    id: 'c-1',
    title: 'MergeGrid Inter-College Clash #14',
    status: 'live',
    startTime: 'Now Live',
    duration: '2h 00m remaining',
    registeredCount: 0,
    prizePool: '₹25,000 + Swag Kits',
    difficulty: 'Open',
    description: '4 algorithmic challenges testing graphs, dynamic programming, and greedy heuristics.',
  },
  {
    id: 'c-2',
    title: 'Weekend Fast Speedrun #28',
    status: 'upcoming',
    startTime: 'Saturday, 8:00 PM IST',
    duration: '90 Minutes',
    registeredCount: 0,
    prizePool: 'MergeGrid Elite Badges',
    difficulty: 'Beginner',
    description: 'Speed-based challenge tailored for core data structures and problem solving.',
  },
  {
    id: 'c-3',
    title: 'National Collegiate Grand Finals 2026',
    status: 'upcoming',
    startTime: 'Nov 15, 2026',
    duration: '3h 30m',
    registeredCount: 0,
    prizePool: '₹1,00,000 + Tech Interviews',
    difficulty: 'Hardcore',
    description: 'Flagship national competition between premier engineering institutions.',
  },
];

export default function ContestsPage() {
  const [contests, setContests] = useState(contestsData);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    try {
      const saved = localStorage.getItem('mergegrid_registered_contests');
      if (saved) {
        const registeredIds: string[] = JSON.parse(saved);
        setContests((prev) =>
          prev.map((c) => ({
            ...c,
            registered: registeredIds.includes(c.id),
          }))
        );
      }
    } catch {
      // Ignore
    }
  }, []);

  const handleRegister = (id: string, title: string) => {
    const updated = contests.map((c) => {
      if (c.id === id) {
        const isNowRegistered = !c.registered;
        return {
          ...c,
          registered: isNowRegistered,
          registeredCount: isNowRegistered ? c.registeredCount + 1 : c.registeredCount - 1,
        };
      }
      return c;
    });

    setContests(updated);

    try {
      const registeredIds = updated.filter((c) => c.registered).map((c) => c.id);
      localStorage.setItem('mergegrid_registered_contests', JSON.stringify(registeredIds));
    } catch {
      // Ignore
    }

    const targetContest = updated.find((c) => c.id === id);
    if (targetContest?.registered) {
      toast({
        type: 'success',
        title: 'Registration confirmed!',
        message: `You are registered for ${title}.`,
      });
    } else {
      toast({
        type: 'info',
        title: 'Registration cancelled',
        message: `You have unregistered from ${title}.`,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">
            Contests Arena
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Compete live, climb collegiate leaderboard rankings, and earn verified badges.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="success" className="animate-pulse">
            1 Contest Live Now
          </Badge>
        </div>
      </div>

      {/* Featured Live Banner */}
      <div className="rounded-2xl p-6 bg-gradient-to-r from-amber-500/10 via-brand-500/10 to-emerald-500/10 border border-amber-300/40 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-rose-500 animate-ping" />
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600">
                Live Contest Active
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900">
              MergeGrid Inter-College Clash #14
            </h2>
            <p className="text-sm text-neutral-600 mt-1 max-w-xl">
              Leaderboard updates in real time. 4 algorithmic challenges are open for code submissions in the arena.
            </p>
            <div className="flex items-center gap-4 mt-3 text-xs text-neutral-600 font-mono">
              <span className="flex items-center gap-1 font-semibold text-neutral-900">
                <Clock className="w-3.5 h-3.5 text-amber-600" /> 1h 48m left
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Trophy className="w-3.5 h-3.5 text-amber-600" /> ₹25,000 Pool
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/problems">
              <Button
                className="bg-brand-600 hover:bg-brand-700 text-white font-semibold shadow-md"
              >
                Enter Contest Arena <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Contest Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {contests.map((contest) => (
          <Card key={contest.id} className="p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                    contest.status === 'live'
                      ? 'bg-rose-100 text-rose-700'
                      : contest.status === 'upcoming'
                      ? 'bg-brand-100 text-brand-700'
                      : 'bg-neutral-100 text-neutral-600'
                  }`}
                >
                  {contest.status.toUpperCase()}
                </span>
                <span className="text-xs font-medium text-neutral-500">
                  {contest.difficulty}
                </span>
              </div>
              <h3 className="text-base font-bold text-neutral-900">
                {contest.title}
              </h3>
              <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed">
                {contest.description}
              </p>
              <div className="mt-4 pt-4 border-t border-neutral-100 grid grid-cols-2 gap-2 text-xs text-neutral-600">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                  <span>{contest.startTime}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-neutral-400" />
                  <span>{contest.duration}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-neutral-400" />
                  <span>{contest.registeredCount} Devs</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                  <span>{contest.prizePool}</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-neutral-100 flex items-center justify-between">
              <span className="text-xs text-neutral-400 font-mono">
                Official Contest
              </span>
              {contest.status === 'live' ? (
                <Link href="/problems">
                  <Button size="sm" className="bg-brand-600 hover:bg-brand-700 text-white">
                    Join Arena
                  </Button>
                </Link>
              ) : contest.status === 'upcoming' ? (
                <Button
                  size="sm"
                  variant={contest.registered ? 'outline' : 'primary'}
                  className={contest.registered ? 'text-emerald-700 border-emerald-300 bg-emerald-50' : ''}
                  onClick={() => handleRegister(contest.id, contest.title)}
                >
                  {contest.registered ? 'Registered ✓' : 'Register Free'}
                </Button>
              ) : (
                <Link href="/leaderboard">
                  <Button size="sm" variant="outline">
                    View Results
                  </Button>
                </Link>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
