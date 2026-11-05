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
  Trash2,
  LogOut,
  Clock,
  CheckCircle2,
  AlertCircle,
  Search,
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
  membershipStatus?: 'active' | 'pending';
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

interface RegisteredUser {
  id: string;
  name: string;
  username: string;
  college?: string;
  avatarUrl?: string | null;
}

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string>('current-user-id');
  const [currentUserName, setCurrentUserName] = useState<string>('Developer');
  const [currentUserHandle, setCurrentUserHandle] = useState<string>('developer');

  // Modals
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedGroupForInvite, setSelectedGroupForInvite] = useState<Group | null>(null);
  const [inviteSearch, setInviteSearch] = useState('');
  const [selectedUserToInvite, setSelectedUserToInvite] = useState<RegisteredUser | null>(null);
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
  const [selectedInitialUsers, setSelectedInitialUsers] = useState<RegisteredUser[]>([]);
  const [initialUserSearch, setInitialUserSearch] = useState('');

  const { toast } = useToast();

  // Load User, Groups & Registered accounts
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

    async function fetchSupabaseData() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        let uid = 'current-user-id';
        let uname = 'developer';
        let dname = 'Developer';

        if (user) {
          uid = user.id;
          setCurrentUserId(user.id);
          dname =
            user.user_metadata?.full_name ||
            user.user_metadata?.name ||
            user.user_metadata?.display_name ||
            user.email?.split('@')[0] ||
            'Developer';
          uname =
            user.user_metadata?.user_name ||
            user.user_metadata?.preferred_username ||
            user.email?.split('@')[0] ||
            'developer';
          setCurrentUserName(dname);
          setCurrentUserHandle(uname);
        }

        // Fetch all registered users from profiles table so only existing members can be invited
        const { data: dbProfiles } = await supabase
          .from('profiles')
          .select('id, display_name, username, college, avatar_url')
          .order('display_name', { ascending: true });

        if (dbProfiles && dbProfiles.length > 0) {
          const mappedUsers: RegisteredUser[] = dbProfiles.map((p) => ({
            id: p.id,
            name: p.display_name || p.username || 'Developer',
            username: p.username || 'dev',
            college: p.college || 'Engineering Institute',
            avatarUrl: p.avatar_url,
          }));
          setRegisteredUsers(mappedUsers);
        } else {
          // Fallback initial registered accounts
          setRegisteredUsers([
            { id: uid, name: dname, username: uname, college: 'Engineering Institute' },
          ]);
        }

        // Fetch groups
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
            leaderName: g.leader_id === uid ? dname : 'Group Leader',
            topics: g.practice_topics || ['Algorithms'],
            members: [
              {
                id: uid,
                name: dname,
                username: uname,
                role: g.leader_id === uid ? 'leader' : 'member',
                status: 'online',
                solvedCount: 0,
                membershipStatus: 'active',
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
    fetchSupabaseData();
  }, []);

  const saveGroups = (updated: Group[]) => {
    setGroups(updated);
    try {
      localStorage.setItem('mergegrid_groups', JSON.stringify(updated));
    } catch {
      // Ignore
    }
  };

  // Create Group with real existing members (Pending approval)
  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;

    const invitedMembersList: GroupMember[] = selectedInitialUsers
      .filter((u) => u.id !== currentUserId && u.username !== currentUserHandle)
      .map((u) => ({
        id: u.id,
        name: u.name,
        username: u.username,
        role: 'member',
        status: 'online',
        solvedCount: 0,
        membershipStatus: 'pending', // Requires approval
      }));

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
          membershipStatus: 'active',
        },
        ...invitedMembersList,
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
    setSelectedInitialUsers([]);

    toast({
      type: 'success',
      title: 'Group Formed!',
      message: `"${newGroup.name}" created. Invitations sent to ${invitedMembersList.length} member(s) for approval.`,
    });
  };

  // Invite Existing Member (Approval Workflow)
  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGroupForInvite || !selectedUserToInvite) {
      toast({ type: 'error', title: 'Please select an existing registered user' });
      return;
    }

    // Check if already in group
    const alreadyIn = selectedGroupForInvite.members.some(
      (m) => m.id === selectedUserToInvite.id || m.username.toLowerCase() === selectedUserToInvite.username.toLowerCase()
    );
    if (alreadyIn) {
      toast({ type: 'info', title: 'Already in group', message: `@${selectedUserToInvite.username} is already in this group.` });
      return;
    }

    const newMember: GroupMember = {
      id: selectedUserToInvite.id,
      name: selectedUserToInvite.name,
      username: selectedUserToInvite.username,
      role: 'member',
      status: 'online',
      solvedCount: 0,
      membershipStatus: 'pending', // Requires member's approval
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
    setSelectedUserToInvite(null);
    setInviteSearch('');

    toast({
      type: 'success',
      title: 'Invitation Sent! ✉️',
      message: `Invited @${selectedUserToInvite.username} to join "${selectedGroupForInvite.name}". Awaiting their approval.`,
    });
  };

  // Approve / Accept Invitation
  const handleAcceptInvite = (groupId: string) => {
    const updated = groups.map((g) => {
      if (g.id === groupId) {
        return {
          ...g,
          members: g.members.map((m) =>
            m.id === currentUserId || m.username.toLowerCase() === currentUserHandle.toLowerCase()
              ? { ...m, membershipStatus: 'active' as const }
              : m
          ),
        };
      }
      return g;
    });

    saveGroups(updated);
    toast({
      type: 'success',
      title: 'Invitation Accepted! 🎉',
      message: 'You have joined the group. You can now access practice rooms and clashes.',
    });
  };

  // Decline Invitation
  const handleDeclineInvite = (groupId: string) => {
    const updated = groups.map((g) => {
      if (g.id === groupId) {
        return {
          ...g,
          members: g.members.filter(
            (m) => m.id !== currentUserId && m.username.toLowerCase() !== currentUserHandle.toLowerCase()
          ),
        };
      }
      return g;
    });

    saveGroups(updated);
    toast({
      type: 'info',
      title: 'Invitation Declined',
      message: 'You declined the group invitation.',
    });
  };

  // Delete Group (Leader Only)
  const handleDeleteGroup = async (groupId: string, groupName: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${groupName}"? This cannot be undone.`)) {
      return;
    }

    const updated = groups.filter((g) => g.id !== groupId);
    saveGroups(updated);

    try {
      const supabase = createClient();
      await supabase.from('groups').delete().eq('id', groupId);
    } catch {
      // Ignore
    }

    toast({
      type: 'info',
      title: 'Group Deleted',
      message: `"${groupName}" has been removed.`,
    });
  };

  // Exit / Leave Group
  const handleExitGroup = (groupId: string, groupName: string) => {
    if (!window.confirm(`Are you sure you want to leave "${groupName}"?`)) {
      return;
    }

    const updated = groups.map((g) => {
      if (g.id === groupId) {
        return {
          ...g,
          members: g.members.filter(
            (m) => m.id !== currentUserId && m.username.toLowerCase() !== currentUserHandle.toLowerCase()
          ),
        };
      }
      return g;
    });

    saveGroups(updated);
    toast({
      type: 'info',
      title: 'Left Group',
      message: `You have left "${groupName}".`,
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
      group.members
        .filter((m) => m.id !== currentUserId && m.membershipStatus === 'active')
        .map((m) => m.name)
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
      status: 'live' as const,
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

  // Find incoming pending invitations for the logged-in user
  const pendingInvitations = groups.filter((g) =>
    g.members.some(
      (m) =>
        (m.id === currentUserId || m.username.toLowerCase() === currentUserHandle.toLowerCase()) &&
        m.membershipStatus === 'pending'
    )
  );

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

      {/* Pending Invitations Approval Banner */}
      {pendingInvitations.length > 0 && (
        <Card className="p-4 sm:p-5 bg-amber-50/70 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800/60 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 mt-0.5">
              <Clock className="w-5 h-5" />
            </div>
            <div className="flex-1 space-y-2">
              <div>
                <h3 className="font-bold text-neutral-900 dark:text-[#eff1f6] text-sm flex items-center gap-2">
                  Incoming Group Invitations ({pendingInvitations.length})
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-300 mt-0.5">
                  You have been invited to join the following practice circles. Please approve or decline:
                </p>
              </div>

              <div className="space-y-2 pt-1">
                {pendingInvitations.map((grp) => (
                  <div
                    key={grp.id}
                    className="p-3 rounded-xl bg-white dark:bg-[#202020] border border-amber-200 dark:border-amber-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <span className="font-bold text-neutral-900 dark:text-[#eff1f6] text-sm">
                        {grp.name}
                      </span>
                      <span className="text-xs text-neutral-500 dark:text-neutral-400 ml-2">
                        • Leader: {grp.leaderName} ({grp.type === 'friends' ? 'Friends Group' : 'Official Guild'})
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleAcceptInvite(grp.id)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs"
                        icon={<Check className="w-3.5 h-3.5" />}
                      >
                        Accept &amp; Join
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeclineInvite(grp.id)}
                        className="text-xs text-neutral-600 dark:text-neutral-400 hover:text-rose-600"
                        icon={<X className="w-3.5 h-3.5" />}
                      >
                        Decline
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Groups List */}
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
            const isMember = group.members.some(
              (m) =>
                (m.id === currentUserId || m.username.toLowerCase() === currentUserHandle.toLowerCase()) &&
                m.membershipStatus === 'active'
            );
            const activeMembers = group.members.filter((m) => m.membershipStatus !== 'pending');
            const pendingMembers = group.members.filter((m) => m.membershipStatus === 'pending');

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

                    {/* Delete or Leave Group Actions */}
                    <div className="flex items-center gap-1.5">
                      {isLeader ? (
                        <button
                          type="button"
                          onClick={() => handleDeleteGroup(group.id, group.name)}
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                          title="Delete Group (Leader Action)"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      ) : isMember ? (
                        <button
                          type="button"
                          onClick={() => handleExitGroup(group.id, group.name)}
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                          title="Exit Group"
                        >
                          <LogOut className="w-4 h-4" />
                        </button>
                      ) : null}
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
                        Members ({activeMembers.length})
                        {pendingMembers.length > 0 && (
                          <span className="text-amber-600 dark:text-amber-400 font-normal ml-1">
                            +{pendingMembers.length} invited
                          </span>
                        )}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedGroupForInvite(group);
                          setShowInviteModal(true);
                        }}
                        className="text-brand-600 dark:text-brand-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <UserPlus className="w-3.5 h-3.5" /> Invite Member
                      </button>
                    </div>

                    <div className="flex items-center gap-2 overflow-x-auto py-1">
                      {/* Active members */}
                      {activeMembers.map((m) => (
                        <div
                          key={m.id}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-50 border border-neutral-200 dark:bg-[#202020] dark:border-[#383838] text-xs shrink-0"
                          title={`${m.name} (@${m.username}) - Active Member`}
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

                      {/* Pending invitations */}
                      {pendingMembers.map((m) => (
                        <div
                          key={m.id}
                          className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-amber-50/70 border border-amber-200 dark:bg-amber-950/30 dark:border-amber-900/50 text-[11px] shrink-0 text-amber-800 dark:text-amber-300"
                          title={`Invited: Awaiting @${m.username}'s approval`}
                        >
                          <Clock className="w-3 h-3 text-amber-500 animate-pulse" />
                          <span>{m.name}</span>
                          <span className="text-[9px] uppercase tracking-wider font-semibold opacity-75">(Pending)</span>
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

      {/* ========================================================= */}
      {/* MODAL 1: CREATE GROUP MODAL WITH EXISTING MEMBERS SELECTION */}
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
                  <h3 className="font-bold text-neutral-900 dark:text-[#eff1f6] text-base">Create Practice Group</h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Invite registered peers. They will receive an invitation to approve.
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
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                  Group Type &amp; Contest Rules
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setNewGroupType('friends')}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      newGroupType === 'friends'
                        ? 'border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/20 ring-2 ring-emerald-500/20'
                        : 'border-neutral-200 dark:border-[#383838] bg-white dark:bg-[#202020] hover:border-neutral-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-neutral-900 dark:text-[#eff1f6] flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-emerald-600" /> Friends Group
                      </span>
                      {newGroupType === 'friends' && <Check className="w-3.5 h-3.5 text-emerald-600 font-bold" />}
                    </div>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-tight">
                      <strong>Anyone can call contests</strong> and challenge peers anytime.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewGroupType('official')}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      newGroupType === 'official'
                        ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/20 ring-2 ring-indigo-500/20'
                        : 'border-neutral-200 dark:border-[#383838] bg-white dark:bg-[#202020] hover:border-neutral-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-neutral-900 dark:text-[#eff1f6] flex items-center gap-1.5">
                        <Shield className="w-3.5 h-3.5 text-indigo-600" /> Official Guild
                      </span>
                      {newGroupType === 'official' && <Check className="w-3.5 h-3.5 text-indigo-600 font-bold" />}
                    </div>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-tight">
                      <strong>Leader schedules contests</strong> for campus competitions.
                    </p>
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                  Group Name
                </label>
                <Input
                  placeholder="e.g. Dynamic Programming Masters"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                  Description
                </label>
                <textarea
                  placeholder="Describe your practice targets, patterns you are grinding, or contest schedule..."
                  value={newGroupDescription}
                  onChange={(e) => setNewGroupDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border text-xs bg-white dark:bg-[#202020] text-neutral-900 dark:text-neutral-100 border-neutral-300 dark:border-[#383838] min-h-[64px]"
                />
              </div>

              {/* Select Existing Members to Invite */}
              <div>
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                  Invite Existing Registered Members (Approval Required)
                </label>
                <div className="relative mb-2">
                  <Input
                    placeholder="Search registered members by name or @username..."
                    value={initialUserSearch}
                    onChange={(e) => setInitialUserSearch(e.target.value)}
                    icon={<Search className="w-3.5 h-3.5 text-neutral-400" />}
                  />
                </div>

                <div className="max-h-36 overflow-y-auto border border-neutral-200 dark:border-[#383838] rounded-xl p-1 space-y-1">
                  {registeredUsers
                    .filter(
                      (u) =>
                        u.id !== currentUserId &&
                        (u.name.toLowerCase().includes(initialUserSearch.toLowerCase()) ||
                          u.username.toLowerCase().includes(initialUserSearch.toLowerCase()))
                    )
                    .map((user) => {
                      const isSelected = selectedInitialUsers.some((u) => u.id === user.id);
                      return (
                        <div
                          key={user.id}
                          onClick={() => {
                            if (isSelected) {
                              setSelectedInitialUsers((prev) => prev.filter((u) => u.id !== user.id));
                            } else {
                              setSelectedInitialUsers((prev) => [...prev, user]);
                            }
                          }}
                          className={`flex items-center justify-between p-2 rounded-lg text-xs cursor-pointer transition-colors ${
                            isSelected
                              ? 'bg-brand-50 dark:bg-brand-950/30 text-brand-700 dark:text-brand-300 font-semibold'
                              : 'hover:bg-neutral-100 dark:hover:bg-[#333333] text-neutral-800 dark:text-neutral-200'
                          }`}
                        >
                          <div>
                            <span>{user.name}</span>
                            <span className="text-[11px] text-neutral-400 dark:text-neutral-500 ml-1.5 font-mono">
                              @{user.username}
                            </span>
                          </div>
                          {isSelected && <Check className="w-3.5 h-3.5 text-brand-600" />}
                        </div>
                      );
                    })}
                </div>
                {selectedInitialUsers.length > 0 && (
                  <p className="text-[11px] text-neutral-500 mt-1">
                    {selectedInitialUsers.length} member(s) selected. They must approve your invitation to activate membership.
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-neutral-100 dark:border-[#383838] flex items-center justify-end gap-2.5">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateGroupModal(false)}
                  className="text-xs dark:bg-[#202020] dark:border-[#383838] dark:text-neutral-300"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-sm"
                >
                  Create &amp; Send Invites
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: INVITE MEMBER MODAL (ONLY EXISTING REGISTERED USERS) */}
      {/* ========================================================= */}
      {showInviteModal && selectedGroupForInvite && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white dark:bg-[#282828] rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-neutral-200 dark:border-[#383838] space-y-4 animate-scale-in">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-[#383838] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-neutral-900 dark:text-[#eff1f6] text-base">Invite Member</h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    To &quot;{selectedGroupForInvite.name}&quot;
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowInviteModal(false);
                  setSelectedUserToInvite(null);
                  setInviteSearch('');
                }}
                className="text-neutral-400 hover:text-neutral-700 dark:hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleInviteSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                  Search Registered Member
                </label>
                <Input
                  placeholder="Search by name or @handle..."
                  value={inviteSearch}
                  onChange={(e) => setInviteSearch(e.target.value)}
                  icon={<Search className="w-3.5 h-3.5 text-neutral-400" />}
                  autoFocus
                />
              </div>

              {/* Autocomplete of Real Existing Members */}
              <div className="max-h-48 overflow-y-auto border border-neutral-200 dark:border-[#383838] rounded-xl p-1 space-y-1">
                {registeredUsers
                  .filter(
                    (u) =>
                      u.id !== currentUserId &&
                      (u.name.toLowerCase().includes(inviteSearch.toLowerCase()) ||
                        u.username.toLowerCase().includes(inviteSearch.toLowerCase()))
                  )
                  .map((user) => {
                    const isSelected = selectedUserToInvite?.id === user.id;
                    const alreadyInGroup = selectedGroupForInvite.members.some(
                      (m) => m.id === user.id || m.username.toLowerCase() === user.username.toLowerCase()
                    );

                    return (
                      <div
                        key={user.id}
                        onClick={() => {
                          if (!alreadyInGroup) setSelectedUserToInvite(user);
                        }}
                        className={`flex items-center justify-between p-2.5 rounded-lg text-xs transition-colors ${
                          alreadyInGroup
                            ? 'opacity-40 cursor-not-allowed bg-neutral-50 dark:bg-[#202020]'
                            : isSelected
                            ? 'bg-brand-50 dark:bg-brand-950/30 text-brand-700 dark:text-brand-300 font-semibold cursor-pointer'
                            : 'hover:bg-neutral-100 dark:hover:bg-[#333333] text-neutral-800 dark:text-neutral-200 cursor-pointer'
                        }`}
                      >
                        <div>
                          <div className="font-semibold">{user.name}</div>
                          <div className="text-[11px] text-neutral-400 font-mono">@{user.username}</div>
                        </div>
                        {alreadyInGroup ? (
                          <span className="text-[10px] text-neutral-500 font-medium">Already in group</span>
                        ) : isSelected ? (
                          <Check className="w-4 h-4 text-brand-600" />
                        ) : null}
                      </div>
                    );
                  })}
              </div>

              {selectedUserToInvite && (
                <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 text-xs text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
                  <span>Selected: <strong>{selectedUserToInvite.name}</strong> (@{selectedUserToInvite.username})</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
              )}

              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                ⚠️ Note: The user will receive an approval notification. They must accept before joining the circle.
              </p>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowInviteModal(false);
                    setSelectedUserToInvite(null);
                  }}
                  className="text-xs dark:bg-[#202020] dark:border-[#383838] dark:text-neutral-300"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!selectedUserToInvite}
                  className="bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs disabled:opacity-50"
                  icon={<UserPlus className="w-3.5 h-3.5" />}
                >
                  Send Invitation
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: CALL CONTEST MODAL */}
      {showCallContestModal && selectedGroupForContest && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white dark:bg-[#282828] rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-neutral-200 dark:border-[#383838] space-y-4 animate-scale-in">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-[#383838] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Swords className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-neutral-900 dark:text-[#eff1f6] text-base">Call Contest / Clash</h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Host a challenge for &quot;{selectedGroupForContest.name}&quot;
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
              <div>
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                  Contest Title
                </label>
                <Input
                  value={contestTitle}
                  onChange={(e) => setContestTitle(e.target.value)}
                  placeholder="e.g. 1v1 Binary Tree Sprint"
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
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                    Problems Count
                  </label>
                  <select
                    value={selectedProblemCount}
                    onChange={(e) => setSelectedProblemCount(Number(e.target.value))}
                    className="w-full h-10 px-3 rounded-lg border text-xs bg-white dark:bg-[#202020] text-neutral-900 dark:text-neutral-100 border-neutral-300 dark:border-[#383838]"
                  >
                    <option value={1}>1 Problem Clash</option>
                    <option value={2}>2 Problems</option>
                    <option value={3}>3 Problems (Standard)</option>
                    <option value={4}>4 Problems</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCallContestModal(false)}
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

      {/* MODAL 4: LEADER RESTRICTED MODAL */}
      {showLeaderRestrictedModal && restrictedGroupInfo && (
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
                In official campus guilds like &quot;<strong>{restrictedGroupInfo.name}</strong>&quot;, only the designated group leader can schedule and host official contests.
              </p>
            </div>
            <div className="pt-2 flex items-center justify-center gap-2">
              <Button
                variant="outline"
                onClick={() => setShowLeaderRestrictedModal(false)}
                className="text-xs dark:bg-[#202020] dark:border-[#383838] dark:text-neutral-300"
              >
                Understood
              </Button>
              <Button
                onClick={() => {
                  setShowLeaderRestrictedModal(false);
                  setShowCreateGroupModal(true);
                  setNewGroupType('friends');
                }}
                className="bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs"
              >
                Create Friends Group
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* PRACTICE ROOM MODAL */}
      {activePracticeGroup && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white dark:bg-[#282828] rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-neutral-200 dark:border-[#383838] space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-[#383838] pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-[#242c3d] text-brand-600 dark:text-brand-400 flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-neutral-900 dark:text-[#eff1f6] text-base">
                    {activePracticeGroup.name} • Practice Room
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Collaborative study problems curated for your group focus.
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

            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                Recommended Pattern Problems
              </h4>
              <div className="space-y-2">
                {curatedProblemsCatalog.slice(0, 4).map((p) => (
                  <div
                    key={p.id}
                    className="p-3.5 rounded-xl border border-neutral-200 dark:border-[#383838] bg-neutral-50/50 dark:bg-[#202020] flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="font-bold text-xs text-neutral-900 dark:text-[#eff1f6] flex items-center gap-2">
                        <span>{p.title}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.2 rounded-full ${
                            p.difficulty === 'Easy'
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400'
                              : p.difficulty === 'Medium'
                              ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400'
                              : 'bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400'
                          }`}
                        >
                          {p.difficulty}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                        {p.category} • {p.acceptance} acceptance
                      </p>
                    </div>

                    <Link href={`/problems?search=${encodeURIComponent(p.title)}`}>
                      <Button size="sm" className="bg-brand-600 hover:bg-brand-700 text-white text-xs">
                        Solve <Code2 className="w-3.5 h-3.5 ml-1" />
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
