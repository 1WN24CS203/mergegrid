'use client';

import React, { useState, useEffect } from 'react';
import {
  Bell,
  Trophy,
  GitFork,
  MessageSquare,
  CheckCheck,
  Check,
  Flame,
  Trash2,
  Sparkles,
  Inbox,
  X,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'contest' | 'pr' | 'discussion' | 'streak';
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const saved = localStorage.getItem('mergegrid_notifications');
      if (saved) {
        setNotifications(JSON.parse(saved));
      }
    } catch {
      // Ignore
    }
  }, []);

  const persistNotifications = (updated: NotificationItem[]) => {
    setNotifications(updated);
    try {
      localStorage.setItem('mergegrid_notifications', JSON.stringify(updated));
    } catch {
      // Ignore
    }
  };

  const markAllRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    persistNotifications(updated);
    toast({ type: 'success', title: 'All notifications marked as read' });
  };

  const markRead = (id: string) => {
    const updated = notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    );
    persistNotifications(updated);
  };

  const dismissNotification = (id: string) => {
    const updated = notifications.filter((n) => n.id !== id);
    persistNotifications(updated);
    toast({ type: 'info', title: 'Notification dismissed' });
  };

  const clearAll = () => {
    persistNotifications([]);
    toast({ type: 'success', title: 'Notifications cleared' });
  };

  const addTestNotification = () => {
    const newAlert: NotificationItem = {
      id: `n-${Date.now()}`,
      title: 'Welcome to MergeGrid!',
      message: 'Your developer workspace is set up and ready for competitive coding and open source.',
      time: 'Just now',
      read: false,
      type: 'contest',
    };
    persistNotifications([newAlert, ...notifications]);
    toast({ type: 'success', title: 'Notification generated' });
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
        <div className="flex items-center gap-2">
          {notifications.length > 0 ? (
            <>
              <Button
                variant="outline"
                size="sm"
                icon={<CheckCheck className="w-4 h-4" />}
                onClick={markAllRead}
              >
                Mark all as read
              </Button>
              <Button
                variant="outline"
                size="sm"
                icon={<Trash2 className="w-4 h-4" />}
                onClick={clearAll}
                className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
              >
                Clear all
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              size="sm"
              icon={<Sparkles className="w-4 h-4 text-brand-600" />}
              onClick={addTestNotification}
            >
              Test Notification
            </Button>
          )}
        </div>
      </div>

      {/* List or Empty State */}
      {notifications.length === 0 ? (
        <Card className="p-12 text-center border-dashed border-2 border-neutral-200">
          <div className="w-14 h-14 rounded-2xl bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto mb-3">
            <Inbox className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-neutral-900">
            You're all caught up!
          </h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto mt-1 leading-relaxed">
            There are no notifications right now. Contest alarms, PR merges, and forum replies will appear here in real time.
          </p>
          <div className="mt-5">
            <Button
              size="sm"
              variant="outline"
              icon={<Sparkles className="w-4 h-4 text-brand-600" />}
              onClick={addTestNotification}
            >
              Send Test Notification
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {notifications.map((item) => (
            <Card
              key={item.id}
              className={`p-4 transition-all ${
                item.read ? 'bg-white opacity-85' : 'bg-brand-50/20 border-brand-200 shadow-sm'
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

                <div className="flex items-center gap-1 shrink-0">
                  {!item.read && (
                    <button
                      onClick={() => markRead(item.id)}
                      title="Mark as read"
                      className="p-1.5 text-neutral-400 hover:text-brand-600 rounded-lg transition-colors cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => dismissNotification(item.id)}
                    title="Dismiss"
                    className="p-1.5 text-neutral-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
