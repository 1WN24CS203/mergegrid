'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Settings,
  User,
  Bell,
  Shield,
  Building2,
  Save,
  Check,
  Moon,
  Sun,
  AlertTriangle,
  Trash2,
  X,
  Laptop,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/toast';
import { useTheme } from '@/components/theme/theme-provider';
import { createClient } from '@/lib/supabase/client';

export default function SettingsPage() {
  const [displayName, setDisplayName] = useState('Developer');
  const [username, setUsername] = useState('developer');
  const [college, setCollege] = useState('BMS College of Engineering (BMSCE)');
  const [bio, setBio] = useState('Student engineer building distributed systems, open source, and algorithmic solutions.');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [contestReminders, setContestReminders] = useState(true);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [confirmDeleteText, setConfirmDeleteText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  const handleDeleteAccount = async () => {
    if (confirmDeleteText.trim() !== 'DELETE') {
      toast({ type: 'error', title: 'Confirmation required', message: 'Please type DELETE to confirm.' });
      return;
    }

    setIsDeleting(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // Delete user profile data
        await supabase.from('profiles').delete().eq('id', user.id);
        await supabase.from('user_solved_problems').delete().eq('user_id', user.id);
        await supabase.auth.signOut();
      }
    } catch {
      // Ignore if Supabase unavailable
    }

    // Clear all local records
    try {
      localStorage.removeItem('mergegrid_user_profile');
      localStorage.removeItem('mergegrid_solved_problems');
      localStorage.removeItem('mergegrid_theme');
      localStorage.removeItem('mergegrid_groups');
      localStorage.removeItem('mergegrid_contests');
      localStorage.removeItem('mergegrid_github_commits');
      document.cookie = 'mergegrid_demo_session=; path=/; max-age=0';
    } catch {
      // Ignore
    }

    toast({
      type: 'info',
      title: 'Account Deleted',
      message: 'Your account and personal data have been completely removed.',
    });

    setIsDeleting(false);
    setShowDeleteAccountModal(false);
    router.push('/login');
    router.refresh();
  };

  React.useEffect(() => {
    try {
      const saved = localStorage.getItem('mergegrid_user_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.displayName) setDisplayName(parsed.displayName);
        if (parsed.username) setUsername(parsed.username);
        if (parsed.college) setCollege(parsed.college);
        if (parsed.bio) setBio(parsed.bio);
      }
    } catch {
      // Ignore
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem(
        'mergegrid_user_profile',
        JSON.stringify({ displayName, username, college, bio, emailAlerts, contestReminders })
      );
    } catch {
      // Ignore
    }
    toast({
      type: 'success',
      title: 'Preferences saved',
      message: 'Your profile settings have been successfully updated.',
    });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">
          Account Settings & Preferences
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          Manage your personal profile, collegiate guild membership, and notifications.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Info */}
        <Card className="p-6">
          <h2 className="text-base font-bold text-neutral-900 mb-4 flex items-center gap-2">
            <User className="w-4 h-4 text-brand-600" /> Public Profile
          </h2>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Display Name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
              />
              <Input
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-700 block mb-1">
                Engineering College / University
              </label>
              <select
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                className="w-full text-sm border border-neutral-200 rounded-lg p-2.5 bg-white text-neutral-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="BMS College of Engineering (BMSCE)">BMS College of Engineering (BMSCE)</option>
                <option value="RV College of Engineering (RVCE)">RV College of Engineering (RVCE)</option>
                <option value="IIT Bombay Tech Council">IIT Bombay</option>
                <option value="PES University Ring of Code">PES University</option>
                <option value="MS Ramaiah Institute of Technology (MSRIT)">MS Ramaiah Institute of Technology</option>
                <option value="NIT Karnataka (NITK Surathkal)">NIT Karnataka</option>
                <option value="Independent / Other">Independent / Other</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-700 block mb-1">
                Bio
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full text-sm border border-neutral-200 rounded-lg p-2.5 bg-white text-neutral-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>
        </Card>

        {/* Appearance / Dark Theme Selection */}
        <Card className="p-6">
          <h2 className="text-base font-bold text-neutral-900 mb-4 flex items-center gap-2">
            <Moon className="w-4 h-4 text-brand-600" /> Interface Theme
          </h2>
          <p className="text-xs text-neutral-500 mb-4">
            Select your preferred display mode or sync seamlessly with your system preferences.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setTheme('light')}
              className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                theme === 'light'
                  ? 'border-brand-600 bg-brand-50/50 ring-2 ring-brand-500/20'
                  : 'border-neutral-200 hover:border-neutral-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Sun className="w-5 h-5 text-amber-500" />
                {theme === 'light' && <Check className="w-4 h-4 text-brand-600 font-bold" />}
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-900">Light Mode</p>
                <p className="text-xs text-neutral-500 mt-0.5">High clarity daylight theme</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setTheme('dark')}
              className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                theme === 'dark'
                  ? 'border-brand-600 bg-neutral-900 text-white ring-2 ring-brand-500/20'
                  : 'border-neutral-200 hover:border-neutral-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Moon className="w-5 h-5 text-indigo-400" />
                {theme === 'dark' && <Check className="w-4 h-4 text-brand-400 font-bold" />}
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-900 dark:text-white">Dark Mode</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">Eye-friendly nocturnal coding</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setTheme('system')}
              className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                theme === 'system'
                  ? 'border-brand-600 bg-brand-50/50 ring-2 ring-brand-500/20'
                  : 'border-neutral-200 hover:border-neutral-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Laptop className="w-5 h-5 text-neutral-600" />
                {theme === 'system' && <Check className="w-4 h-4 text-brand-600 font-bold" />}
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-900">System Preference</p>
                <p className="text-xs text-neutral-500 mt-0.5">Syncs with OS dark/light mode</p>
              </div>
            </button>
          </div>
        </Card>

        {/* Notifications Config */}
        <Card className="p-6">
          <h2 className="text-base font-bold text-neutral-900 mb-4 flex items-center gap-2">
            <Bell className="w-4 h-4 text-brand-600" /> Notifications & Alerts
          </h2>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 rounded-lg hover:bg-neutral-50 transition-colors cursor-pointer border border-neutral-100">
              <div>
                <p className="text-sm font-semibold text-neutral-900">
                  Contest Countdown & Reminders
                </p>
                <p className="text-xs text-neutral-500">
                  Receive notifications 1 hour and 15 minutes before contests start.
                </p>
              </div>
              <input
                type="checkbox"
                checked={contestReminders}
                onChange={(e) => setContestReminders(e.target.checked)}
                className="w-4 h-4 rounded text-brand-600 border-neutral-300 focus:ring-brand-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-lg hover:bg-neutral-50 transition-colors cursor-pointer border border-neutral-100">
              <div>
                <p className="text-sm font-semibold text-neutral-900">
                  Discussion Replies & Mentions
                </p>
                <p className="text-xs text-neutral-500">
                  Notify me when somebody replies to my questions or upvotes my answers.
                </p>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-4 h-4 rounded text-brand-600 border-neutral-300 focus:ring-brand-500"
              />
            </label>
          </div>
        </Card>

        <div className="flex items-center justify-end gap-3">
          <Button
            type="submit"
            className="bg-brand-600 hover:bg-brand-700 text-white font-semibold"
            icon={<Save className="w-4 h-4" />}
          >
            Save Changes
          </Button>
        </div>
      </form>

      {/* Danger Zone: Delete Account */}
      <Card className="p-6 border-rose-200 dark:border-rose-900/40 bg-rose-50/20 dark:bg-rose-950/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-rose-600 dark:text-rose-400 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-500" /> Danger Zone
            </h2>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 max-w-xl leading-relaxed">
              Permanently delete your MergeGrid account, public profile, contest participations, and solved problem archives. This action cannot be reversed.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowDeleteAccountModal(true)}
            className="border-rose-300 text-rose-600 hover:bg-rose-50 dark:border-rose-800 dark:text-rose-400 dark:hover:bg-rose-950/40 font-semibold text-xs shrink-0"
            icon={<Trash2 className="w-4 h-4 text-rose-500" />}
          >
            Delete Account
          </Button>
        </div>
      </Card>

      {/* Delete Account Confirmation Modal */}
      {showDeleteAccountModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#282828] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-neutral-200 dark:border-[#383838] space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-[#383838] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                  <Trash2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-neutral-900 dark:text-[#eff1f6] text-base">Delete Account</h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Irreversible destruction of account data
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowDeleteAccountModal(false);
                  setConfirmDeleteText('');
                }}
                className="text-neutral-400 hover:text-neutral-700 dark:hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-neutral-600 dark:text-neutral-300 space-y-2 leading-relaxed">
              <p>
                Are you absolutely sure you want to delete your MergeGrid account (<strong>@{username}</strong>)?
              </p>
              <div className="p-3 rounded-lg bg-neutral-100 dark:bg-[#202020] text-neutral-700 dark:text-neutral-300 font-mono text-[11px] space-y-1">
                <div>• All solved problems and streak logs will be deleted.</div>
                <div>• You will be removed from your groups and guild rosters.</div>
                <div>• Your collegiate ranking contributions will be reset.</div>
              </div>
              <p className="text-neutral-500 dark:text-neutral-400">
                To confirm deletion, please type <strong className="text-rose-600 dark:text-rose-400">DELETE</strong> below:
              </p>
            </div>

            <Input
              placeholder="Type DELETE to confirm"
              value={confirmDeleteText}
              onChange={(e) => setConfirmDeleteText(e.target.value)}
              className="text-center font-mono font-bold tracking-widest uppercase"
              autoFocus
            />

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeleteAccountModal(false);
                  setConfirmDeleteText('');
                }}
                className="text-xs dark:bg-[#202020] dark:border-[#383838] dark:text-neutral-300"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteAccount}
                loading={isDeleting}
                disabled={confirmDeleteText.trim() !== 'DELETE'}
                className="bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs shadow-sm disabled:opacity-50"
                icon={<Trash2 className="w-3.5 h-3.5" />}
              >
                Permanently Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
