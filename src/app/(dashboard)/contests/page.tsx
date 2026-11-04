'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Trophy,
  Users,
  UserPlus,
  Swords,
  Clock,
  Lock,
  CheckCircle2,
  Sparkles,
  Plus,
  Shield,
  BookOpen,
  Play,
  Flame,
  Code2,
  Check,
  X,
  Target,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/toast';
import { curatedProblemsCatalog } from '@/lib/problems-data';

export interface GroupMember {
  id: string;
  name: string;
  username: string;
  avatarUrl?: string;
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
  groupId: string;
  groupName: string;
  groupType: 'friends' | 'official';
  createdBy: string;
  createdByName: string;
  targetType: 'all' | 'selected_friends';
  invitedMembers: string[];
  durationMinutes: number;
  startTime: string;
  status: 'upcoming' | 'live' | 'ended';
  problemIds: string[];
  problemTitles: string[];
  participantsCount: number;
}

// Available peers that can be added to groups or challenged
const AVAILABLE_PEERS: GroupMember[] = [
  {
    id: 'user-arjun',
    name: 'Arjun Varma',
    username: 'arjun_v',
    role: 'member',
    status: 'online',
    solvedCount: 142,
  },
  {
    id: 'user-sneha',
    name: 'Sneha Patil',
    username: 'sneha_patil',
    role: 'member',
    status: 'online',
    solvedCount: 198,
  },
  {
    id: 'user-vikram',
    name: 'Vikram Dev',
    username: 'vikram_dev',
    role: 'member',
    status: 'practicing',
    solvedCount: 215,
  },
  {
    id: 'user-rohit',
    name: 'Rohit Kumar',
    username: 'rohit_k',
    role: 'member',
    status: 'offline',
    solvedCount: 89,
  },
  {
    id: 'user-ananya',
    name: 'Ananya Roy',
    username: 'ananya_r',
    role: 'member',
    status: 'online',
    solvedCount: 164,
  },
];

const DEFAULT_GROUPS: Group[] = [
  {
    id: 'grp-friends-speedrunners',
    name: 'Algorithmic Speedrunners',
    slug: 'algorithmic-speedrunners',
    description: 'Close friends grinding LeetCode patterns, daily mock interviews, and spontaneous speedrun battles.',
    type: 'friends',
    leaderId: 'current-user-id',
    leaderName: 'Developer (You)',
    topics: ['Dynamic Programming', 'Sliding Window', 'Graphs'],
    members: [
      {
        id: 'current-user-id',
        name: 'Developer (You)',
        username: 'developer',
        role: 'leader',
        status: 'online',
        solvedCount: 120,
      },
      AVAILABLE_PEERS[0],
      AVAILABLE_PEERS[1],
      AVAILABLE_PEERS[2],
    ],
    createdAt: '2026-03-01T10:00:00.000Z',
  },
  {
    id: 'grp-official-bmsce-guild',
    name: 'BMSCE Competitive Coding Guild',
    slug: 'bmsce-coding-guild',
    description: 'Official collegiate programming cell representing BMS College of Engineering in regional hackathons.',
    type: 'official',
    leaderId: 'official-prof-leader',
    leaderName: 'Prof. K. Sharma (Guild Master)',
    topics: ['Advanced DSA', 'Segment Trees', 'Trie', 'Graph Theory'],
    members: [
      {
        id: 'official-prof-leader',
        name: 'Prof. K. Sharma',
        username: 'guild_master',
        role: 'leader',
        status: 'online',
        solvedCount: 540,
      },
      {
        id: 'current-user-id',
        name: 'Developer (You)',
        username: 'developer',
        role: 'member',
        status: 'online',
        solvedCount: 120,
      },
      AVAILABLE_PEERS[1],
      AVAILABLE_PEERS[2],
      AVAILABLE_PEERS[3],
      AVAILABLE_PEERS[4],
    ],
    createdAt: '2026-02-15T08:00:00.000Z',
  },
];

const DEFAULT_CONTESTS: Contest[] = [
  {
    id: 'contest-live-1',
    title: 'Weekend 1v1 DP Sprint',
    description: 'Spontaneous friends sprint on subsegment sums and longest common subsequence.',
    groupId: 'grp-friends-speedrunners',
    groupName: 'Algorithmic Speedrunners',
    groupType: 'friends',
    createdBy: 'user-sneha',
    createdByName: 'Sneha Patil',
    targetType: 'selected_friends',
    invitedMembers: ['Developer (You)', 'Arjun Varma', 'Vikram Dev'],
    durationMinutes: 45,
    startTime: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    status: 'live',
    problemIds: ['1', '3'],
    problemTitles: ['Two Sum', 'Longest Substring Without Repeating Characters'],
    participantsCount: 4,
  },
];

export default function ContestsPage() {
  const [activeTab, setActiveTab] = useState<'groups' | 'contests' | 'practice'>('groups');
  const [groups, setGroups] = useState<Group[]>(DEFAULT_GROUPS);
  const [contests, setContests] = useState<Contest[]>(DEFAULT_CONTESTS);
  const [currentUserId] = useState<string>('current-user-id');
  const [currentUserName] = useState<string>('Developer (You)');

  // Modal States
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [showCallContestModal, setShowCallContestModal] = useState(false);
  const [selectedGroupForContest, setSelectedGroupForContest] = useState<Group | null>(null);
  const [showLeaderRestrictedModal, setShowLeaderRestrictedModal] = useState(false);
  const [restrictedGroupInfo, setRestrictedGroupInfo] = useState<Group | null>(null);
  const [activePracticeGroup, setActivePracticeGroup] = useState<Group | null>(null);

  // New Group Form State
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDescription, setNewGroupDescription] = useState('');
  const [newGroupType, setNewGroupType] = useState<'friends' | 'official'>('friends');
  const [newGroupTopics] = useState<string[]>(['Algorithms', 'Data Structures']);
  const [selectedInitialFriends, setSelectedInitialFriends] = useState<string[]>([
    'user-sneha',
    'user-vikram',
  ]);

  // Call Contest Form State
  const [contestTitle, setContestTitle] = useState('');
  const [contestDuration, setContestDuration] = useState<number>(60);
  const [contestTargetType, setContestTargetType] = useState<'all' | 'selected_friends'>('all');
  const [selectedTargetFriends, setSelectedTargetFriends] = useState<string[]>([]);
  const [selectedProblemCount, setSelectedProblemCount] = useState<number>(3);

  const { toast } = useToast();

  // Load from LocalStorage
  useEffect(() => {
    try {
      const savedGroups = localStorage.getItem('mergegrid_groups');
      if (savedGroups) setGroups(JSON.parse(savedGroups));

      const savedContests = localStorage.getItem('mergegrid_contests');
      if (savedContests) setContests(JSON.parse(savedContests));
    } catch {
      // Ignore
    }
  }, []);

  const saveGroups = (updated: Group[]) => {
    setGroups(updated);
    try {
      localStorage.setItem('mergegrid_groups', JSON.stringify(updated));
    } catch {
      // Ignore
    }
  };

  const saveContests = (updated: Contest[]) => {
    setContests(updated);
    try {
      localStorage.setItem('mergegrid_contests', JSON.stringify(updated));
    } catch {
      // Ignore
    }
  };

  // Group Creation Handler
  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;

    const initialMembers: GroupMember[] = [
      {
        id: currentUserId,
        name: currentUserName,
        username: 'developer',
        role: 'leader',
        status: 'online',
        solvedCount: 120,
      },
      ...AVAILABLE_PEERS.filter((p) => selectedInitialFriends.includes(p.id)),
    ];

    const newGroup: Group = {
      id: `grp-${Date.now()}`,
      name: newGroupName.trim(),
      slug: newGroupName.trim().toLowerCase().replace(/\s+/g, '-'),
      description: newGroupDescription.trim() || 'A space to practice coding and compete together.',
      type: newGroupType,
      leaderId: currentUserId,
      leaderName: currentUserName,
      topics: newGroupTopics.length > 0 ? newGroupTopics : ['Algorithms'],
      members: initialMembers,
      createdAt: new Date().toISOString(),
    };

    const updated = [newGroup, ...groups];
    saveGroups(updated);
    setShowCreateGroupModal(false);
    setNewGroupName('');
    setNewGroupDescription('');

    toast({
      type: 'success',
      title: 'Group Created!',
      message: `"${newGroup.name}" is now ready for practice and contests.`,
    });
  };

  // Contest Creation Trigger
  const handleInitiateContest = (group: Group) => {
    // RULE 1: In friends groups, ANY member can call a contest!
    // RULE 2: In other groups (official/guild), ONLY the group leader can create contests!
    if (group.type !== 'friends') {
      const isLeader = group.leaderId === currentUserId;
      if (!isLeader) {
        setRestrictedGroupInfo(group);
        setShowLeaderRestrictedModal(true);
        return;
      }
    }

    // Set default friends selection if friends group
    setSelectedGroupForContest(group);
    setContestTitle(`${group.name} Clash #${Math.floor(Math.random() * 90 + 10)}`);
    setContestTargetType('all');
    setSelectedTargetFriends(
      group.members.filter((m) => m.id !== currentUserId).map((m) => m.name)
    );
    setShowCallContestModal(true);
  };

  // Contest Submission Handler
  const handleCallContestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGroupForContest || !contestTitle.trim()) return;

    // Select random problems from curated catalog
    const shuffled = [...curatedProblemsCatalog].sort(() => 0.5 - Math.random());
    const pickedProblems = shuffled.slice(0, selectedProblemCount);

    const newContest: Contest = {
      id: `contest-${Date.now()}`,
      title: contestTitle.trim(),
      description: `Targeted challenge organized in ${selectedGroupForContest.name}.`,
      groupId: selectedGroupForContest.id,
      groupName: selectedGroupForContest.name,
      groupType: selectedGroupForContest.type,
      createdBy: currentUserId,
      createdByName: currentUserName,
      targetType: contestTargetType,
      invitedMembers:
        contestTargetType === 'selected_friends'
          ? selectedTargetFriends
          : selectedGroupForContest.members.map((m) => m.name),
      durationMinutes: contestDuration,
      startTime: new Date().toISOString(),
      status: 'live',
      problemIds: pickedProblems.map((p) => p.id),
      problemTitles: pickedProblems.map((p) => p.title),
      participantsCount:
        contestTargetType === 'selected_friends'
          ? selectedTargetFriends.length + 1
          : selectedGroupForContest.members.length,
    };

    const updated = [newContest, ...contests];
    saveContests(updated);
    setShowCallContestModal(false);
    setActiveTab('contests');

    toast({
      type: 'success',
      title: 'Contest Launched!',
      message: `"${newContest.title}" is now active in ${selectedGroupForContest.name}.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">
              Contests Arena &amp; Friends Groups
            </h1>
            <Badge variant="outline" className="text-xs text-brand-600 border-brand-200">
              Season 1 Active
            </Badge>
          </div>
          <p className="text-sm text-neutral-500 mt-1">
            Practice collaboratively with friends, call custom clashes, or join official collegiate competitions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            onClick={() => setShowCreateGroupModal(true)}
            className="bg-brand-600 hover:bg-brand-700 text-white font-semibold shadow-sm text-sm"
            icon={<Plus className="w-4 h-4" />}
          >
            Create New Group
          </Button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <Card className="p-4 bg-white">
          <div className="flex items-center gap-2 text-neutral-500 text-xs font-semibold mb-1">
            <Users className="w-4 h-4 text-brand-600" /> Your Groups
          </div>
          <div className="text-2xl font-bold text-neutral-900">{groups.length}</div>
          <div className="text-[11px] text-neutral-400 mt-0.5">Active practice circles</div>
        </Card>

        <Card className="p-4 bg-white">
          <div className="flex items-center gap-2 text-neutral-500 text-xs font-semibold mb-1">
            <Flame className="w-4 h-4 text-amber-500" /> Live Clashes
          </div>
          <div className="text-2xl font-bold text-neutral-900">
            {contests.filter((c) => c.status === 'live').length}
          </div>
          <div className="text-[11px] text-neutral-400 mt-0.5">In-progress contests</div>
        </Card>

        <Card className="p-4 bg-white">
          <div className="flex items-center gap-2 text-neutral-500 text-xs font-semibold mb-1">
            <Trophy className="w-4 h-4 text-emerald-600" /> Practice Solved
          </div>
          <div className="text-2xl font-bold text-neutral-900">48</div>
          <div className="text-[11px] text-neutral-400 mt-0.5">Collaborative completions</div>
        </Card>

        <Card className="p-4 bg-white">
          <div className="flex items-center gap-2 text-neutral-500 text-xs font-semibold mb-1">
            <Sparkles className="w-4 h-4 text-purple-600" /> Online Friends
          </div>
          <div className="text-2xl font-bold text-neutral-900">
            {AVAILABLE_PEERS.filter((p) => p.status === 'online').length + 1}
          </div>
          <div className="text-[11px] text-neutral-400 mt-0.5">Ready to compete</div>
        </Card>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center border-b border-neutral-200 overflow-x-auto no-scrollbar gap-2">
        <button
          onClick={() => setActiveTab('groups')}
          className={`pb-3 px-3 text-sm font-semibold transition-colors flex items-center gap-2 shrink-0 border-b-2 cursor-pointer ${
            activeTab === 'groups'
              ? 'border-brand-600 text-brand-600 font-bold'
              : 'border-transparent text-neutral-500 hover:text-neutral-900'
          }`}
        >
          <Users className="w-4 h-4" />
          Friends &amp; Practice Groups
          <span className="text-xs bg-neutral-100 px-2 py-0.5 rounded-full text-neutral-600 font-mono">
            {groups.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('contests')}
          className={`pb-3 px-3 text-sm font-semibold transition-colors flex items-center gap-2 shrink-0 border-b-2 cursor-pointer ${
            activeTab === 'contests'
              ? 'border-brand-600 text-brand-600 font-bold'
              : 'border-transparent text-neutral-500 hover:text-neutral-900'
          }`}
        >
          <Swords className="w-4 h-4" />
          Contests &amp; Speedruns
          <span className="text-xs bg-brand-50 text-brand-600 px-2 py-0.5 rounded-full font-mono font-bold">
            {contests.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('practice')}
          className={`pb-3 px-3 text-sm font-semibold transition-colors flex items-center gap-2 shrink-0 border-b-2 cursor-pointer ${
            activeTab === 'practice'
              ? 'border-brand-600 text-brand-600 font-bold'
              : 'border-transparent text-neutral-500 hover:text-neutral-900'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Curated Group Practice
        </button>
      </div>

      {/* TAB 1: FRIENDS & PRACTICE GROUPS */}
      {activeTab === 'groups' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-neutral-500">
            <span>
              Showing all <strong>{groups.length}</strong> active groups you participate in.
            </span>
            <span className="text-neutral-400">
              💡 In <strong>Friends Groups</strong>, anyone can call contests. In <strong>Official Guilds</strong>, leaders schedule matches.
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {groups.map((group) => {
              const isFriendsGroup = group.type === 'friends';
              const isLeader = group.leaderId === currentUserId;

              return (
                <Card
                  key={group.id}
                  className="p-5 flex flex-col justify-between hover:shadow-md transition-shadow border-neutral-200 bg-white"
                >
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-base shadow-xs shrink-0 ${
                            isFriendsGroup
                              ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                              : 'bg-indigo-50 text-indigo-600 border border-indigo-200'
                          }`}
                        >
                          {isFriendsGroup ? <Users className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
                        </div>
                        <div>
                          <h3 className="font-bold text-neutral-900 text-base flex items-center gap-2">
                            {group.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-0.5">
                            <Badge
                              variant="outline"
                              className={`text-[10px] font-bold uppercase ${
                                isFriendsGroup
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                                  : 'bg-indigo-50 text-indigo-700 border-indigo-300'
                              }`}
                            >
                              {isFriendsGroup ? 'Friends Group' : 'Official Guild'}
                            </Badge>
                            <span className="text-xs text-neutral-400">• Leader: {group.leaderName}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      {group.description}
                    </p>

                    {/* Practice Focus Topics */}
                    <div>
                      <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">
                        Practice Focus
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {group.topics.map((t) => (
                          <span
                            key={t}
                            className="text-xs px-2.5 py-0.5 rounded-md bg-neutral-100 text-neutral-700 border border-neutral-200 font-medium"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Members List Preview */}
                    <div>
                      <div className="flex items-center justify-between text-xs text-neutral-500 mb-2">
                        <span className="font-semibold">
                          Group Members ({group.members.length})
                        </span>
                        <span className="text-[11px] text-neutral-400">
                          {group.members.filter((m) => m.status === 'online').length} online now
                        </span>
                      </div>
                      <div className="flex items-center gap-2 overflow-x-auto py-1">
                        {group.members.map((m) => (
                          <div
                            key={m.id}
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-50 border border-neutral-200 text-xs shrink-0"
                            title={`${m.name} (@${m.username}) — Solved: ${m.solvedCount}`}
                          >
                            <span
                              className={`w-2 h-2 rounded-full ${
                                m.status === 'online'
                                  ? 'bg-emerald-500'
                                  : m.status === 'practicing'
                                  ? 'bg-amber-500'
                                  : 'bg-neutral-300'
                              }`}
                            />
                            <span className="font-medium text-neutral-800">{m.name}</span>
                            {m.role === 'leader' && (
                              <span className="text-[9px] font-bold text-amber-600 bg-amber-50 px-1 rounded">
                                Leader
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="mt-5 pt-4 border-t border-neutral-100 flex items-center justify-between gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActivePracticeGroup(group)}
                      icon={<BookOpen className="w-3.5 h-3.5 text-brand-600" />}
                      className="text-xs"
                    >
                      Practice Room
                    </Button>

                    <Button
                      size="sm"
                      onClick={() => handleInitiateContest(group)}
                      className={`text-xs font-semibold ${
                        isFriendsGroup
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          : isLeader
                          ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                          : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-600 border border-neutral-300'
                      }`}
                      icon={
                        isFriendsGroup ? (
                          <Swords className="w-3.5 h-3.5" />
                        ) : isLeader ? (
                          <Swords className="w-3.5 h-3.5" />
                        ) : (
                          <Lock className="w-3.5 h-3.5" />
                        )
                      }
                    >
                      {isFriendsGroup
                        ? 'Call Contest / Challenge'
                        : isLeader
                        ? 'Host Official Contest'
                        : 'Contests (Leader Only)'}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: ACTIVE & UPCOMING CONTESTS */}
      {activeTab === 'contests' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-neutral-500">
            <span>
              All active challenges called by you or your group peers.
            </span>
          </div>

          {contests.length === 0 ? (
            <Card className="p-12 text-center border-dashed border-2 bg-white">
              <Trophy className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
              <h3 className="font-bold text-neutral-900 text-base">No active contests right now</h3>
              <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
                Select one of your Friends Groups above and tap &quot;Call Contest&quot; to challenge friends!
              </p>
            </Card>
          ) : (
            <div className="space-y-3">
              {contests.map((c) => (
                <Card
                  key={c.id}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white hover:border-neutral-300 transition-colors"
                >
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                          c.status === 'live'
                            ? 'bg-rose-50 text-rose-600 border border-rose-200'
                            : 'bg-neutral-100 text-neutral-600'
                        }`}
                      >
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                        LIVE CLASH
                      </span>

                      <Badge
                        variant="outline"
                        className={`text-[10px] font-bold ${
                          c.groupType === 'friends'
                            ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                            : 'text-indigo-700 bg-indigo-50 border-indigo-200'
                        }`}
                      >
                        {c.groupName}
                      </Badge>

                      {c.targetType === 'selected_friends' && (
                        <span className="text-[11px] font-semibold text-brand-600 bg-brand-50 px-2 py-0.5 rounded border border-brand-200 flex items-center gap-1">
                          <Target className="w-3 h-3" />
                          Targeted: {c.invitedMembers.join(', ')}
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-neutral-900">{c.title}</h3>
                    <p className="text-xs text-neutral-500">{c.description}</p>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500 font-mono">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-neutral-400" />
                        Duration: {c.durationMinutes} mins
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-neutral-400" />
                        {c.participantsCount} Invited
                      </span>
                      <span>•</span>
                      <span className="text-neutral-600 font-sans">
                        Called by <strong>{c.createdByName}</strong>
                      </span>
                    </div>

                    {/* Included Problems */}
                    <div className="pt-1 flex flex-wrap items-center gap-1.5">
                      <span className="text-[11px] text-neutral-400 font-semibold mr-1">Problems:</span>
                      {c.problemTitles.map((title, i) => (
                        <span
                          key={i}
                          className="text-xs px-2 py-0.5 rounded bg-neutral-100 text-neutral-700 font-medium"
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
      )}

      {/* TAB 3: CURATED GROUP PRACTICE */}
      {activeTab === 'practice' && (
        <div className="space-y-4">
          <Card className="p-6 bg-gradient-to-r from-brand-50 to-indigo-50 border-brand-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-neutral-900">
                  Daily Collaborative Practice Track
                </h3>
                <p className="text-xs text-neutral-600 mt-1 max-w-xl leading-relaxed">
                  Every 24 hours, MergeGrid curates algorithmic problems across core interview archetypes. Solve them together with your friends, discuss time complexity tradeoffs, and review each other&apos;s code.
                </p>
              </div>
              <Link href="/problems">
                <Button
                  className="bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shrink-0"
                  icon={<Code2 className="w-4 h-4" />}
                >
                  Solve in Code Space
                </Button>
              </Link>
            </div>
          </Card>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="p-4 bg-white space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-emerald-700 bg-emerald-50 border-emerald-200">
                  Easy
                </Badge>
                <span className="text-xs text-neutral-400 font-mono">15m target</span>
              </div>
              <h4 className="font-bold text-neutral-900 text-sm">Two Sum (Hashing)</h4>
              <p className="text-xs text-neutral-500">
                Find indices that add up to target using single-pass hash map with O(n) time.
              </p>
              <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> 3 of your group friends solved this
              </div>
            </Card>

            <Card className="p-4 bg-white space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-amber-700 bg-amber-50 border-amber-200">
                  Medium
                </Badge>
                <span className="text-xs text-neutral-400 font-mono">30m target</span>
              </div>
              <h4 className="font-bold text-neutral-900 text-sm">3Sum (Two Pointers)</h4>
              <p className="text-xs text-neutral-500">
                Find unique triplets summing to zero by sorting array and two-pointer traversal.
              </p>
              <div className="text-[11px] text-brand-600 font-semibold flex items-center gap-1">
                <Users className="w-3.5 h-3.5" /> Sneha is currently practicing this
              </div>
            </Card>

            <Card className="p-4 bg-white space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-rose-700 bg-rose-50 border-rose-200">
                  Hard
                </Badge>
                <span className="text-xs text-neutral-400 font-mono">45m target</span>
              </div>
              <h4 className="font-bold text-neutral-900 text-sm">Trapping Rain Water</h4>
              <p className="text-xs text-neutral-500">
                Compute trapped water using two pointers or monotonic stack in O(n) time.
              </p>
              <div className="text-[11px] text-neutral-400 font-medium">
                Not solved by anyone in group yet. Be the first!
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 1: CREATE GROUP MODAL */}
      {/* ========================================================= */}
      {showCreateGroupModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-neutral-200 max-h-[90vh] overflow-y-auto space-y-5 animate-scale-in">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-neutral-900 text-base">Create Practice Group</h3>
                  <p className="text-xs text-neutral-500">
                    Form a circle with your friends or create an official campus guild.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateGroupModal(false)}
                className="text-neutral-400 hover:text-neutral-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateGroup} className="space-y-4">
              {/* Group Type Selector */}
              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1.5">
                  Group Type &amp; Contest Rules
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setNewGroupType('friends')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      newGroupType === 'friends'
                        ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500/20'
                        : 'border-neutral-200 bg-white hover:border-neutral-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-neutral-900 flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-emerald-600" /> Friends Group
                      </span>
                      {newGroupType === 'friends' && (
                        <Check className="w-3.5 h-3.5 text-emerald-600 font-bold" />
                      )}
                    </div>
                    <p className="text-[11px] text-neutral-500 leading-tight">
                      <strong>Anyone can call contests</strong> and challenge selected friends anytime.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewGroupType('official')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      newGroupType === 'official'
                        ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/20'
                        : 'border-neutral-200 bg-white hover:border-neutral-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-neutral-900 flex items-center gap-1.5">
                        <Shield className="w-3.5 h-3.5 text-indigo-600" /> Official Guild
                      </span>
                      {newGroupType === 'official' && (
                        <Check className="w-3.5 h-3.5 text-indigo-600 font-bold" />
                      )}
                    </div>
                    <p className="text-[11px] text-neutral-500 leading-tight">
                      <strong>Only group leader</strong> can schedule and create contests.
                    </p>
                  </button>
                </div>
              </div>

              {/* Group Name */}
              <Input
                label="Group Name"
                placeholder="e.g. CodeForces Grinders, BMSCE Algorists"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                required
              />

              {/* Description */}
              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1">
                  Description / Purpose
                </label>
                <textarea
                  rows={2}
                  value={newGroupDescription}
                  onChange={(e) => setNewGroupDescription(e.target.value)}
                  placeholder="What is the goal of this practice group?"
                  className="w-full text-sm border border-neutral-200 rounded-lg p-2.5 bg-white text-neutral-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              {/* Invite Initial Friends */}
              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1.5">
                  Add Friends to Group
                </label>
                <div className="space-y-1.5 max-h-36 overflow-y-auto border border-neutral-200 rounded-lg p-2 bg-neutral-50">
                  {AVAILABLE_PEERS.map((peer) => {
                    const isChecked = selectedInitialFriends.includes(peer.id);
                    return (
                      <label
                        key={peer.id}
                        className="flex items-center justify-between p-2 rounded-md hover:bg-white transition-colors cursor-pointer text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {
                              if (isChecked) {
                                setSelectedInitialFriends(
                                  selectedInitialFriends.filter((id) => id !== peer.id)
                                );
                              } else {
                                setSelectedInitialFriends([...selectedInitialFriends, peer.id]);
                              }
                            }}
                            className="rounded text-brand-600 focus:ring-brand-500"
                          />
                          <span className="font-medium text-neutral-900">{peer.name}</span>
                          <span className="text-neutral-400 font-mono">(@{peer.username})</span>
                        </div>
                        <span className="text-[10px] text-neutral-500">{peer.solvedCount} solved</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateGroupModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-brand-600 hover:bg-brand-700 text-white font-semibold"
                >
                  Create Group
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: CALL / LAUNCH CONTEST MODAL */}
      {/* ========================================================= */}
      {showCallContestModal && selectedGroupForContest && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-neutral-200 max-h-[90vh] overflow-y-auto space-y-5 animate-scale-in">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Swords className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-neutral-900 text-base">
                    Call Contest in {selectedGroupForContest.name}
                  </h3>
                  <p className="text-xs text-neutral-500">
                    {selectedGroupForContest.type === 'friends'
                      ? 'In a Friends Group, any member can call a contest and select specific peers.'
                      : 'Hosting official contest as Guild Leader.'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCallContestModal(false)}
                className="text-neutral-400 hover:text-neutral-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCallContestSubmit} className="space-y-4">
              <Input
                label="Contest Title"
                value={contestTitle}
                onChange={(e) => setContestTitle(e.target.value)}
                required
              />

              {/* Duration Selector */}
              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1.5">
                  Contest Duration
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[30, 45, 60, 90].map((mins) => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => setContestDuration(mins)}
                      className={`py-2 text-xs font-semibold rounded-lg border text-center transition-all cursor-pointer ${
                        contestDuration === mins
                          ? 'border-brand-600 bg-brand-50 text-brand-700 font-bold'
                          : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300'
                      }`}
                    >
                      {mins} mins
                    </button>
                  ))}
                </div>
              </div>

              {/* Target Participants: All vs Select Specific People */}
              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1.5">
                  Who do you want to challenge?
                </label>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => setContestTargetType('all')}
                    className={`py-2 px-3 text-xs font-semibold rounded-lg border text-left cursor-pointer ${
                      contestTargetType === 'all'
                        ? 'border-brand-600 bg-brand-50 text-brand-700 font-bold'
                        : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300'
                    }`}
                  >
                    All Group Members ({selectedGroupForContest.members.length})
                  </button>

                  <button
                    type="button"
                    onClick={() => setContestTargetType('selected_friends')}
                    className={`py-2 px-3 text-xs font-semibold rounded-lg border text-left cursor-pointer ${
                      contestTargetType === 'selected_friends'
                        ? 'border-brand-600 bg-brand-50 text-brand-700 font-bold'
                        : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300'
                    }`}
                  >
                    Select Specific Friends
                  </button>
                </div>

                {/* Specific Members Checkboxes */}
                {contestTargetType === 'selected_friends' && (
                  <div className="border border-neutral-200 rounded-lg p-2.5 bg-neutral-50 space-y-1.5 max-h-36 overflow-y-auto">
                    <p className="text-[11px] text-neutral-500 font-medium mb-1">
                      Pick group members you want to call out:
                    </p>
                    {selectedGroupForContest.members
                      .filter((m) => m.id !== currentUserId)
                      .map((member) => {
                        const isChecked = selectedTargetFriends.includes(member.name);
                        return (
                          <label
                            key={member.id}
                            className="flex items-center justify-between p-1.5 rounded-md hover:bg-white transition-colors cursor-pointer text-xs"
                          >
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => {
                                  if (isChecked) {
                                    setSelectedTargetFriends(
                                      selectedTargetFriends.filter((n) => n !== member.name)
                                    );
                                  } else {
                                    setSelectedTargetFriends([
                                      ...selectedTargetFriends,
                                      member.name,
                                    ]);
                                  }
                                }}
                                className="rounded text-brand-600 focus:ring-brand-500"
                              />
                              <span className="font-semibold text-neutral-800">{member.name}</span>
                              <span className="text-neutral-400 font-mono">(@{member.username})</span>
                            </div>
                            <span
                              className={`w-2 h-2 rounded-full ${
                                member.status === 'online' ? 'bg-emerald-500' : 'bg-neutral-300'
                              }`}
                            />
                          </label>
                        );
                      })}
                  </div>
                )}
              </div>

              {/* Number of Problems */}
              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1">
                  Problems in Contest
                </label>
                <select
                  value={selectedProblemCount}
                  onChange={(e) => setSelectedProblemCount(Number(e.target.value))}
                  className="w-full text-sm border border-neutral-200 rounded-lg p-2.5 bg-white text-neutral-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value={2}>2 Problems (Sprint / Speedrun)</option>
                  <option value={3}>3 Problems (Standard Bi-Weekly format)</option>
                  <option value={4}>4 Problems (Collegiate Hackathon)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCallContestModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                  icon={<Swords className="w-4 h-4" />}
                >
                  Launch Contest
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: LEADER-ONLY RESTRICTION NOTICE */}
      {/* ========================================================= */}
      {showLeaderRestrictedModal && restrictedGroupInfo && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-neutral-200 space-y-4 animate-scale-in text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
              <Lock className="w-6 h-6" />
            </div>

            <div className="space-y-1.5">
              <h3 className="font-bold text-neutral-900 text-lg">Leader-Only Permission</h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                In <strong>Official Campus Guilds</strong> ({restrictedGroupInfo.name}), only the designated Group Leader (
                <strong className="text-neutral-800">{restrictedGroupInfo.leaderName}</strong>) can schedule and create contests.
              </p>
            </div>

            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs text-neutral-600 text-left space-y-1">
              <div className="font-semibold text-neutral-800">💡 How to compete with friends:</div>
              <ul className="list-disc list-inside space-y-0.5 text-neutral-500">
                <li>Create a <strong>Friends Group</strong> where any member can call contests anytime.</li>
                <li>Or request <strong>{restrictedGroupInfo.leaderName}</strong> to schedule an official clash.</li>
              </ul>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setShowLeaderRestrictedModal(false)}
              >
                Understood
              </Button>
              <Button
                onClick={() => {
                  setShowLeaderRestrictedModal(false);
                  setShowCreateGroupModal(true);
                }}
                className="bg-brand-600 hover:bg-brand-700 text-white font-semibold"
                icon={<Plus className="w-4 h-4" />}
              >
                Create Friends Group
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 4: PRACTICE ROOM VIEW */}
      {/* ========================================================= */}
      {activePracticeGroup && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-5 sm:p-6 shadow-2xl border border-neutral-200 max-h-[90vh] overflow-y-auto space-y-5 animate-scale-in">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-neutral-900 text-base">
                    {activePracticeGroup.name} — Practice Room
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Collaborative problem solving and shared practice track.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActivePracticeGroup(null)}
                className="text-neutral-400 hover:text-neutral-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Group Members in room */}
            <div>
              <div className="text-xs font-semibold text-neutral-700 mb-2">Active in room:</div>
              <div className="flex flex-wrap gap-2">
                {activePracticeGroup.members.map((m) => (
                  <span
                    key={m.id}
                    className="text-xs px-2.5 py-1 rounded-lg bg-neutral-50 border border-neutral-200 flex items-center gap-1.5"
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        m.status === 'online' ? 'bg-emerald-500' : 'bg-neutral-300'
                      }`}
                    />
                    <span className="font-medium text-neutral-800">{m.name}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Practice Recommendations */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-neutral-700">Recommended for this group:</div>
              <div className="space-y-2">
                {curatedProblemsCatalog.slice(0, 3).map((problem) => (
                  <div
                    key={problem.id}
                    className="p-3 rounded-xl border border-neutral-200 hover:border-brand-300 bg-neutral-50 flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="text-xs font-bold text-neutral-900">{problem.title}</div>
                      <div className="text-[11px] text-neutral-500">{problem.category} • {problem.difficulty}</div>
                    </div>
                    <Link href={`/problems?q=${encodeURIComponent(problem.title)}`}>
                      <Button size="sm" variant="outline" className="text-xs">
                        Solve
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
              <Button
                variant="outline"
                onClick={() => setActivePracticeGroup(null)}
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  const grp = activePracticeGroup;
                  setActivePracticeGroup(null);
                  handleInitiateContest(grp);
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs"
                icon={<Swords className="w-3.5 h-3.5" />}
              >
                Call Contest from here
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}