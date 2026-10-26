'use client';

import React, { useState } from 'react';
import {
  Bell,
  Trophy,
  GitFork,
  MessageSquare,
  CheckCheck,
  Check,
  Flame,
  Clock,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'contest' | 'pr' | 'discussion' | 'streak';
}

const initialNotifications: NotificationItem[] = [
  {
    id: 'n-1',
    title: 'Contest Starting Soon',
    message: 'MergeGrid Inter-College Clash #14 starts in 30 minutes. Warm up your judge environment!',
    time: '25m ago',
    read: false,
    type: 'contest',
  },
  {
    id: 'n-2',
    title: 'Pull Request Merged 🎉',
    message: 'Your PR #42 in "bmsce-foss/campus-interview-vault" was approved and merged.',
    time: '2 hours ago',
    read: false,
    type: 'pr',
  },
  {
    id: 'n-3',
    title: 'New Reply in Architecture Thread',
    message: 'Priya Sharma replied to your question about gRPC vs RabbitMQ.',
    time: '5 hours ago',
    read: true,
    type: 'discussion',
  },
  {
    id: 'n-4',
    title: '14-Day Streak Unlocked! 🔥',
    message: 'You have solved at least 1 coding challenge for 14 consecutive days.',
    time: 'Yesterday',
    read: true,
    type: 'streak',
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const { toast } = useToast();

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast({ type: 'success', title: 'All notifications marked as read' });
  };

  const markRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">
            Notification Center
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Stay updated with contest alarms, PR merges, and collegiate discussions.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          icon={<CheckCheck className="w-4 h-4" />}
          onClick={markAllRead}
        >
          Mark all as read
        </Button>
      </div>

      {/* List */}
      <div className="space-y-3">
        {notifications.map((item) => (
          <Card
            key={item.id}
            className={`p-4 transition-all ${
              item.read ? 'bg-white opacity-80' : 'bg-brand-50/20 border-brand-200'
            }`}
          >
            <div className="flex items-start gap-3.5">
              <div
                className={`p-2.5 rounded-xl shrink-0 ${
                  item.type === 'contest'
                    ? 'bg-amber-100 text-amber-700'
                    : item.type === 'pr'
                    ? 'bg-emerald-100 text-emerald-700'
                    : item.type === 'streak'
                    ? 'bg-rose-100 text-rose-700'
                    : 'bg-brand-100 text-brand-700'
                }`}
              >
                {item.type === 'contest' && <Trophy className="w-4 h-4" />}
                {item.type === 'pr' && <GitFork className="w-4 h-4" />}
                {item.type === 'streak' && <Flame className="w-4 h-4" />}
                {item.type === 'discussion' && <MessageSquare className="w-4 h-4" />}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-bold text-neutral-900">
                    {item.title}
                  </h3>
                  <span className="text-xs text-neutral-400 font-mono">
                    {item.time}
                  </span>
                </div>
                <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                  {item.message}
                </p>
              </div>

              {!item.read && (
                <button
                  onClick={() => markRead(item.id)}
                  title="Mark as read"
                  className="p-1.5 text-neutral-400 hover:text-brand-600 rounded-lg transition-colors cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                </button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
