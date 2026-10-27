'use client';

import React, { useState, useEffect } from 'react';
import {
  User,
  Globe,
  Award,
  Flame,
  Code2,
  GitFork,
  Calendar,
  Building2,
  ExternalLink,
  Edit,
} from 'lucide-react';
import { Github } from '@/components/ui/icons';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    displayName: 'Alex Rivera',
    username: 'alex_dev',
    avatarUrl: null as string | null,
    college: 'BMS College of Engineering (BMSCE)',
    bio: 'Pre-final year Computer Science student. Building distributed systems, open-source dev tooling, and competing in algorithmic clashes. Working with Next.js, Go, and PostgreSQL.',
    skills: ['TypeScript', 'Next.js', 'Go', 'Docker', 'PostgreSQL', 'TailwindCSS'],
    githubUrl: 'https://github.com',
  });

  useEffect(() => {
    async function loadUser() {
      // Check cookies for demo mode first
      const cookies = document.cookie;
      if (cookies.includes('mergegrid_demo_session=github')) {
        setProfile((prev) => ({
          ...prev,
          displayName: '1WN24CS203',
          username: '1WN24CS203',
          avatarUrl: 'https://github.com/1WN24CS203.png',
          githubUrl: 'https://github.com/1WN24CS203',
          bio: 'BMSCE Developer Guild member building open-source platforms and systems on MergeGrid.',
        }));
      }

      // Check live Supabase
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          const { data: dbProfile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          const name =
            dbProfile?.display_name ||
            user.user_metadata?.full_name ||
            user.user_metadata?.name ||
            user.user_metadata?.display_name ||
            user.user_metadata?.user_name ||
            user.email?.split('@')[0] ||
            'Developer';

          const uname =
            dbProfile?.username ||
            user.user_metadata?.user_name ||
            user.user_metadata?.preferred_username ||
            user.email?.split('@')[0] ||
            'developer';

          const avatar =
            dbProfile?.avatar_url ||
            user.user_metadata?.avatar_url ||
            user.user_metadata?.picture ||
            (uname ? `https://github.com/${uname}.png` : null);

          setProfile({
            displayName: name,
            username: uname,
            avatarUrl: avatar,
            college: dbProfile?.college || 'BMS College of Engineering (BMSCE)',
            bio: dbProfile?.bio || (user.user_metadata?.user_name ? `GitHub developer @${uname} building on MergeGrid.` : 'Developer and student engineer on MergeGrid.'),
            skills: dbProfile?.skills?.length ? dbProfile.skills : ['TypeScript', 'Next.js', 'Go', 'Docker', 'PostgreSQL', 'TailwindCSS'],
            githubUrl: uname ? `https://github.com/${uname}` : 'https://github.com',
          });
        }
      } catch {
        // Fallback
      }
    }

    loadUser();
  }, []);

  const initials = profile.displayName
    ? profile.displayName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'MG';

  return (
    <div className="space-y-6">
      {/* Profile Header Banner */}
      <Card className="p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-brand-500/10 to-transparent rounded-bl-full pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={profile.displayName}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-brand-500 shadow-lg shadow-brand-500/20"
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-brand-600 to-emerald-500 text-white font-bold text-2xl flex items-center justify-center shadow-lg shadow-brand-500/20">
                {initials}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-neutral-900">
                  {profile.displayName}
                </h1>
                <Badge variant="brand">Full Stack Dev</Badge>
              </div>
              <p className="text-sm text-neutral-500 font-mono mt-0.5">
                @{profile.username}
              </p>
              <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-neutral-600">
                <span className="flex items-center gap-1.5 font-medium text-neutral-700">
                  <Building2 className="w-3.5 h-3.5 text-neutral-400" />
                  {profile.college}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                  Active Developer
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/settings">
              <Button size="sm" variant="outline" icon={<Edit className="w-3.5 h-3.5" />}>
                Edit Profile
              </Button>
            </Link>
          </div>
        </div>

        {/* Bio */}
        <p className="text-sm text-neutral-600 mt-5 leading-relaxed max-w-3xl">
          {profile.bio}
        </p>

        {/* Links & Skills */}
        <div className="mt-5 pt-4 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-1.5">
            {profile.skills.map((skill) => (
              <span
                key={skill}
                className="text-xs px-2.5 py-1 rounded-md bg-neutral-100 text-neutral-700 font-medium"
              >
                {skill}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-3 text-xs">
            <a
              href={profile.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-neutral-600 hover:text-neutral-900 font-medium"
            >
              <Github className="w-3.5 h-3.5" /> GitHub Profile
            </a>
            <span className="text-neutral-300">•</span>
            <a
              href="https://example.com"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-neutral-600 hover:text-neutral-900 font-medium"
            >
              <Globe className="w-3.5 h-3.5" /> Portfolio
            </a>
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-xs font-medium text-neutral-500">Solved Problems</p>
          <p className="text-2xl font-bold text-neutral-900 mt-1">184</p>
          <p className="text-xs text-brand-600 mt-1 font-semibold">Top 5% of BMSCE</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-medium text-neutral-500">Reputation Points</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">2,850</p>
          <p className="text-xs text-neutral-400 mt-1">Rank #4 Campus-wide</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-medium text-neutral-500">Daily Streak</p>
          <p className="text-2xl font-bold text-rose-600 mt-1">🔥 14 Days</p>
          <p className="text-xs text-neutral-400 mt-1">Best: 24 Days</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-medium text-neutral-500">OSS Merged PRs</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">9 PRs</p>
          <p className="text-xs text-neutral-400 mt-1">Across 4 Repos</p>
        </Card>
      </div>

      {/* Badges / Achievements */}
      <Card className="p-6">
        <h2 className="text-base font-bold text-neutral-900 mb-4">
          Earned Badges & Guild Honors
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/80 text-center">
            <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-2">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-bold text-neutral-900">DP Virtuoso</h3>
            <p className="text-[10px] text-neutral-500 mt-1">Solved 50+ Dynamic Programming challenges</p>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/80 text-center">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-2">
              <GitFork className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-bold text-neutral-900">Campus Maintainer</h3>
            <p className="text-[10px] text-neutral-500 mt-1">Merged 5+ PRs in collegiate open source</p>
          </div>

          <div className="p-4 rounded-xl bg-purple-50/60 border border-purple-200/80 text-center">
            <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center mx-auto mb-2">
              <Flame className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-bold text-neutral-900">Consistent Grinder</h3>
            <p className="text-[10px] text-neutral-500 mt-1">Maintained a 14-day daily solve streak</p>
          </div>

          <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200/80 text-center">
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mx-auto mb-2">
              <Code2 className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-bold text-neutral-900">Contest Finalist</h3>
            <p className="text-[10px] text-neutral-500 mt-1">Placed Top 10 in Clash #12</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
