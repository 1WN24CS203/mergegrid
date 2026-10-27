'use client';

import React from 'react';
import Link from 'next/link';
import {
  Trophy,
  Calendar,
  Clock,
  Sparkles,
  ArrowRight,
  Bell,
  Code2,
  Inbox,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function ContestsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">
            Contests Arena
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Real-time competitive coding clashes, collegiate hackathons, and speedrun challenges.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-neutral-500 border-neutral-300">
            0 Contests Live
          </Badge>
        </div>
      </div>

      {/* Clean Fresh State - No Predefined Contests */}
      <Card className="p-12 sm:p-16 text-center border-dashed border-2 border-neutral-200 bg-white">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-200/60 shadow-sm">
          <Trophy className="w-8 h-8" />
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-neutral-900 tracking-tight">
          No Contests Active or Scheduled
        </h2>
        <p className="text-sm text-neutral-500 max-w-md mx-auto mt-2 leading-relaxed">
          There are currently no active or upcoming contests. The Season 1 collegiate clash calendar is being finalized.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link href="/problems">
            <Button
              className="bg-brand-600 hover:bg-brand-700 text-white font-semibold shadow-sm"
              icon={<Code2 className="w-4 h-4" />}
            >
              Practice in Problem Arena
            </Button>
          </Link>
          <Link href="/settings">
            <Button
              variant="outline"
              icon={<Bell className="w-4 h-4 text-brand-600" />}
            >
              Configure Contest Alerts
            </Button>
          </Link>
        </div>
      </Card>

      {/* Informational Guidance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <Card className="p-4 bg-gradient-to-br from-neutral-50 to-white">
          <div className="flex items-center gap-2.5 mb-1.5 text-neutral-900 font-semibold text-sm">
            <Clock className="w-4 h-4 text-brand-600" /> Bi-Weekly Clashes
          </div>
          <p className="text-xs text-neutral-500 leading-relaxed">
            Standard 90-minute algorithmic clashes featuring 4 rated challenges with live ranking updates.
          </p>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-neutral-50 to-white">
          <div className="flex items-center gap-2.5 mb-1.5 text-neutral-900 font-semibold text-sm">
            <Sparkles className="w-4 h-4 text-amber-500" /> College Guild Clashes
          </div>
          <p className="text-xs text-neutral-500 leading-relaxed">
            Team up with students from your campus to accumulate collegiate leaderboard points.
          </p>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-neutral-50 to-white">
          <div className="flex items-center gap-2.5 mb-1.5 text-neutral-900 font-semibold text-sm">
            <Trophy className="w-4 h-4 text-emerald-600" /> Verified Badges
          </div>
          <p className="text-xs text-neutral-500 leading-relaxed">
            Earn verifiable badges and national rating percentiles directly integrated with your developer profile.
          </p>
        </Card>
      </div>
    </div>
  );
}
