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
  const [tab, setTab] = useState<'colleges' | 'individuals'>('colleges');
  const [currentUsername, setCurrentUsername] = useState('developer');
  const [currentDisplayName, setCurrentDisplayName] = useState('Developer');
  const [currentCollege, setCurrentCollege] = useState('BMS College of Engineering (BMSCE)');
  const [solvedCount, setSolvedCount] = useState(0);

  useEffect(() => {
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
      } else if (typeof document !== 'undefined' && document.cookie.includes('github')) {
        setCurrentDisplayName('1WN24CS203');
        setCurrentUsername('1WN24CS203');
      }
    } catch {
      // Ignore
    }
  }, []);

  const userRep = 100 + solvedCount * 50;

  const collegesData: CollegeRank[] = [
    {
      rank: 1,
      college: currentCollege,
      points: userRep,
      activeStudents: 1,
      problemsSolved: solvedCount,
      weeklyGrowth: solvedCount > 0 ? `+${solvedCount * 10}%` : '+0%',
    },
    {
      rank: 2,
      college: 'RV College of Engineering (RVCE)',
      points: 0,
      activeStudents: 0,
      problemsSolved: 0,
      weeklyGrowth: 'Season 1',
    },
    {
      rank: 3,
      college: 'IIT Bombay Tech Council',
      points: 0,
      activeStudents: 0,
      problemsSolved: 0,
      weeklyGrowth: 'Season 1',
    },
    {
      rank: 4,
      college: 'PES University Ring of Code',
      points: 0,
      activeStudents: 0,
      problemsSolved: 0,
      weeklyGrowth: 'Season 1',
    },
    {
      rank: 5,
      college: 'MS Ramaiah Institute of Technology (MSRIT)',
      points: 0,
      activeStudents: 0,
      problemsSolved: 0,
      weeklyGrowth: 'Season 1',
    },
    {
      rank: 6,
      college: 'NIT Karnataka (NITK Surathkal)',
      points: 0,
      activeStudents: 0,
      problemsSolved: 0,
      weeklyGrowth: 'Season 1',
    },
  ];

  const usersData: UserRank[] = [
    {
      rank: 1,
      name: `${currentDisplayName} (You)`,
      username: currentUsername,
      college: currentCollege,
      reputation: userRep,
      streak: 1,
      problems: solvedCount,
      isCurrentUser: true,
    },
    {
      rank: 2,
      name: 'Podium Slot Unclaimed',
      username: 'open_slot',
      college: 'Collegiate Arena',
      reputation: 0,
      streak: 0,
      problems: 0,
    },
    {
      rank: 3,
      name: 'Podium Slot Unclaimed',
      username: 'open_slot',
      college: 'Collegiate Arena',
      reputation: 0,
      streak: 0,
      problems: 0,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">
            Leaderboard Arena
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Season 1 live rankings. Earn reputation points by solving arena challenges and merging PRs.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-neutral-100 p-1 rounded-xl">
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
          <button
            onClick={() => setTab('individuals')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              tab === 'individuals'
                ? 'bg-white text-neutral-900 shadow-sm'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Individual Developers
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
              <h3 className="font-bold text-neutral-900 text-sm">{collegesData[1].college}</h3>
              <p className="text-xl font-extrabold text-neutral-800 mt-1">{collegesData[1].points} pts</p>
              <p className="text-xs text-neutral-400 mt-1">Season 1 active</p>
            </Card>

            {/* Rank 1 */}
            <Card className="p-6 text-center order-1 md:order-2 border-amber-300 bg-gradient-to-b from-amber-50/50 to-white shadow-md relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-amber-500 text-white font-bold text-[10px] uppercase tracking-wider flex items-center gap-1 shadow-sm">
                <Trophy className="w-3 h-3" /> Campus Leader
              </div>
              <div className="w-12 h-12 rounded-full bg-amber-400 text-neutral-950 font-extrabold mx-auto flex items-center justify-center text-base mb-2 shadow-inner">
                #1
              </div>
              <h3 className="font-bold text-neutral-900 text-base">{collegesData[0].college}</h3>
              <p className="text-2xl font-black text-amber-600 mt-1">{collegesData[0].points} pts</p>
              <p className="text-xs text-emerald-600 font-semibold mt-1 flex items-center justify-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> {collegesData[0].weeklyGrowth}
              </p>
            </Card>

            {/* Rank 3 */}
            <Card className="p-5 text-center order-3 border-neutral-200">
              <div className="w-10 h-10 rounded-full bg-amber-700/20 text-amber-800 font-bold mx-auto flex items-center justify-center text-sm mb-2">
                #3
              </div>
              <h3 className="font-bold text-neutral-900 text-sm">{collegesData[2].college}</h3>
              <p className="text-xl font-extrabold text-neutral-800 mt-1">{collegesData[2].points} pts</p>
              <p className="text-xs text-neutral-400 mt-1">Season 1 active</p>
            </Card>
          </>
        ) : (
          <>
            {/* Rank 2 */}
            <Card className="p-5 text-center order-2 md:order-1 border-neutral-200">
              <div className="w-10 h-10 rounded-full bg-neutral-200 text-neutral-700 font-bold mx-auto flex items-center justify-center text-sm mb-2">
                #2
              </div>
              <h3 className="font-bold text-neutral-900 text-sm">{usersData[1].name}</h3>
              <p className="text-xs text-neutral-400 font-mono mt-0.5">Solve arena challenges to claim</p>
              <p className="text-xl font-extrabold text-neutral-800 mt-2">{usersData[1].reputation} Rep</p>
            </Card>

            {/* Rank 1 */}
            <Card className="p-6 text-center order-1 md:order-2 border-amber-300 bg-gradient-to-b from-amber-50/50 to-white shadow-md relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-amber-500 text-white font-bold text-[10px] uppercase tracking-wider flex items-center gap-1 shadow-sm">
                <Trophy className="w-3 h-3" /> Season Leader
              </div>
              <div className="w-12 h-12 rounded-full bg-amber-400 text-neutral-950 font-extrabold mx-auto flex items-center justify-center text-base mb-2 shadow-inner">
                #1
              </div>
              <h3 className="font-bold text-neutral-900 text-base">{usersData[0].name}</h3>
              <p className="text-xs text-neutral-500 font-mono mt-0.5">@{usersData[0].username} • {usersData[0].college}</p>
              <p className="text-2xl font-black text-amber-600 mt-2">{usersData[0].reputation} Rep</p>
            </Card>

            {/* Rank 3 */}
            <Card className="p-5 text-center order-3 border-neutral-200">
              <div className="w-10 h-10 rounded-full bg-amber-700/20 text-amber-800 font-bold mx-auto flex items-center justify-center text-sm mb-2">
                #3
              </div>
              <h3 className="font-bold text-neutral-900 text-sm">{usersData[2].name}</h3>
              <p className="text-xs text-neutral-400 font-mono mt-0.5">Solve arena challenges to claim</p>
              <p className="text-xl font-extrabold text-neutral-800 mt-2">{usersData[2].reputation} Rep</p>
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
                      usr.isCurrentUser ? 'bg-brand-50/40 font-semibold' : 'opacity-70'
                    }`}
                  >
                    <td className="py-3.5 px-4 text-center font-bold font-mono text-neutral-700">
                      #{usr.rank}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-neutral-900">{usr.name}</div>
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
