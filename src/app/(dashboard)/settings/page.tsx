'use client';

import React, { useState } from 'react';
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
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/toast';

export default function SettingsPage() {
  const [displayName, setDisplayName] = useState('Alex Rivera');
  const [username, setUsername] = useState('alex_dev');
  const [college, setCollege] = useState('BMS College of Engineering (BMSCE)');
  const [bio, setBio] = useState('Pre-final year CS student building distributed systems and open-source tooling.');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [contestReminders, setContestReminders] = useState(true);
  const { toast } = useToast();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
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
    </div>
  );
}
