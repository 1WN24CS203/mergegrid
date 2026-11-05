'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  UserPlus,
  Swords,
  Plus,
  Shield,
  BookOpen,
  Check,
  X,
  Target,
  Sparkles,
  Lock,
  Code2,
  Calendar,
  Flame,
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

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string>('current-user-id');
  const [currentUserName, setCurrentUserName] = useState<string>('Developer');
  const [currentUserHandle, setCurrentUserHandle] = useState<string>('developer');

  // Modals
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedGroupForInvite, setSelectedGroupForInvite] = useState<Group | null>(null);
  const [inviteUsername, setInviteUsername] = useState('');
  const [activePracticeGroup, setActivePracticeGroup] = useState<Group | null>(null);

  // Contest Calling from Group
  const [showCallContestModal, setShowCallContestModal] = useState(false);
  const [selectedGroupForContest, setSelectedGroupForContest] = useState<Group | null>(null);
  const [showLeaderRestrictedModal, setShowLeaderRestrictedModal] = useState(false);
  const [restrictedGroupInfo, setRestrictedGroupInfo] = useState<Group | null>(null);
  const [contestTitle, setContestTitle] = useState('');
  const [contestDuration, setContestDuration] = useState<number>(60);
  const [contestTargetType, setContestTargetType] = useState<'all' | 'selected_friends'>('all');
  const [selectedTargetFriends, setSelectedTargetFriends] = useState<string[]>([]);
  const [selectedProblemCount, setSelectedProblemCount] = useState<number>(3);

  // Create Group Form State
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDescription, setNewGroupDescription] = useState('');
  const [newGroupType, setNewGroupType] = useState<'friends' | 'official'>('friends');
  const [newGroupTopics, setNewGroupTopics] = useState<string[]>(['Algorithms', 'Data Structures']);

  const { toast } = useToast();

  // Load User & Groups (strictly real data, zero dummy data)
  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem('mergegrid_user_profile');
      if (savedProfile) {
        const p = JSON.parse(savedProfile);
        if (p.displayName) setCurrentUserName(p.displayName);
        if (p.username) setCurrentUserHandle(p.username);
      }

      const savedGroups = localStorage.getItem('mergegrid_groups');
      if (savedGroups) {
        const parsed = JSON.parse(savedGroups);
        if (Array.isArray(parsed)) setGroups(parsed);
      }
    } catch {
      // Ignore
    }

    async function fetchSupabaseGroups() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setCurrentUserId(user.id);
          if (user.user_metadata?.full_name) setCurrentUserName(user.user_metadata.full_name);
          if (user.user_metadata?.user_name) setCurrentUserHandle(user.user_metadata.user_name);
        }

        const { data: dbGroups, error } = await supabase
          .from('groups')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && dbGroups && dbGroups.length > 0) {
          const mapped: Group[] = dbGroups.map((g: any) => ({
            id: g.id,
            name: g.name,
            slug: g.slug || g.name.toLowerCase().replace(/\s+/g, '-'),
            description: g.description || '',
            type: g.group_type || 'friends',
            leaderId: g.leader_id || '',
            leaderName: g.leader_id === user?.id ? currentUserName : 'Group Leader',
            topics: g.practice_topics || ['Algorithms'],
            members: [
              {
                id: user?.id || 'current-user-id',
                name: currentUserName,
                username: currentUserHandle,
                role: g.leader_id === user?.id ? 'leader' : 'member',
                status: 'online',
                solvedCount: 0,
              },
            ],
            createdAt: g.created_at,
          }));
          setGroups(mapped);
          localStorage.setItem('mergegrid_groups', JSON.stringify(mapped));
        }
      } catch {
        // Fallback to local storage
      }
    }
    fetchSupabaseGroups();
  }, []);

  const saveGroups = (updated: Group[]) => {
    setGroups(updated);
    try {
      localStorage.setItem('mergegrid_groups', JSON.stringify(updated));
    } catch {
      // Ignore
    }
  };

  // Create Group
  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;

    const newGroup: Group = {
      id: `grp-${Date.now()}`,
      name: newGroupName.trim(),
      slug: newGroupName.trim().toLowerCase().replace(/\s+/g, '-'),
      description: newGroupDescription.trim() || 'A circle for collaborative algorithmic practice.',
      type: newGroupType,
      leaderId: currentUserId,
      leaderName: currentUserName,
      topics: newGroupTopics.length > 0 ? newGroupTopics : ['Algorithms'],
      members: [
        {
          id: currentUserId,
          name: currentUserName,
          username: currentUserHandle,
          role: 'leader',
          status: 'online',
          solvedCount: 0,
        },
      ],
      createdAt: new Date().toISOString(),
    };

    const updated = [newGroup, ...groups];
    saveGroups(updated);

    // Save to Supabase if connected
    try {
      const supabase = createClient();
      await supabase.from('groups').insert({
        name: newGroup.name,
        slug: newGroup.slug,
        description: newGroup.description,
        group_type: newGroup.type,
        leader_id: currentUserId,
        practice_topics: newGroup.topics,
      });
    } catch {
      // Ignore
    }

    setShowCreateGroupModal(false);
    setNewGroupName('');
    setNewGroupDescription('');

    toast({
      type: 'success',
      title: 'Group Created!',
      message: `"${newGroup.name}" is now ready for collaborative practice and contests.`,
    });
  };

  // Invite Member
  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGroupForInvite || !inviteUsername.trim()) return;

    const newMember: GroupMember = {
      id: `user-${Date.now()}`,
      name: inviteUsername.trim(),
      username: inviteUsername.trim().toLowerCase().replace(/\s+/g, '_'),
      role: 'member',
      status: 'online',
      solvedCount: 0,
    };

    const updated = groups.map((g) => {
      if (g.id === selectedGroupForInvite.id) {
        return {
          ...g,
          members: [...g.members, newMember],
        };
      }
      return g;
    });

    saveGroups(updated);
    setShowInviteModal(false);
    setInviteUsername('');

    toast({
      type: 'success',
      title: 'Member Added!',
      message: `${newMember.name} has been added to ${selectedGroupForInvite.name}.`,
    });
  };

  // Contest Calling
  const handleInitiateContest = (group: Group) => {
    if (group.type !== 'friends') {
      const isLeader = group.leaderId === currentUserId;
      if (!isLeader) {
        setRestrictedGroupInfo(group);
        setShowLeaderRestrictedModal(true);
        return;
      }
    }

    setSelectedGroupForContest(group);
    setContestTitle(`${group.name} Clash #${Math.floor(Math.random() * 90 + 10)}`);
    setContestTargetType('all');
    setSelectedTargetFriends(
      group.members.filter((m) => m.id !== currentUserId).map((m) => m.name)
    );
    setShowCallContestModal(true);
  };

  const handleCallContestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGroupForContest || !contestTitle.trim()) return;

    const shuffled = [...curatedProblemsCatalog].sort(() => 0.5 - Math.random());
    const pickedProblems = shuffled.slice(0, selectedProblemCount);

    const newContest = {
      id: `contest-${Date.now()}`,
      title: contestTitle.trim(),
      description: `Targeted challenge called in ${selectedGroupForContest.name}.`,
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

    try {
      const existing = localStorage.getItem('mergegrid_contests');
      const parsed = existing ? JSON.parse(existing) : [];
      localStorage.setItem('mergegrid_contests', JSON.stringify([newContest, ...parsed]));
    } catch {
      // Ignore
    }

    setShowCallContestModal(false);
    toast({
      type: 'success',
      title: 'Contest Launched! 🏆',
      message: `"${newContest.title}" is now active in Contests Arena.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-[#eff1f6] tracking-tight flex items-center gap-2.5">
            Groups &amp; Practice Circles
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 dark:bg-[#333333] dark:text-brand-300 font-semibold border border-brand-200 dark:border-[#3e3e3e]">
              Collaborative Practice
            </span>
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Form friends groups to practice algorithm patterns, review each other&apos;s code, and call spontaneous coding clashes.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            onClick={() => setShowCreateGroupModal(true)}
            className="bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-sm"
            icon={<Plus className="w-4 h-4" />}
          >
            Create New Group
          </Button>
        </div>
      </div>

      {/* Zero State if No Groups Formed Yet */}
      {groups.length === 0 ? (
        <Card className="p-10 sm:p-14 text-center border-dashed border-2 border-neutral-200 dark:border-[#383838] bg-white dark:bg-[#282828]">
          <div className="w-16 h-16 rounded-2xl bg-brand-50 dark:bg-[#242c3d] text-brand-600 dark:text-brand-400 flex items-center justify-center mx-auto mb-4 border border-brand-200/80 dark:border-[#383838]">
            <Users className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-neutral-900 dark:text-[#eff1f6]">
            No Groups Formed Yet
          </h3>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-md mx-auto mt-2 leading-relaxed">
            Create your first Friends Group to practice interview patterns with your peers, solve daily curated problems, and call speedrun clashes.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Button
              onClick={() => setShowCreateGroupModal(true)}
              className="bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-sm"
              icon={<Plus className="w-4 h-4" />}
            >
              Create Your First Group
            </Button>
            <Link href="/problems">
              <Button variant="outline" className="text-sm dark:bg-[#202020] dark:border-[#383838] dark:text-neutral-300">
                Practice in Problem Arena
              </Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {groups.map((group) => {
            const isFriendsGroup = group.type === 'friends';
            const isLeader = group.leaderId === currentUserId;

            return (
              <Card
                key={group.id}
                className="p-5 flex flex-col justify-between hover:shadow-md transition-shadow border-neutral-200 dark:border-[#383838] bg-white dark:bg-[#282828]"
              >
                <div className="space-y-4">
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-base shadow-xs shrink-0 ${
                          isFriendsGroup
                            ? 'bg-emerald-50 text-emerald-600 dark:bg-[#00b8a3]/15 dark:text-[#00b8a3] border border-emerald-200 dark:border-[#00b8a3]/30'
                            : 'bg-indigo-50 text-indigo-600 dark:bg-[#6366f1]/15 dark:text-[#818cf8] border border-indigo-200 dark:border-[#6366f1]/30'
                        }`}
                      >
                        {isFriendsGroup ? <Users className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
                      </div>
                      <div>
                        <h3 className="font-bold text-neutral-900 dark:text-[#eff1f6] text-base">
                          {group.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Badge
                            variant="outline"
                            className={`text-[10px] font-bold uppercase ${
                              isFriendsGroup
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-[#00b8a3]/15 dark:text-[#00b8a3] dark:border-[#00b8a3]/30'
                                : 'bg-indigo-50 text-indigo-700 border-indigo-300 dark:bg-[#6366f1]/15 dark:text-[#818cf8] dark:border-[#6366f1]/30'
                            }`}
                          >
                            {isFriendsGroup ? 'Friends Group' : 'Official Guild'}
                          </Badge>
                          <span className="text-xs text-neutral-400 dark:text-neutral-500">• Leader: {group.leaderName}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    {group.description}
                  </p>

                  {/* Topics */}
                  <div>
                    <div className="text-[11px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-1.5">
                      Practice Focus
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {group.topics.map((t) => (
                        <span
                          key={t}
                          className="text-xs px-2.5 py-0.5 rounded-md bg-neutral-100 text-neutral-700 border border-neutral-200 dark:bg-[#333333] dark:border-[#3c3c3c] dark:text-neutral-300 font-medium"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Members */}
                  <div>
                    <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 mb-2">
                      <span className="font-semibold">
                        Members ({group.members.length})
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedGroupForInvite(group);
                          setShowInviteModal(true);
                        }}
                        className="text-brand-600 dark:text-brand-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <UserPlus className="w-3.5 h-3.5" /> Invite
                      </button>
                    </div>

                    <div className="flex items-center gap-2 overflow-x-auto py-1">
                      {group.members.map((m) => (
                        <div
                          key={m.id}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-50 border border-neutral-200 dark:bg-[#202020] dark:border-[#383838] text-xs shrink-0"
                        >
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span className="font-medium text-neutral-800 dark:text-neutral-200">{m.name}</span>
                          {m.role === 'leader' && (
                            <span className="text-[9px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-1 rounded">
                              Leader
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-5 pt-4 border-t border-neutral-100 dark:border-[#383838] flex items-center justify-between gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActivePracticeGroup(group)}
                    icon={<BookOpen className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />}
                    className="text-xs dark:bg-[#202020] dark:border-[#383838] dark:text-neutral-300"
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
                        : 'bg-neutral-100 dark:bg-[#333333] hover:bg-neutral-200 dark:hover:bg-[#3a3a3a] text-neutral-600 dark:text-neutral-400 border border-neutral-300 dark:border-[#3e3e3e]'
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
                      ? 'Call Contest / Clash'
                      : isLeader
                      ? 'Host Official Contest'
                      : 'Contest (Leader Only)'}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Informational Guidance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <Card className="p-4 bg-white dark:bg-[#282828] border border-neutral-200 dark:border-[#383838]">
          <div className="flex items-center gap-2.5 mb-1.5 text-neutral-900 dark:text-[#eff1f6] font-semibold text-sm">
            <Users className="w-4 h-4 text-emerald-600 dark:text-[#00b8a3]" /> Equal Friends Circles
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
            In Friends Groups, any member can call a speedrun clash and challenge specific group peers.
          </p>
        </Card>

        <Card className="p-4 bg-white dark:bg-[#282828] border border-neutral-200 dark:border-[#383838]">
          <div className="flex items-center gap-2.5 mb-1.5 text-neutral-900 dark:text-[#eff1f6] font-semibold text-sm">
            <Shield className="w-4 h-4 text-indigo-600 dark:text-[#818cf8]" /> Campus Guild Clashes
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
            Represent your engineering college or technical club. Only guild leaders schedule official matches.
          </p>
        </Card>

        <Card className="p-4 bg-white dark:bg-[#282828] border border-neutral-200 dark:border-[#383838]">
          <div className="flex items-center gap-2.5 mb-1.5 text-neutral-900 dark:text-[#eff1f6] font-semibold text-sm">
            <BookOpen className="w-4 h-4 text-brand-600 dark:text-brand-400" /> Collaborative Practice
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
            Practice core DSA patterns together and view collaborative solve rates on the Guild Leaderboard.
          </p>
        </Card>
      </div>

      {/* ========================================================= */}
      {/* MODAL 1: CREATE GROUP */}
      {/* ========================================================= */}
      {showCreateGroupModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white dark:bg-[#282828] rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-neutral-200 dark:border-[#383838] max-h-[90vh] overflow-y-auto space-y-5 animate-scale-in">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-[#383838] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-brand-50 dark:bg-[#242c3d] text-brand-600 dark:text-brand-400 flex items-center justify-center">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-neutral-900 dark:text-[#eff1f6] text-base">Create Group</h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Form a circle with your friends or establish an official campus guild.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateGroupModal(false)}
                className="text-neutral-400 hover:text-neutral-700 dark:hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateGroup} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1.5">
                  Group Type &amp; Contest Rules
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setNewGroupType('friends')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      newGroupType === 'friends'
                        ? 'border-emerald-600 bg-emerald-50/50 dark:bg-[#00b8a3]/10 ring-2 ring-emerald-500/20'
                        : 'border-neutral-200 dark:border-[#383838] bg-white dark:bg-[#202020]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-neutral-900 dark:text-[#eff1f6] flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-emerald-600 dark:text-[#00b8a3]" /> Friends Group
                      </span>
                      {newGroupType === 'friends' && (
                        <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-[#00b8a3] font-bold" />
                      )}
                    </div>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-tight">
                      <strong>Any member can call contests</strong> and challenge selected peers anytime.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewGroupType('official')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      newGroupType === 'official'
                        ? 'border-indigo-600 bg-indigo-50/50 dark:bg-[#6366f1]/10 ring-2 ring-indigo-500/20'
                        : 'border-neutral-200 dark:border-[#383838] bg-white dark:bg-[#202020]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-neutral-900 dark:text-[#eff1f6] flex items-center gap-1.5">
                        <Shield className="w-3.5 h-3.5 text-indigo-600 dark:text-[#818cf8]" /> Official Guild
                      </span>
                      {newGroupType === 'official' && (
                        <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-[#818cf8] font-bold" />
                      )}
                    </div>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-tight">
                      <strong>Only group leader</strong> can schedule and create official contests.
                    </p>
                  </button>
                </div>
              </div>

              <Input
                label="Group Name"
                placeholder="e.g. Algorithmic Speedrunners, BMSCE DSA Cell"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                required
              />

              <div>
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                  Description / Purpose
                </label>
                <textarea
                  rows={2}
                  value={newGroupDescription}
                  onChange={(e) => setNewGroupDescription(e.target.value)}
                  placeholder="What is the goal of this practice group?"
                  className="w-full text-sm border border-neutral-200 dark:border-[#383838] rounded-lg p-2.5 bg-white dark:bg-[#202020] text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-100 dark:border-[#383838]">
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
      {/* MODAL 2: INVITE MEMBER */}
      {/* ========================================================= */}
      {showInviteModal && selectedGroupForInvite && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white dark:bg-[#282828] rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-neutral-200 dark:border-[#383838] space-y-4 animate-scale-in">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-[#383838] pb-3">
              <h3 className="font-bold text-neutral-900 dark:text-[#eff1f6] text-base flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                Invite Member to {selectedGroupForInvite.name}
              </h3>
              <button onClick={() => setShowInviteModal(false)} className="text-neutral-400 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleInviteSubmit} className="space-y-4">
              <Input
                label="Peer Name or Username"
                placeholder="e.g. Sneha Patil or sneha_code"
                value={inviteUsername}
                onChange={(e) => setInviteUsername(e.target.value)}
                required
              />

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowInviteModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-brand-600 hover:bg-brand-700 text-white font-semibold"
                >
                  Add to Group
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: CALL / LAUNCH CONTEST */}
      {/* ========================================================= */}
      {showCallContestModal && selectedGroupForContest && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white dark:bg-[#282828] rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-neutral-200 dark:border-[#383838] max-h-[90vh] overflow-y-auto space-y-5 animate-scale-in">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-[#383838] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-[#00b8a3]/10 text-emerald-600 dark:text-[#00b8a3] flex items-center justify-center">
                  <Swords className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-neutral-900 dark:text-[#eff1f6] text-base">
                    Call Contest in {selectedGroupForContest.name}
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    {selectedGroupForContest.type === 'friends'
                      ? 'In a Friends Group, any member can call a contest and pick specific friends.'
                      : 'Hosting official contest as Guild Leader.'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCallContestModal(false)}
                className="text-neutral-400 hover:text-neutral-700 dark:hover:text-white p-1"
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

              <div>
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1.5">
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
                          ? 'border-brand-600 bg-brand-50 text-brand-700 dark:bg-[#333333] dark:border-brand-500/50 dark:text-brand-300 font-bold'
                          : 'border-neutral-200 dark:border-[#383838] bg-white dark:bg-[#202020] text-neutral-700 dark:text-neutral-300'
                      }`}
                    >
                      {mins} mins
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1.5">
                  Target Participants
                </label>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => setContestTargetType('all')}
                    className={`py-2 px-3 text-xs font-semibold rounded-lg border text-left cursor-pointer ${
                      contestTargetType === 'all'
                        ? 'border-brand-600 bg-brand-50 text-brand-700 dark:bg-[#333333] dark:border-brand-500/50 dark:text-brand-300 font-bold'
                        : 'border-neutral-200 dark:border-[#383838] bg-white dark:bg-[#202020] text-neutral-700 dark:text-neutral-300'
                    }`}
                  >
                    All Members ({selectedGroupForContest.members.length})
                  </button>

                  <button
                    type="button"
                    onClick={() => setContestTargetType('selected_friends')}
                    className={`py-2 px-3 text-xs font-semibold rounded-lg border text-left cursor-pointer ${
                      contestTargetType === 'selected_friends'
                        ? 'border-brand-600 bg-brand-50 text-brand-700 dark:bg-[#333333] dark:border-brand-500/50 dark:text-brand-300 font-bold'
                        : 'border-neutral-200 dark:border-[#383838] bg-white dark:bg-[#202020] text-neutral-700 dark:text-neutral-300'
                    }`}
                  >
                    Select Specific Friends
                  </button>
                </div>

                {contestTargetType === 'selected_friends' && (
                  <div className="border border-neutral-200 dark:border-[#383838] rounded-lg p-2.5 bg-neutral-50 dark:bg-[#202020] space-y-1.5 max-h-36 overflow-y-auto">
                    {selectedGroupForContest.members
                      .filter((m) => m.id !== currentUserId)
                      .map((member) => {
                        const isChecked = selectedTargetFriends.includes(member.name);
                        return (
                          <label
                            key={member.id}
                            className="flex items-center justify-between p-1.5 rounded-md hover:bg-white dark:hover:bg-[#282828] transition-colors cursor-pointer text-xs"
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
                              <span className="font-semibold text-neutral-800 dark:text-neutral-200">{member.name}</span>
                            </div>
                          </label>
                        );
                      })}
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                  Problems in Contest
                </label>
                <select
                  value={selectedProblemCount}
                  onChange={(e) => setSelectedProblemCount(Number(e.target.value))}
                  className="w-full text-sm border border-neutral-200 dark:border-[#383838] rounded-lg p-2.5 bg-white dark:bg-[#202020] text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value={2}>2 Problems (Sprint / Speedrun)</option>
                  <option value={3}>3 Problems (Standard Format)</option>
                  <option value={4}>4 Problems (Collegiate Hackathon)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-100 dark:border-[#383838]">
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
      {/* MODAL 4: LEADER RESTRICTION NOTICE */}
      {/* ========================================================= */}
      {showLeaderRestrictedModal && restrictedGroupInfo && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white dark:bg-[#282828] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-neutral-200 dark:border-[#383838] space-y-4 animate-scale-in text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto border border-amber-200 dark:border-amber-800/40">
              <Lock className="w-6 h-6" />
            </div>

            <div className="space-y-1.5">
              <h3 className="font-bold text-neutral-900 dark:text-[#eff1f6] text-lg">Leader-Only Permission</h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                In <strong>Official Campus Guilds</strong> ({restrictedGroupInfo.name}), only the designated Group Leader (
                <strong className="text-neutral-800 dark:text-neutral-200">{restrictedGroupInfo.leaderName}</strong>) can schedule and host contests.
              </p>
            </div>

            <div className="p-3 bg-neutral-50 dark:bg-[#202020] rounded-xl border border-neutral-200 dark:border-[#383838] text-xs text-neutral-600 dark:text-neutral-400 text-left space-y-1">
              <div className="font-semibold text-neutral-800 dark:text-neutral-200">💡 How to compete with friends:</div>
              <ul className="list-disc list-inside space-y-0.5 text-neutral-500 dark:text-neutral-400">
                <li>Create a <strong>Friends Group</strong> where any member can call contests anytime.</li>
                <li>Or ask <strong>{restrictedGroupInfo.leaderName}</strong> to schedule an official clash.</li>
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
      {/* MODAL 5: PRACTICE ROOM */}
      {/* ========================================================= */}
      {activePracticeGroup && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white dark:bg-[#282828] rounded-2xl max-w-xl w-full p-5 sm:p-6 shadow-2xl border border-neutral-200 dark:border-[#383838] max-h-[90vh] overflow-y-auto space-y-5 animate-scale-in">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-[#383838] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-brand-50 dark:bg-[#242c3d] text-brand-600 dark:text-brand-400 flex items-center justify-center">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-neutral-900 dark:text-[#eff1f6] text-base">
                    {activePracticeGroup.name} — Practice Room
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Collaborative problem solving and shared practice tracks.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActivePracticeGroup(null)}
                className="text-neutral-400 hover:text-neutral-700 dark:hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">Recommended for this group:</div>
              <div className="space-y-2">
                {curatedProblemsCatalog.slice(0, 3).map((problem) => (
                  <div
                    key={problem.id}
                    className="p-3 rounded-xl border border-neutral-200 dark:border-[#383838] hover:border-brand-300 bg-neutral-50 dark:bg-[#202020] flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="text-xs font-bold text-neutral-900 dark:text-[#eff1f6]">{problem.title}</div>
                      <div className="text-[11px] text-neutral-500 dark:text-neutral-400">{problem.category} • {problem.difficulty}</div>
                    </div>
                    <Link href={`/problems?q=${encodeURIComponent(problem.title)}`}>
                      <Button size="sm" variant="outline" className="text-xs dark:bg-[#282828] dark:border-[#383838] dark:text-neutral-300">
                        Solve
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-neutral-100 dark:border-[#383838]">
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
