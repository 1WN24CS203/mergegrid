'use client';

import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  ThumbsUp,
  MessageCircle,
  Search,
  Plus,
  CheckCircle,
  Share2,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/toast';

interface Discussion {
  id: string;
  title: string;
  author: string;
  college: string;
  timeAgo: string;
  category: string;
  upvotes: number;
  replies: number;
  tags: string[];
  solved: boolean;
  content: string;
}

const defaultDiscussions: Discussion[] = [];

export default function DiscussionsPage() {
  const [discussions, setDiscussions] = useState<Discussion[]>(defaultDiscussions);
  const [search, setSearch] = useState('');
  const [activeTag, setActiveTag] = useState('All');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState('Algorithms');
  const { toast } = useToast();

  useEffect(() => {
    try {
      const saved = localStorage.getItem('mergegrid_discussions');
      if (saved) {
        setDiscussions(JSON.parse(saved));
      }
    } catch {
      // Ignore
    }
  }, []);

  const persistDiscussions = (updated: Discussion[]) => {
    setDiscussions(updated);
    try {
      localStorage.setItem('mergegrid_discussions', JSON.stringify(updated));
    } catch {
      // Ignore
    }
  };

  const handleUpvote = (id: string) => {
    const updated = discussions.map((d) =>
      d.id === id ? { ...d, upvotes: d.upvotes + 1 } : d
    );
    persistDiscussions(updated);
    toast({ type: 'success', title: 'Upvoted discussion' });
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) {
      toast({ type: 'error', title: 'Please provide both title and details' });
      return;
    }

    const newPost: Discussion = {
      id: `d-${Date.now()}`,
      title: newTitle.trim(),
      author: 'You',
      college: 'MergeGrid Member',
      timeAgo: 'Just now',
      category: newCategory,
      upvotes: 1,
      replies: 0,
      tags: ['Discussion', newCategory],
      solved: false,
      content: newContent.trim(),
    };

    const updated = [newPost, ...discussions];
    persistDiscussions(updated);
    setNewTitle('');
    setNewContent('');
    setShowCreateModal(false);
    toast({ type: 'success', title: 'Discussion posted successfully!' });
  };

  const filtered = discussions.filter((d) => {
    const matchesSearch =
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.content.toLowerCase().includes(search.toLowerCase());
    const matchesTag =
      activeTag === 'All' || d.category === activeTag || d.tags.includes(activeTag);
    return matchesSearch && matchesTag;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">
            Developer Discussions
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Exchange architecture insights, interview experiences, and algorithm discussions.
          </p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          icon={<Plus className="w-4 h-4" />}
          className="bg-brand-600 hover:bg-brand-700 text-white"
        >
          Start Discussion
        </Button>
      </div>

      {/* Search and Category Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input
            placeholder="Search discussions, interview debriefs, keywords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search className="w-4 h-4" />}
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {['All', 'Algorithms', 'Interview Debrief', 'Architecture', 'Open Source'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTag(cat)}
              className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                activeTag === cat
                  ? 'bg-neutral-900 text-white shadow-sm'
                  : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Discussion List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-3">
              <MessageSquare className="w-6 h-6 text-neutral-400" />
            </div>
            <h3 className="text-base font-bold text-neutral-900">No discussions found</h3>
            <p className="text-xs text-neutral-500 mt-1">
              Be the first to start a conversation in this category.
            </p>
            <Button
              className="mt-4 bg-brand-600 hover:bg-brand-700 text-white"
              onClick={() => setShowCreateModal(true)}
            >
              Start First Discussion
            </Button>
          </Card>
        ) : (
          filtered.map((item) => (
            <Card key={item.id} className="p-5 hover:border-neutral-300 transition-colors">
              <div className="flex items-start gap-4">
                {/* Upvote button */}
                <button
                  onClick={() => handleUpvote(item.id)}
                  className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-neutral-50 hover:bg-brand-50 hover:text-brand-600 border border-neutral-200 transition-colors group cursor-pointer shrink-0"
                >
                  <ThumbsUp className="w-4 h-4 text-neutral-500 group-hover:text-brand-600 transition-colors" />
                  <span className="text-xs font-bold font-mono mt-1 text-neutral-700 group-hover:text-brand-600">
                    {item.upvotes}
                  </span>
                </button>

                {/* Main Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-brand-50 text-brand-700 border border-brand-200/60">
                      {item.category}
                    </span>
                    {item.solved && (
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-emerald-50 text-emerald-700 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Solved
                      </span>
                    )}
                    <span className="text-xs text-neutral-400">•</span>
                    <span className="text-xs font-medium text-neutral-600">{item.author}</span>
                    <span className="text-xs text-neutral-400 font-mono">({item.college})</span>
                    <span className="text-xs text-neutral-400">•</span>
                    <span className="text-xs text-neutral-400">{item.timeAgo}</span>
                  </div>

                  <h3 className="text-base font-bold text-neutral-900 hover:text-brand-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-neutral-600 mt-1 line-clamp-2 leading-relaxed">
                    {item.content}
                  </p>

                  {/* Tags & Replies */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mt-4 pt-3 border-t border-neutral-100">
                    <div className="flex flex-wrap gap-1.5">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[11px] px-2 py-0.5 rounded bg-neutral-100 text-neutral-600"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-4 text-xs text-neutral-500">
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-3.5 h-3.5" /> {item.replies} Replies
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-xl w-full border border-neutral-200 p-6 animate-scale-in">
            <h3 className="text-lg font-bold text-neutral-900 mb-4">
              Start New Discussion
            </h3>
            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1">
                  Topic Title
                </label>
                <Input
                  placeholder="e.g. Approach for designing real-time leaderboard in Redis"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1">
                  Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full text-sm border border-neutral-200 rounded-lg p-2.5 bg-white text-neutral-800"
                >
                  <option value="Algorithms">Algorithms</option>
                  <option value="Interview Debrief">Interview Debrief</option>
                  <option value="Architecture">Architecture</option>
                  <option value="Open Source">Open Source</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1">
                  Description / Details
                </label>
                <textarea
                  rows={4}
                  placeholder="Explain the question, challenge or architectural context..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full text-sm border border-neutral-200 rounded-lg p-2.5 bg-white text-neutral-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-brand-600 hover:bg-brand-700 text-white font-medium">
                  Publish Post
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
