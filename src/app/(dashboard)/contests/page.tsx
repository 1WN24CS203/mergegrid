'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Trophy,
  Users,
  Swords,
  Clock,
  Lock,
  Sparkles,
  Plus,
  Play,
  Flame,
  Check,
  X,
  Target,
  ArrowRight,
  Shield,
  Calendar,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/toast';
import { curatedProblemsCatalog } from '@/lib/problems-data';
import { createClient } from '@/lib/supabase/client';

export interface GroupMember {
  id: string;
  name: string;
  username: string;
  role: 'leader' | 'member';
  status: 'online' | 'practicing' | 'offline';
  solvedCount: number;
}

export interface Group {
  id: string;
  name: string;
  slug: string;
  description: string;
  type: 'friends' | 'official';
  leaderId: string;
  leaderName: string;
  topics: string[];
  members: GroupMember[];
  createdAt: string;
}

export interface Contest {
  id: string;
  title: string;
  description: string;
  groupId?: string;
  groupName?: string;
  groupType?: 'friends' | 'official' | 'open';
  createdBy: string;
  createdByName: string;
  targetType: 'all' | 'selected_friends' | 'open_arena';
  invitedMembers: string[];
  durationMinutes: number;
  startTime: string;
  status: 'upcoming' | 'live' | 'ended';
  problemIds: string[];
  problemTitles: string[];
  participantsCount: number;
}

export default function ContestsPage() {
  const [activeTab, setActiveTab] = useState<'live' | 'upcoming' | 'ended'>('live');
  const [contests, setContests] = useState<Contest[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string>('current-user-id');
  const [currentUserName, setCurrentUserName] = useState<string>('Developer');

  // Modal States
  const [showHostContestModal, setShowHostContestModal] = useState(false);
  const [showLeaderRestrictedModal, setShowLeaderRestrictedModal] = useState(false);
  const [restrictedGroupInfo, setRestrictedGroupInfo] = useState<Group | null>(null);

  // Form State
  const [contestTitle, setContestTitle] = useState('');
  const [contestDuration, setContestDuration] = useState<number>(60);
  const [contestScope, setContestScope] = useState<'open' | 'group'>('open');
  const [selectedGroupId, setSelectedGroupId] = useState<string>('');
  const [contestTargetType, setContestTargetType] = useState<'all' | 'selected_friends'>('all');
  const [selectedTargetFriends, setSelectedTargetFriends] = useState<string[]>([]);
  const [selectedProblemCount, setSelectedProblemCount] = useState<number>(3);

  const { toast } = useToast();

  // Load real profile, groups, and contests (strictly zero mock data for public release)
  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem('mergegrid_user_profile');
      if (savedProfile) {
        const p = JSON.parse(savedProfile);
        if (p.displayName) setCurrentUserName(p.displayName);
      }

      const savedContests = localStorage.getItem('mergegrid_contests');
      if (savedContests) {
        const parsed = JSON.parse(savedContests);
        if (Array.isArray(parsed)) setContests(parsed);
      }

      const savedGroups = localStorage.getItem('mergegrid_groups');
      if (savedGroups) {
        const parsedG = JSON.parse(savedGroups);
        if (Array.isArray(parsedG)) setGroups(parsedG);
      }
    } catch {
      // Ignore
    }

    async function fetchSupabaseData() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setCurrentUserId(user.id);
          const name =
            user.user_metadata?.full_name ||
            user.user_metadata?.name ||
            user.user_metadata?.display_name ||
            user.email?.split('@')[0] ||
            'Developer';
          setCurrentUserName(name);
        }

        // Fetch groups
        const { data: dbGroups } = await supabase
          .from('groups')
          .select('*')
          .order('created_at', { ascending: false });

        if (dbGroups && dbGroups.length > 0) {
          const mappedGroups: Group[] = dbGroups.map((g: any) => ({
            id: g.id,
            name: g.name,
            slug: g.slug || g.name.toLowerCase().replace(/\s+/g, '-'),
            description: g.description || '',
            type: g.group_type || 'friends',
            leaderId: g.leader_id || '',
            leaderName: g.leader_id === user?.id ? currentUserName : 'Group Leader',
            topics: g.practice_topics || ['Algorithms'],
            members: [],
            createdAt: g.created_at,
          }));
          setGroups(mappedGroups);
        }
      } catch {
        // Fallback to local storage
      }
    }

    fetchSupabaseData();
  }, [currentUserName]);

  const saveContests = (updated: Contest[]) => {
    setContests(updated);
    try {
      localStorage.setItem('mergegrid_contests', JSON.stringify(updated));
    } catch {
      // Ignore
    }
  };

  // Check leader permission when selecting a group
  const handleSelectGroup = (groupId: string) => {
    setSelectedGroupId(groupId);
    const grp = groups.find((g) => g.id === groupId);
    if (grp) {
      if (grp.type === 'official' && grp.leaderId !== currentUserId) {
        setRestrictedGroupInfo(grp);
        setShowLeaderRestrictedModal(true);
        setSelectedGroupId('');
        return;
      }
      if (grp.type === 'friends') {
        setSelectedTargetFriends(grp.members.filter((m) => m.id !== currentUserId).map((m) => m.name));
      }
    }
  };

  // Submit Host Contest Form
  const handleHostContestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contestTitle.trim()) {
      toast({ type: 'error', title: 'Contest title required' });
      return;
    }

    const selectedGroup = contestScope === 'group' ? groups.find((g) => g.id === selectedGroupId) : null;

    if (contestScope === 'group' && !selectedGroup) {
      toast({ type: 'error', title: 'Please select a valid group' });
      return;
    }

    // Pick problems
    const shuffled = [...curatedProblemsCatalog].sort(() => 0.5 - Math.random());
    const pickedProblems = shuffled.slice(0, selectedProblemCount);

    const newContest: Contest = {
      id: `contest-${Date.now()}`,
      title: contestTitle.trim(),
      description: selectedGroup
        ? `Targeted clash hosted in ${selectedGroup.name}.`
        : 'Open arena speedrun clash for all MergeGrid developers.',
      groupId: selectedGroup?.id,
      groupName: selectedGroup?.name,
      groupType: selectedGroup ? selectedGroup.type : 'open',
      createdBy: currentUserId,
      createdByName: currentUserName,
      targetType:
        contestScope === 'open'
          ? 'open_arena'
          : contestTargetType,
      invitedMembers:
        contestScope === 'open'
          ? ['All MergeGrid Coders']
          : contestTargetType === 'selected_friends'
          ? selectedTargetFriends
          : selectedGroup?.members.map((m) => m.name) || [],
      durationMinutes: contestDuration,
      startTime: new Date().toISOString(),
      status: 'live',
      problemIds: pickedProblems.map((p) => p.id),
      problemTitles: pickedProblems.map((p) => p.title),
      participantsCount:
        contestScope === 'open'
          ? 1
          : contestTargetType === 'selected_friends'
          ? selectedTargetFriends.length + 1
          : (selectedGroup?.members.length || 0) + 1,
    };

    const updated = [newContest, ...contests];
    saveContests(updated);
    setShowHostContestModal(false);
    setContestTitle('');
    setActiveTab('live');

    toast({
      type: 'success',
      title: 'Contest Launched! 🚀',
      message: `"${newContest.title}" is now active in the Contest Arena.`,
    });
  };

  const liveContests = contests.filter((c) => c.status === 'live');
  const upcomingContests = contests.filter((c) => c.status === 'upcoming');
  const pastContests = contests.filter((c) => c.status === 'ended');

  const displayedContests =
    activeTab === 'live'
      ? liveContests
      : activeTab === 'upcoming'
      ? upcomingContests
      : pastContests;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-[#eff1f6] tracking-tight">
              Contests Arena
            </h1>
            <Badge variant="outline" className="text-xs text-brand-600 dark:text-brand-400 border-brand-200 dark:border-brand-500/30">
              Season 1 Live
            </Badge>
          </div>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Compete in algorithmic speedruns, spontaneous friend clashes, or collegiate tournaments.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link href="/groups">
            <Button
              variant="outline"
              className="text-xs font-semibold dark:bg-[#202020] dark:border-[#383838] dark:text-neutral-300"
              icon={<Users className="w-3.5 h-3.5 text-brand-600" />}
            >
              Groups &amp; Circles
            </Button>
          </Link>

          <Button
            onClick={() => setShowHostContestModal(true)}
            className="bg-brand-600 hover:bg-brand-700 text-white font-semibold shadow-sm text-xs"
            icon={<Plus className="w-3.5 h-3.5" />}
          >
            Host a Contest
          </Button>
        </div>
      </div>

      {/* Metrics Row (Strictly computed from real data) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <Card className="p-4 bg-white dark:bg-[#282828] border border-neutral-200 dark:border-[#383838]">
          <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400 text-xs font-semibold mb-1">
            <Flame className="w-4 h-4 text-rose-500" /> Live Clashes
          </div>
          <div className="text-2xl font-bold text-neutral-900 dark:text-[#eff1f6]">
            {liveContests.length}
          </div>
          <div className="text-[11px] text-neutral-400 dark:text-neutral-500 mt-0.5">Active now in arena</div>
        </Card>

        <Card className="p-4 bg-white dark:bg-[#282828] border border-neutral-200 dark:border-[#383838]">
          <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400 text-xs font-semibold mb-1">
            <Calendar className="w-4 h-4 text-brand-500" /> Upcoming
          </div>
          <div className="text-2xl font-bold text-neutral-900 dark:text-[#eff1f6]">
            {upcomingContests.length}
          </div>
          <div className="text-[11px] text-neutral-400 dark:text-neutral-500 mt-0.5">Scheduled sprints</div>
        </Card>

        <Card className="p-4 bg-white dark:bg-[#282828] border border-neutral-200 dark:border-[#383838]">
          <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400 text-xs font-semibold mb-1">
            <Trophy className="w-4 h-4 text-emerald-600" /> Completed
          </div>
          <div className="text-2xl font-bold text-neutral-900 dark:text-[#eff1f6]">
            {pastContests.length}
          </div>
          <div className="text-[11px] text-neutral-400 dark:text-neutral-500 mt-0.5">Finished leaderboards</div>
        </Card>

        <Card className="p-4 bg-white dark:bg-[#282828] border border-neutral-200 dark:border-[#383838]">
          <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400 text-xs font-semibold mb-1">
            <Sparkles className="w-4 h-4 text-purple-600" /> Hosted by You
          </div>
          <div className="text-2xl font-bold text-neutral-900 dark:text-[#eff1f6]">
            {contests.filter((c) => c.createdBy === currentUserId).length}
          </div>
          <div className="text-[11px] text-neutral-400 dark:text-neutral-500 mt-0.5">Your competitions</div>
        </Card>
      </div>

      {/* Cross-Link Banner to Groups */}
      <Card className="p-4 bg-gradient-to-r from-brand-50/70 to-indigo-50/70 dark:from-[#242c3d]/60 dark:to-[#2e2640]/60 border border-brand-200/80 dark:border-[#3e3e3e]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-600 text-white flex items-center justify-center shrink-0">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-neutral-900 dark:text-[#eff1f6]">
                Looking for your Practice Groups &amp; Study Circles?
              </h4>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">
                Groups now have a dedicated home where you can invite friends, collaborate on patterns, and launch group challenges.
              </p>
            </div>
          </div>
          <Link href="/groups" className="shrink-0">
            <Button size="sm" variant="outline" className="text-xs font-semibold bg-white dark:bg-[#282828] dark:border-[#383838] dark:text-[#eff1f6]">
              Go to Groups <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>
        </div>
      </Card>

      {/* Contest Tabs */}
      <div className="flex items-center border-b border-neutral-200 dark:border-[#383838] gap-3">
        <button
          onClick={() => setActiveTab('live')}
          className={`pb-3 px-3 text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2 border-b-2 cursor-pointer ${
            activeTab === 'live'
              ? 'border-brand-600 text-brand-600 dark:border-brand-400 dark:text-brand-400 font-bold'
              : 'border-transparent text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
          }`}
        >
          <Flame className="w-4 h-4 text-rose-500" />
          Live Clashes
          <span className="text-xs bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 px-2 py-0.5 rounded-full font-mono font-bold">
            {liveContests.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('upcoming')}
          className={`pb-3 px-3 text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2 border-b-2 cursor-pointer ${
            activeTab === 'upcoming'
              ? 'border-brand-600 text-brand-600 dark:border-brand-400 dark:text-brand-400 font-bold'
              : 'border-transparent text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
          }`}
        >
          <Calendar className="w-4 h-4" />
          Upcoming Schedule
          <span className="text-xs bg-neutral-100 dark:bg-[#333333] text-neutral-600 dark:text-neutral-300 px-2 py-0.5 rounded-full font-mono">
            {upcomingContests.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('ended')}
          className={`pb-3 px-3 text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2 border-b-2 cursor-pointer ${
            activeTab === 'ended'
              ? 'border-brand-600 text-brand-600 dark:border-brand-400 dark:text-brand-400 font-bold'
              : 'border-transparent text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
          }`}
        >
          <Trophy className="w-4 h-4" />
          Past Contests
          <span className="text-xs bg-neutral-100 dark:bg-[#333333] text-neutral-600 dark:text-neutral-300 px-2 py-0.5 rounded-full font-mono">
            {pastContests.length}
          </span>
        </button>
      </div>

      {/* Contests List */}
      <div className="space-y-4">
        {displayedContests.length === 0 ? (
          <Card className="p-10 sm:p-14 text-center border-dashed border-2 border-neutral-200 dark:border-[#383838] bg-white dark:bg-[#282828]">
            <div className="w-14 h-14 rounded-2xl bg-neutral-100 dark:bg-[#202020] text-neutral-400 flex items-center justify-center mx-auto mb-3">
              <Trophy className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-neutral-900 dark:text-[#eff1f6] text-base">
              {activeTab === 'live'
                ? 'No Contests Live Right Now'
                : activeTab === 'upcoming'
                ? 'No Contests Scheduled Yet'
                : 'No Completed Contests'}
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-sm mx-auto leading-relaxed">
              Launch an open challenge to all MergeGrid coders, or call a private speedrun clash within your friend groups!
            </p>
            <div className="mt-5 flex items-center justify-center gap-2.5">
              <Button
                onClick={() => setShowHostContestModal(true)}
                className="bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-sm"
                icon={<Plus className="w-3.5 h-3.5" />}
              >
                Host a Contest
              </Button>
              <Link href="/groups">
                <Button
                  variant="outline"
                  className="text-xs font-semibold dark:bg-[#202020] dark:border-[#383838] dark:text-neutral-300"
                  icon={<Users className="w-3.5 h-3.5" />}
                >
                  Manage Groups
                </Button>
              </Link>
            </div>
          </Card>
        ) : (
          <div className="space-y-3">
            {displayedContests.map((c) => (
              <Card
                key={c.id}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#282828] border border-neutral-200 dark:border-[#383838] hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                        c.status === 'live'
                          ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40'
                          : c.status === 'upcoming'
                          ? 'bg-brand-50 text-brand-600 dark:bg-brand-950/40 dark:text-brand-400'
                          : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'
                      }`}
                    >
                      {c.status === 'live' && <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />}
                      {c.status === 'live' ? 'LIVE CLASH' : c.status.toUpperCase()}
                    </span>

                    {c.groupName ? (
                      <Badge
                        variant="outline"
                        className="text-[10px] font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/40"
                      >
                        {c.groupName}
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="text-[10px] font-bold text-brand-700 bg-brand-50 dark:bg-brand-950/30 dark:text-brand-400 border-brand-200 dark:border-brand-900/40"
                      >
                        Open Arena
                      </Badge>
                    )}

                    {c.targetType === 'selected_friends' && (
                      <span className="text-[11px] font-semibold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/30 px-2 py-0.5 rounded border border-brand-200 dark:border-brand-900/40 flex items-center gap-1">
                        <Target className="w-3 h-3" />
                        Targeted: {c.invitedMembers.join(', ')}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-neutral-900 dark:text-[#eff1f6]">{c.title}</h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">{c.description}</p>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400 font-mono">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-neutral-400" />
                      Duration: {c.durationMinutes} mins
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-neutral-400" />
                      {c.participantsCount} Participants
                    </span>
                    <span>•</span>
                    <span className="text-neutral-600 dark:text-neutral-300 font-sans">
                      Hosted by <strong>{c.createdByName}</strong>
                    </span>
                  </div>

                  {/* Included Problems */}
                  <div className="pt-1 flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] text-neutral-400 dark:text-neutral-500 font-semibold mr-1">
                      Problems ({c.problemTitles.length}):
                    </span>
                    {c.problemTitles.map((title, i) => (
                      <span
                        key={i}
                        className="text-xs px-2 py-0.5 rounded bg-neutral-100 dark:bg-[#333333] text-neutral-700 dark:text-neutral-300 font-medium border border-neutral-200 dark:border-[#3e3e3e]"
                      >
                        P{i + 1}: {title}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="shrink-0 flex sm:flex-col items-center justify-end gap-2">
                  <Link href="/problems" className="w-full sm:w-auto">
                    <Button
                      className="bg-brand-600 hover:bg-brand-700 text-white font-semibold shadow-sm text-xs w-full"
                      icon={<Play className="w-3.5 h-3.5" />}
                    >
                      Enter Arena
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* HOST CONTEST MODAL */}
      {/* ========================================================= */}
      {showHostContestModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white dark:bg-[#282828] rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-neutral-200 dark:border-[#383838] max-h-[90vh] overflow-y-auto space-y-5 animate-scale-in">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-[#383838] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                  <Swords className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-neutral-900 dark:text-[#eff1f6] text-base">Host a Coding Clash</h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Set up an algorithmic challenge for the public arena or your private circle.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowHostContestModal(false)}
                className="text-neutral-400 hover:text-neutral-700 dark:hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleHostContestSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                  Contest Scope
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setContestScope('open')}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      contestScope === 'open'
                        ? 'border-brand-600 bg-brand-50/50 dark:bg-brand-950/30 text-brand-700 dark:text-brand-300 font-semibold'
                        : 'border-neutral-200 dark:border-[#383838] text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-[#333333]'
                    }`}
                  >
                    <span className="text-xs font-bold block">Open Arena</span>
                    <span className="text-[11px] text-neutral-500 dark:text-neutral-400 block mt-0.5">
                      Open to all registered developers.
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setContestScope('group')}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      contestScope === 'group'
                        ? 'border-brand-600 bg-brand-50/50 dark:bg-brand-950/30 text-brand-700 dark:text-brand-300 font-semibold'
                        : 'border-neutral-200 dark:border-[#383838] text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-[#333333]'
                    }`}
                  >
                    <span className="text-xs font-bold block">Group / Circle</span>
                    <span className="text-[11px] text-neutral-500 dark:text-neutral-400 block mt-0.5">
                      Targeted to your friends or guild.
                    </span>
                  </button>
                </div>
              </div>

              {contestScope === 'group' && (
                <div>
                  <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                    Select Group
                  </label>
                  {groups.length === 0 ? (
                    <div className="p-3 rounded-xl border border-dashed border-neutral-300 dark:border-[#383838] text-xs text-neutral-500 dark:text-neutral-400 text-center">
                      You haven&apos;t joined or created any groups yet.{' '}
                      <Link href="/groups" className="text-brand-600 dark:text-brand-400 font-bold underline">
                        Create a Group first
                      </Link>
                    </div>
                  ) : (
                    <select
                      value={selectedGroupId}
                      onChange={(e) => handleSelectGroup(e.target.value)}
                      className="w-full h-10 px-3 rounded-lg border text-xs bg-white dark:bg-[#202020] text-neutral-900 dark:text-neutral-100 border-neutral-300 dark:border-[#383838]"
                    >
                      <option value="">Choose a practice circle...</option>
                      {groups.map((g) => (
                        <option key={g.id} value={g.id}>
                          {g.name} ({g.type === 'friends' ? 'Friends Group' : 'Official Guild'})
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                  Contest Title
                </label>
                <Input
                  placeholder="e.g. Dynamic Programming 60m Speedrun"
                  value={contestTitle}
                  onChange={(e) => setContestTitle(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                    Duration
                  </label>
                  <select
                    value={contestDuration}
                    onChange={(e) => setContestDuration(Number(e.target.value))}
                    className="w-full h-10 px-3 rounded-lg border text-xs bg-white dark:bg-[#202020] text-neutral-900 dark:text-neutral-100 border-neutral-300 dark:border-[#383838]"
                  >
                    <option value={30}>30 Minutes</option>
                    <option value={45}>45 Minutes</option>
                    <option value={60}>60 Minutes</option>
                    <option value={90}>90 Minutes</option>
                    <option value={120}>120 Minutes</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                    Number of Problems
                  </label>
                  <select
                    value={selectedProblemCount}
                    onChange={(e) => setSelectedProblemCount(Number(e.target.value))}
                    className="w-full h-10 px-3 rounded-lg border text-xs bg-white dark:bg-[#202020] text-neutral-900 dark:text-neutral-100 border-neutral-300 dark:border-[#383838]"
                  >
                    <option value={1}>1 Problem Sprint</option>
                    <option value={2}>2 Problems</option>
                    <option value={3}>3 Problems (Standard)</option>
                    <option value={4}>4 Problems</option>
                    <option value={5}>5 Problems (Marathon)</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-100 dark:border-[#383838] flex items-center justify-end gap-2.5">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowHostContestModal(false)}
                  className="text-xs dark:bg-[#202020] dark:border-[#383838] dark:text-neutral-300"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-sm"
                  icon={<Swords className="w-3.5 h-3.5" />}
                >
                  Launch Contest
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* LEADER RESTRICTION MODAL */}
      {/* ========================================================= */}
      {showLeaderRestrictedModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#282828] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-neutral-200 dark:border-[#383838] text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto border border-amber-200 dark:border-amber-900/40">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-neutral-900 dark:text-[#eff1f6] text-lg">
                Leader Authorization Required
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2 leading-relaxed">
                In official campus guilds like &quot;<strong>{restrictedGroupInfo?.name}</strong>&quot;, only the designated group leader can schedule and host official contests.
              </p>
              <div className="mt-3 p-3 rounded-xl bg-neutral-50 dark:bg-[#202020] border border-neutral-200 dark:border-[#383838] text-left text-xs text-neutral-600 dark:text-neutral-400 space-y-1">
                <div>• Current Leader: <strong>{restrictedGroupInfo?.leaderName}</strong></div>
                <div>• Want spontaneous contests? Create a <strong>Friends Group</strong> where any member can call contests anytime!</div>
              </div>
            </div>
            <div className="pt-2 flex items-center justify-center gap-2">
              <Button
                variant="outline"
                onClick={() => setShowLeaderRestrictedModal(false)}
                className="text-xs dark:bg-[#202020] dark:border-[#383838] dark:text-neutral-300"
              >
                Understood
              </Button>
              <Link href="/groups">
                <Button
                  onClick={() => setShowLeaderRestrictedModal(false)}
                  className="bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs"
                >
                  Create Friends Group
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
