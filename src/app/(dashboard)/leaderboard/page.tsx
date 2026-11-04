'use client';

import React, { useState, useEffect } from 'react';
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
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

export default function LeaderboardPage() {
  const [tab, setTab] = useState<'colleges' | 'individuals'>('individuals');
  const [currentUsername, setCurrentUsername] = useState('developer');
  const [currentDisplayName, setCurrentDisplayName] = useState('Developer');
  const [currentCollege, setCurrentCollege] = useState('Engineering Guild');
  const [solvedCount, setSolvedCount] = useState(0);

  const [usersData, setUsersData] = useState<UserRank[]>([]);
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
    } catch {
      // Ignore
    }

    // 2. Fetch live registered accounts from Supabase profiles table
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

        const { data: profiles, error } = await supabase
          .from('profiles')
          .select('*')
          .order('problems_solved', { ascending: false })
          .order('reputation_points', { ascending: false });

        if (!error && profiles && profiles.length > 0) {
          // Map real registered users
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
          // Fallback initial seeded community accounts if table empty
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
            {
              rank: 2,
              name: 'Arjun Sharma',
              username: 'arjun_dsa',
              college: 'IIT Bombay Tech Council',
              reputation: 340,
              streak: 4,
              problems: 5,
            },
            {
              rank: 3,
              name: 'Neha Gupta',
              username: 'neha_code',
              college: 'PES University Ring of Code',
              reputation: 280,
              streak: 3,
              problems: 4,
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
              weeklyGrowth: '+12%',
            },
            {
              rank: 2,
              college: 'IIT Bombay Tech Council',
              points: 340,
              activeStudents: 1,
              problemsSolved: 5,
              weeklyGrowth: '+18%',
            },
            {
              rank: 3,
              college: 'PES University Ring of Code',
              points: 280,
              activeStudents: 1,
              problemsSolved: 4,
              weeklyGrowth: '+10%',
            },
          ]);
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
    name: 'Developer',
    username: 'developer',
    college: 'Arena',
    reputation: 120,
    problems: 0,
  };
  const user2 = usersData[1] || {
    name: 'Open Slot',
    username: 'community',
    college: 'Arena',
    reputation: 100,
    problems: 0,
  };
  const user3 = usersData[2] || {
    name: 'Open Slot',
    username: 'community',
    college: 'Arena',
    reputation: 100,
    problems: 0,
  };

  const col1 = collegesData[0] || {
    college: 'Engineering Guild',
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
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">
            Developer Leaderboard
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Live rankings of registered developers across all collegiate guilds. Solve arena problems to climb!
          </p>
        </div>

        <div className="flex items-center gap-2 bg-neutral-100 p-1 rounded-xl">
          <button
            onClick={() => setTab('individuals')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              tab === 'individuals'
                ? 'bg-white text-neutral-900 shadow-sm'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Registered Developers ({usersData.length})
          </button>
          <button
            onClick={() => setTab('colleges')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              tab === 'colleges'
                ? 'bg-white text-neutral-900 shadow-sm'
                : 'text-neutral-600 hover:text-neutral-900'
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
            <Card className="p-5 text-center order-2 md:order-1 border-neutral-200">
              <div className="w-10 h-10 rounded-full bg-neutral-200 text-neutral-700 font-bold mx-auto flex items-center justify-center text-sm mb-2">
                #2
              </div>
              <h3 className="font-bold text-neutral-900 text-sm">{col2.college}</h3>
              <p className="text-xl font-extrabold text-neutral-800 mt-1">{col2.points} pts</p>
              <p className="text-xs text-neutral-400 mt-1">Active Guild</p>
            </Card>

            {/* Rank 1 */}
            <Card className="p-6 text-center order-1 md:order-2 border-amber-300 bg-gradient-to-b from-amber-50/50 to-white shadow-md relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-amber-500 text-white font-bold text-[10px] uppercase tracking-wider flex items-center gap-1 shadow-sm">
                <Trophy className="w-3 h-3" /> Campus Leader
              </div>
              <div className="w-12 h-12 rounded-full bg-amber-400 text-neutral-950 font-extrabold mx-auto flex items-center justify-center text-base mb-2 shadow-inner">
                #1
              </div>
              <h3 className="font-bold text-neutral-900 text-base">{col1.college}</h3>
              <p className="text-2xl font-black text-amber-600 mt-1">{col1.points} pts</p>
              <p className="text-xs text-emerald-600 font-semibold mt-1 flex items-center justify-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> {col1.weeklyGrowth}
              </p>
            </Card>

            {/* Rank 3 */}
            <Card className="p-5 text-center order-3 border-neutral-200">
              <div className="w-10 h-10 rounded-full bg-amber-700/20 text-amber-800 font-bold mx-auto flex items-center justify-center text-sm mb-2">
                #3
              </div>
              <h3 className="font-bold text-neutral-900 text-sm">{col3.college}</h3>
              <p className="text-xl font-extrabold text-neutral-800 mt-1">{col3.points} pts</p>
              <p className="text-xs text-neutral-400 mt-1">Active Guild</p>
            </Card>
          </>
        ) : (
          <>
            {/* Rank 2 */}
            <Card className="p-5 text-center order-2 md:order-1 border-neutral-200">
              <div className="w-10 h-10 rounded-full bg-neutral-200 text-neutral-700 font-bold mx-auto flex items-center justify-center text-sm mb-2">
                #2
              </div>
              <h3 className="font-bold text-neutral-900 text-sm">{user2.name}</h3>
              <p className="text-xs text-neutral-400 font-mono mt-0.5">@{user2.username} • {user2.college}</p>
              <p className="text-xl font-extrabold text-neutral-800 mt-2">{user2.reputation} Rep</p>
            </Card>

            {/* Rank 1 */}
            <Card className="p-6 text-center order-1 md:order-2 border-amber-300 bg-gradient-to-b from-amber-50/50 to-white shadow-md relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-amber-500 text-white font-bold text-[10px] uppercase tracking-wider flex items-center gap-1 shadow-sm">
                <Trophy className="w-3 h-3" /> Season Leader
              </div>
              <div className="w-12 h-12 rounded-full bg-amber-400 text-neutral-950 font-extrabold mx-auto flex items-center justify-center text-base mb-2 shadow-inner">
                #1
              </div>
              <h3 className="font-bold text-neutral-900 text-base">{user1.name}</h3>
              <p className="text-xs text-neutral-500 font-mono mt-0.5">@{user1.username} • {user1.college}</p>
              <p className="text-2xl font-black text-amber-600 mt-2">{user1.reputation} Rep</p>
            </Card>

            {/* Rank 3 */}
            <Card className="p-5 text-center order-3 border-neutral-200">
              <div className="w-10 h-10 rounded-full bg-amber-700/20 text-amber-800 font-bold mx-auto flex items-center justify-center text-sm mb-2">
                #3
              </div>
              <h3 className="font-bold text-neutral-900 text-sm">{user3.name}</h3>
              <p className="text-xs text-neutral-400 font-mono mt-0.5">@{user3.username} • {user3.college}</p>
              <p className="text-xl font-extrabold text-neutral-800 mt-2">{user3.reputation} Rep</p>
            </Card>
          </>
        )}
      </div>

      {/* Detailed Table */}
      <Card className="overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-neutral-50 border-b border-neutral-200 text-xs text-neutral-500 uppercase tracking-wider font-semibold">
            <tr>
              <th className="py-3 px-4 w-16 text-center">Rank</th>
              <th className="py-3 px-4">{tab === 'colleges' ? 'Engineering Institution' : 'Developer'}</th>
              <th className="py-3 px-4">{tab === 'colleges' ? 'Active Students' : 'College'}</th>
              <th className="py-3 px-4">{tab === 'colleges' ? 'Problems Solved' : 'Daily Streak'}</th>
              <th className="py-3 px-4 text-right">{tab === 'colleges' ? 'Guild Score' : 'Reputation'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {tab === 'colleges'
              ? collegesData.map((col) => (
                  <tr key={col.rank} className="hover:bg-neutral-50/70 transition-colors">
                    <td className="py-3.5 px-4 text-center font-bold font-mono text-neutral-700">
                      #{col.rank}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-neutral-900">
                      {col.college}
                    </td>
                    <td className="py-3.5 px-4 text-neutral-600 font-mono text-xs">
                      {col.activeStudents} Contributors
                    </td>
                    <td className="py-3.5 px-4 text-neutral-600 font-mono text-xs">
                      {col.problemsSolved}
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-neutral-900 font-mono">
                      {col.points.toLocaleString()} pts
                    </td>
                  </tr>
                ))
              : usersData.map((usr) => (
                  <tr
                    key={usr.rank}
                    className={`hover:bg-neutral-50/70 transition-colors ${
                      usr.isCurrentUser ? 'bg-brand-50/40 font-semibold' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4 text-center font-bold font-mono text-neutral-700">
                      #{usr.rank}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-neutral-900 flex items-center gap-2">
                        <span>{usr.name}</span>
                        {usr.isCurrentUser && (
                          <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-brand-600 text-white">
                            You
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-neutral-400 font-mono">@{usr.username}</div>
                    </td>
                    <td className="py-3.5 px-4 text-neutral-600 text-xs">
                      {usr.college}
                    </td>
                    <td className="py-3.5 px-4 text-amber-600 font-mono text-xs font-semibold">
                      🔥 {usr.streak} {usr.streak === 1 ? 'Day' : 'Days'}
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-brand-600 font-mono">
                      {usr.reputation.toLocaleString()}
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
