'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Trophy,
  Flame,
  Medal,
  Award,
  Search,
  Building2,
  Users,
  Star,
  TrendingUp,
  Sparkles,
  Shield,
  ArrowRight,
  Code2,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { createClient } from '@/lib/supabase/client';

interface CollegeRank {
  rank: number;
  college: string;
  points: number;
  activeStudents: number;
  problemsSolved: number;
  weeklyGrowth: string;
}

interface UserRank {
  rank: number;
  name: string;
  username: string;
  college: string;
  reputation: number;
  streak: number;
  problems: number;
  isCurrentUser?: boolean;
}

interface GroupRank {
  rank: number;
  id: string;
  name: string;
  slug: string;
  type: 'friends' | 'official';
  leaderName: string;
  membersCount: number;
  problemsSolved: number;
  reputation: number;
}

export default function LeaderboardPage() {
  const [tab, setTab] = useState<'individuals' | 'groups' | 'colleges'>('individuals');
  const [currentUsername, setCurrentUsername] = useState('developer');
  const [currentDisplayName, setCurrentDisplayName] = useState('Developer');
  const [currentCollege, setCurrentCollege] = useState('Engineering Guild');
  const [solvedCount, setSolvedCount] = useState(0);

  const [usersData, setUsersData] = useState<UserRank[]>([]);
  const [groupsData, setGroupsData] = useState<GroupRank[]>([]);
  const [collegesData, setCollegesData] = useState<CollegeRank[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Load local solved & profile fallback
    try {
      const savedSolved = localStorage.getItem('mergegrid_solved_problems');
      if (savedSolved) {
        const parsed = JSON.parse(savedSolved);
        if (Array.isArray(parsed)) setSolvedCount(parsed.length);
      }
      const savedProfile = localStorage.getItem('mergegrid_user_profile');
      if (savedProfile) {
        const p = JSON.parse(savedProfile);
        if (p.displayName) setCurrentDisplayName(p.displayName);
        if (p.username) setCurrentUsername(p.username);
        if (p.college) setCurrentCollege(p.college);
      }

      // Load local groups
      const savedGroups = localStorage.getItem('mergegrid_groups');
      if (savedGroups) {
        const parsedG = JSON.parse(savedGroups);
        if (Array.isArray(parsedG) && parsedG.length > 0) {
          const mappedGroups: GroupRank[] = parsedG.map((g: any, idx: number) => {
            const memberCount = Array.isArray(g.members) ? g.members.length : 1;
            const solved = Array.isArray(g.members)
              ? g.members.reduce((acc: number, m: any) => acc + (m.solvedCount || 0), 0)
              : 0;
            return {
              rank: idx + 1,
              id: g.id || `grp-${idx}`,
              name: g.name || 'Practice Group',
              slug: g.slug || '',
              type: g.type || 'friends',
              leaderName: g.leaderName || 'Leader',
              membersCount: memberCount,
              problemsSolved: solved,
              reputation: solved * 50 + memberCount * 25,
            };
          });
          setGroupsData(mappedGroups.sort((a, b) => b.reputation - a.reputation).map((g, i) => ({ ...g, rank: i + 1 })));
        }
      }
    } catch {
      // Ignore
    }

    // 2. Fetch live data from Supabase
    async function fetchLiveLeaderboard() {
      setLoading(true);
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        let currentUname = 'developer';
        if (user) {
          currentUname =
            user.user_metadata?.user_name ||
            user.user_metadata?.preferred_username ||
            user.email?.split('@')[0] ||
            'developer';
          setCurrentUsername(currentUname);
          setCurrentDisplayName(
            user.user_metadata?.full_name ||
            user.user_metadata?.name ||
            user.user_metadata?.display_name ||
            currentUname
          );
        }

        // Fetch users
        const { data: profiles, error } = await supabase
          .from('profiles')
          .select('*')
          .order('problems_solved', { ascending: false })
          .order('reputation_points', { ascending: false });

        if (!error && profiles && profiles.length > 0) {
          const mappedUsers: UserRank[] = profiles.map((p, index) => ({
            rank: index + 1,
            name: p.display_name || p.username || 'Developer',
            username: p.username || 'developer',
            college: p.college || 'Engineering Guild',
            reputation: p.reputation_points || 120,
            streak: p.streak_days || 1,
            problems: p.problems_solved || 0,
            isCurrentUser: user?.id === p.id || currentUname === p.username,
          }));

          setUsersData(mappedUsers);

          // Aggregate colleges dynamically from registered accounts
          const collegeMap = new Map<
            string,
            { points: number; students: number; problems: number }
          >();

          for (const p of profiles) {
            const col = p.college || 'Engineering Guild';
            const existing = collegeMap.get(col) || {
              points: 0,
              students: 0,
              problems: 0,
            };
            existing.points += p.reputation_points || 120;
            existing.students += 1;
            existing.problems += p.problems_solved || 0;
            collegeMap.set(col, existing);
          }

          const dynamicColleges: CollegeRank[] = Array.from(collegeMap.entries())
            .map(([college, stats], idx) => ({
              rank: idx + 1,
              college,
              points: stats.points,
              activeStudents: stats.students,
              problemsSolved: stats.problems,
              weeklyGrowth: stats.problems > 0 ? `+${stats.problems * 10}%` : '+5%',
            }))
            .sort((a, b) => b.points - a.points)
            .map((c, i) => ({ ...c, rank: i + 1 }));

          setCollegesData(dynamicColleges);
        } else {
          // Default initial registered user entry for self
          const fallbackUsers: UserRank[] = [
            {
              rank: 1,
              name: currentDisplayName || 'Developer',
              username: currentUsername || 'developer',
              college: currentCollege || 'Engineering Guild',
              reputation: 100 + solvedCount * 50,
              streak: 1,
              problems: solvedCount,
              isCurrentUser: true,
            },
          ];
          setUsersData(fallbackUsers);

          setCollegesData([
            {
              rank: 1,
              college: currentCollege || 'Engineering Guild',
              points: 100 + solvedCount * 50,
              activeStudents: 1,
              problemsSolved: solvedCount,
              weeklyGrowth: '+10%',
            },
          ]);
        }

        // Fetch live groups from Supabase
        const { data: dbGroups } = await supabase
          .from('groups')
          .select('*')
          .order('created_at', { ascending: false });

        if (dbGroups && dbGroups.length > 0) {
          const mappedGroups: GroupRank[] = dbGroups.map((g: any, idx: number) => ({
            rank: idx + 1,
            id: g.id,
            name: g.name,
            slug: g.slug || '',
            type: g.group_type || 'friends',
            leaderName: g.leader_id === user?.id ? currentDisplayName : 'Group Leader',
            membersCount: 1,
            problemsSolved: 0,
            reputation: 100,
          }));
          setGroupsData(mappedGroups);
        }
      } catch {
        // Fallback
      } finally {
        setLoading(false);
      }
    }

    fetchLiveLeaderboard();
  }, [solvedCount, currentDisplayName, currentUsername, currentCollege]);

  // Safe podium items
  const user1 = usersData[0] || {
    name: currentDisplayName || 'Developer',
    username: currentUsername || 'developer',
    college: currentCollege || 'Arena',
    reputation: 120,
    problems: 0,
  };
  const user2 = usersData[1] || {
    name: 'Open Podium Slot',
    username: 'ready_to_climb',
    college: 'Your College Guild',
    reputation: 100,
    problems: 0,
  };
  const user3 = usersData[2] || {
    name: 'Open Podium Slot',
    username: 'ready_to_climb',
    college: 'Your College Guild',
    reputation: 90,
    problems: 0,
  };

  const group1 = groupsData[0] || {
    name: 'First Circle',
    type: 'friends' as const,
    leaderName: currentDisplayName,
    membersCount: 1,
    reputation: 100,
    problemsSolved: 0,
  };
  const group2 = groupsData[1] || {
    name: 'Open Circle Slot',
    type: 'official' as const,
    leaderName: 'Campus Leader',
    membersCount: 0,
    reputation: 80,
    problemsSolved: 0,
  };
  const group3 = groupsData[2] || {
    name: 'Open Circle Slot',
    type: 'friends' as const,
    leaderName: 'Friendly Host',
    membersCount: 0,
    reputation: 60,
    problemsSolved: 0,
  };

  const col1 = collegesData[0] || {
    college: currentCollege || 'Engineering Guild',
    points: 120,
    weeklyGrowth: '+5%',
  };
  const col2 = collegesData[1] || {
    college: 'Collegiate Arena',
    points: 100,
    weeklyGrowth: '+0%',
  };
  const col3 = collegesData[2] || {
    college: 'Collegiate Arena',
    points: 100,
    weeklyGrowth: '+0%',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-[#eff1f6] tracking-tight">
            Developer Leaderboard
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Live rankings of coders, practice circles, and collegiate guilds. Solve arena problems to climb!
          </p>
        </div>

        {/* Triple Tab Selector */}
        <div className="flex items-center gap-1 bg-neutral-100 dark:bg-[#202020] p-1 rounded-xl border border-neutral-200 dark:border-[#383838]">
          <button
            onClick={() => setTab('individuals')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              tab === 'individuals'
                ? 'bg-white dark:bg-[#333333] text-neutral-900 dark:text-[#eff1f6] shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-[#eff1f6]'
            }`}
          >
            Registered Developers ({usersData.length})
          </button>
          <button
            onClick={() => setTab('groups')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              tab === 'groups'
                ? 'bg-white dark:bg-[#333333] text-neutral-900 dark:text-[#eff1f6] shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-[#eff1f6]'
            }`}
          >
            Groups &amp; Circles ({groupsData.length})
          </button>
          <button
            onClick={() => setTab('colleges')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              tab === 'colleges'
                ? 'bg-white dark:bg-[#333333] text-neutral-900 dark:text-[#eff1f6] shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-[#eff1f6]'
            }`}
          >
            College Guilds
          </button>
        </div>
      </div>

      {/* Podium Top 3 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tab === 'colleges' ? (
          <>
            {/* Rank 2 */}
            <Card className="p-5 text-center order-2 md:order-1 border-neutral-200 dark:border-[#383838] bg-white dark:bg-[#282828]">
              <div className="w-10 h-10 rounded-full bg-neutral-200 dark:bg-[#333333] text-neutral-700 dark:text-neutral-300 font-bold mx-auto flex items-center justify-center text-sm mb-2">
                #2
              </div>
              <h3 className="font-bold text-neutral-900 dark:text-[#eff1f6] text-sm">{col2.college}</h3>
              <p className="text-xl font-extrabold text-neutral-800 dark:text-neutral-200 mt-1">{col2.points} pts</p>
              <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">Active Guild</p>
            </Card>

            {/* Rank 1 */}
            <Card className="p-6 text-center order-1 md:order-2 border-amber-300 dark:border-amber-500/40 bg-gradient-to-b from-amber-50/60 to-white dark:from-[#332a1e] dark:to-[#282828] shadow-md relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-amber-500 text-white font-bold text-[10px] uppercase tracking-wider flex items-center gap-1 shadow-sm">
                <Trophy className="w-3 h-3" /> Campus Leader
              </div>
              <div className="w-12 h-12 rounded-full bg-amber-400 text-neutral-950 font-extrabold mx-auto flex items-center justify-center text-base mb-2 shadow-inner">
                #1
              </div>
              <h3 className="font-bold text-neutral-900 dark:text-[#eff1f6] text-base">{col1.college}</h3>
              <p className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">{col1.points} pts</p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1 flex items-center justify-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> {col1.weeklyGrowth}
              </p>
            </Card>

            {/* Rank 3 */}
            <Card className="p-5 text-center order-3 border-neutral-200 dark:border-[#383838] bg-white dark:bg-[#282828]">
              <div className="w-10 h-10 rounded-full bg-amber-700/20 text-amber-800 dark:text-amber-300 font-bold mx-auto flex items-center justify-center text-sm mb-2">
                #3
              </div>
              <h3 className="font-bold text-neutral-900 dark:text-[#eff1f6] text-sm">{col3.college}</h3>
              <p className="text-xl font-extrabold text-neutral-800 dark:text-neutral-200 mt-1">{col3.points} pts</p>
              <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">Active Guild</p>
            </Card>
          </>
        ) : tab === 'groups' ? (
          <>
            {/* Rank 2 Group */}
            <Card className="p-5 text-center order-2 md:order-1 border-neutral-200 dark:border-[#383838] bg-white dark:bg-[#282828]">
              <div className="w-10 h-10 rounded-full bg-neutral-200 dark:bg-[#333333] text-neutral-700 dark:text-neutral-300 font-bold mx-auto flex items-center justify-center text-sm mb-2">
                #2
              </div>
              <h3 className="font-bold text-neutral-900 dark:text-[#eff1f6] text-sm">{group2.name}</h3>
              <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">Leader: {group2.leaderName}</p>
              <p className="text-xl font-extrabold text-neutral-800 dark:text-neutral-200 mt-2">{group2.reputation} Pts</p>
            </Card>

            {/* Rank 1 Group */}
            <Card className="p-6 text-center order-1 md:order-2 border-amber-300 dark:border-amber-500/40 bg-gradient-to-b from-amber-50/60 to-white dark:from-[#332a1e] dark:to-[#282828] shadow-md relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-amber-500 text-white font-bold text-[10px] uppercase tracking-wider flex items-center gap-1 shadow-sm">
                <Trophy className="w-3 h-3" /> Top Practice Circle
              </div>
              <div className="w-12 h-12 rounded-full bg-amber-400 text-neutral-950 font-extrabold mx-auto flex items-center justify-center text-base mb-2 shadow-inner">
                #1
              </div>
              <h3 className="font-bold text-neutral-900 dark:text-[#eff1f6] text-base">{group1.name}</h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                {group1.type === 'friends' ? 'Friends Group' : 'Official Guild'} • Leader: {group1.leaderName}
              </p>
              <p className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-2">{group1.reputation} Pts</p>
            </Card>

            {/* Rank 3 Group */}
            <Card className="p-5 text-center order-3 border-neutral-200 dark:border-[#383838] bg-white dark:bg-[#282828]">
              <div className="w-10 h-10 rounded-full bg-amber-700/20 text-amber-800 dark:text-amber-300 font-bold mx-auto flex items-center justify-center text-sm mb-2">
                #3
              </div>
              <h3 className="font-bold text-neutral-900 dark:text-[#eff1f6] text-sm">{group3.name}</h3>
              <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">Leader: {group3.leaderName}</p>
              <p className="text-xl font-extrabold text-neutral-800 dark:text-neutral-200 mt-2">{group3.reputation} Pts</p>
            </Card>
          </>
        ) : (
          <>
            {/* Rank 2 Individual */}
            <Card className="p-5 text-center order-2 md:order-1 border-neutral-200 dark:border-[#383838] bg-white dark:bg-[#282828]">
              <div className="w-10 h-10 rounded-full bg-neutral-200 dark:bg-[#333333] text-neutral-700 dark:text-neutral-300 font-bold mx-auto flex items-center justify-center text-sm mb-2">
                #2
              </div>
              <h3 className="font-bold text-neutral-900 dark:text-[#eff1f6] text-sm">{user2.name}</h3>
              <p className="text-xs text-neutral-400 dark:text-neutral-500 font-mono mt-0.5">@{user2.username} • {user2.college}</p>
              <p className="text-xl font-extrabold text-neutral-800 dark:text-neutral-200 mt-2">{user2.reputation} Rep</p>
            </Card>

            {/* Rank 1 Individual */}
            <Card className="p-6 text-center order-1 md:order-2 border-amber-300 dark:border-amber-500/40 bg-gradient-to-b from-amber-50/60 to-white dark:from-[#332a1e] dark:to-[#282828] shadow-md relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-amber-500 text-white font-bold text-[10px] uppercase tracking-wider flex items-center gap-1 shadow-sm">
                <Trophy className="w-3 h-3" /> Season Leader
              </div>
              <div className="w-12 h-12 rounded-full bg-amber-400 text-neutral-950 font-extrabold mx-auto flex items-center justify-center text-base mb-2 shadow-inner">
                #1
              </div>
              <h3 className="font-bold text-neutral-900 dark:text-[#eff1f6] text-base">{user1.name}</h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 font-mono mt-0.5">@{user1.username} • {user1.college}</p>
              <p className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-2">{user1.reputation} Rep</p>
            </Card>

            {/* Rank 3 Individual */}
            <Card className="p-5 text-center order-3 border-neutral-200 dark:border-[#383838] bg-white dark:bg-[#282828]">
              <div className="w-10 h-10 rounded-full bg-amber-700/20 text-amber-800 dark:text-amber-300 font-bold mx-auto flex items-center justify-center text-sm mb-2">
                #3
              </div>
              <h3 className="font-bold text-neutral-900 dark:text-[#eff1f6] text-sm">{user3.name}</h3>
              <p className="text-xs text-neutral-400 dark:text-neutral-500 font-mono mt-0.5">@{user3.username} • {user3.college}</p>
              <p className="text-xl font-extrabold text-neutral-800 dark:text-neutral-200 mt-2">{user3.reputation} Rep</p>
            </Card>
          </>
        )}
      </div>

      {/* Detailed Table */}
      <Card className="overflow-hidden border border-neutral-200 dark:border-[#383838] bg-white dark:bg-[#282828]">
        <table className="w-full text-left text-sm">
          <thead className="bg-neutral-50 dark:bg-[#202020] border-b border-neutral-200 dark:border-[#383838] text-xs text-neutral-500 dark:text-neutral-400 uppercase tracking-wider font-semibold">
            <tr>
              <th className="py-3 px-4 w-16 text-center">Rank</th>
              <th className="py-3 px-4">
                {tab === 'colleges' ? 'Engineering Institution' : tab === 'groups' ? 'Practice Circle / Guild' : 'Developer'}
              </th>
              <th className="py-3 px-4">
                {tab === 'colleges' ? 'Active Students' : tab === 'groups' ? 'Group Type' : 'College'}
              </th>
              <th className="py-3 px-4">
                {tab === 'colleges' ? 'Problems Solved' : tab === 'groups' ? 'Active Members' : 'Daily Streak'}
              </th>
              <th className="py-3 px-4 text-right">
                {tab === 'colleges' ? 'Guild Score' : tab === 'groups' ? 'Circle Points' : 'Reputation'}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-[#333333]">
            {tab === 'colleges' ? (
              collegesData.map((col) => (
                <tr key={col.rank} className="hover:bg-neutral-50/70 dark:hover:bg-[#303030] transition-colors">
                  <td className="py-3.5 px-4 text-center font-bold font-mono text-neutral-700 dark:text-neutral-300">
                    #{col.rank}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-neutral-900 dark:text-[#eff1f6]">
                    {col.college}
                  </td>
                  <td className="py-3.5 px-4 text-neutral-600 dark:text-neutral-400 font-mono text-xs">
                    {col.activeStudents} Contributors
                  </td>
                  <td className="py-3.5 px-4 text-neutral-600 dark:text-neutral-400 font-mono text-xs">
                    {col.problemsSolved}
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-neutral-900 dark:text-[#eff1f6] font-mono">
                    {col.points.toLocaleString()} pts
                  </td>
                </tr>
              ))
            ) : tab === 'groups' ? (
              groupsData.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-neutral-500 dark:text-neutral-400 text-xs">
                    No groups registered yet.{' '}
                    <Link href="/groups" className="text-brand-600 dark:text-brand-400 font-bold underline ml-1">
                      Create a Friends Group or Campus Guild
                    </Link>
                  </td>
                </tr>
              ) : (
                groupsData.map((grp) => (
                  <tr key={grp.id} className="hover:bg-neutral-50/70 dark:hover:bg-[#303030] transition-colors">
                    <td className="py-3.5 px-4 text-center font-bold font-mono text-neutral-700 dark:text-neutral-300">
                      #{grp.rank}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-neutral-900 dark:text-[#eff1f6] flex items-center gap-2">
                        <span>{grp.name}</span>
                      </div>
                      <div className="text-xs text-neutral-400 dark:text-neutral-500">Leader: {grp.leaderName}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-bold uppercase ${
                          grp.type === 'friends'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-[#00b8a3]/15 dark:text-[#00b8a3] dark:border-[#00b8a3]/30'
                            : 'bg-indigo-50 text-indigo-700 border-indigo-300 dark:bg-[#6366f1]/15 dark:text-[#818cf8] dark:border-[#6366f1]/30'
                        }`}
                      >
                        {grp.type === 'friends' ? 'Friends Group' : 'Official Guild'}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-neutral-600 dark:text-neutral-400 font-mono text-xs">
                      {grp.membersCount} {grp.membersCount === 1 ? 'Coder' : 'Coders'}
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-brand-600 dark:text-brand-400 font-mono">
                      {grp.reputation.toLocaleString()} pts
                    </td>
                  </tr>
                ))
              )
            ) : (
              usersData.map((usr) => (
                <tr
                  key={usr.rank}
                  className={`hover:bg-neutral-50/70 dark:hover:bg-[#303030] transition-colors ${
                    usr.isCurrentUser ? 'bg-brand-50/40 dark:bg-brand-950/20 font-semibold' : ''
                  }`}
                >
                  <td className="py-3.5 px-4 text-center font-bold font-mono text-neutral-700 dark:text-neutral-300">
                    #{usr.rank}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-neutral-900 dark:text-[#eff1f6] flex items-center gap-2">
                      <span>{usr.name}</span>
                      {usr.isCurrentUser && (
                        <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-brand-600 text-white">
                          You
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-neutral-400 dark:text-neutral-500 font-mono">@{usr.username}</div>
                  </td>
                  <td className="py-3.5 px-4 text-neutral-600 dark:text-neutral-400 text-xs">
                    {usr.college}
                  </td>
                  <td className="py-3.5 px-4 text-amber-600 dark:text-amber-400 font-mono text-xs font-semibold">
                    🔥 {usr.streak} {usr.streak === 1 ? 'Day' : 'Days'}
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-brand-600 dark:text-brand-400 font-mono">
                    {usr.reputation.toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
