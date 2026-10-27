'use client';

import React, { useState, useEffect } from 'react';
import {
  FolderKanban,
  ExternalLink,
  ThumbsUp,
  Plus,
  Search,
} from 'lucide-react';
import { Github } from '@/components/ui/icons';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/toast';

interface Project {
  id: string;
  title: string;
  tagline: string;
  author: string;
  college: string;
  tags: string[];
  upvotes: number;
  demoUrl?: string;
  githubUrl?: string;
  featured?: boolean;
}

const defaultProjects: Project[] = [];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(defaultProjects);
  const [search, setSearch] = useState('');
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [tagsStr, setTagsStr] = useState('');
  const [demoUrl, setDemoUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    try {
      const saved = localStorage.getItem('mergegrid_projects');
      if (saved) {
        setProjects(JSON.parse(saved));
      }
    } catch {
      // Ignore
    }
  }, []);

  const persistProjects = (updated: Project[]) => {
    setProjects(updated);
    try {
      localStorage.setItem('mergegrid_projects', JSON.stringify(updated));
    } catch {
      // Ignore
    }
  };

  const handleUpvote = (id: string) => {
    const updated = projects.map((p) =>
      p.id === id ? { ...p, upvotes: p.upvotes + 1 } : p
    );
    persistProjects(updated);
    toast({ type: 'success', title: 'Upvoted project!' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !tagline.trim()) {
      toast({ type: 'error', title: 'Please provide project title and description' });
      return;
    }

    const tags = tagsStr
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const newProject: Project = {
      id: `p-${Date.now()}`,
      title: title.trim(),
      tagline: tagline.trim(),
      author: 'You',
      college: 'MergeGrid Guild',
      tags: tags.length ? tags : ['Next.js', 'React'],
      upvotes: 1,
      demoUrl: demoUrl.trim() || undefined,
      githubUrl: githubUrl.trim() || undefined,
      featured: false,
    };

    const updated = [newProject, ...projects];
    persistProjects(updated);
    setTitle('');
    setTagline('');
    setTagsStr('');
    setDemoUrl('');
    setGithubUrl('');
    setShowSubmitModal(false);
    toast({ type: 'success', title: 'Project published to showcase!' });
  };

  const filtered = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.tagline.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">
            Developer Projects Showcase
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Showcase your hackathon builds, capstone projects, and find co-founders.
          </p>
        </div>
        <Button
          icon={<Plus className="w-4 h-4" />}
          className="bg-brand-600 hover:bg-brand-700 text-white cursor-pointer"
          onClick={() => setShowSubmitModal(true)}
        >
          Submit Project
        </Button>
      </div>

      {/* Search */}
      <Input
        placeholder="Search student projects, technologies, or colleges..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        icon={<Search className="w-4 h-4" />}
      />

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.length === 0 ? (
          <div className="col-span-full">
            <Card className="p-12 text-center">
              <FolderKanban className="w-10 h-10 text-neutral-400 mx-auto mb-3" />
              <h3 className="text-base font-bold text-neutral-900">No projects found</h3>
              <p className="text-xs text-neutral-500 mt-1">
                Be the first to submit a project to the showcase.
              </p>
              <Button
                className="mt-4 bg-brand-600 hover:bg-brand-700 text-white"
                onClick={() => setShowSubmitModal(true)}
              >
                Submit Project
              </Button>
            </Card>
          </div>
        ) : (
          filtered.map((proj) => (
            <Card key={proj.id} className="p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-neutral-400 font-medium">
                    {proj.college}
                  </span>
                  {proj.featured && (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                      Featured
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-neutral-900">
                  {proj.title}
                </h3>
                <p className="text-xs text-neutral-500 mt-2 leading-relaxed">
                  {proj.tagline}
                </p>

                <div className="flex flex-wrap gap-1.5 mt-4">
                  {proj.tags.map((t) => (
                    <span
                      key={t}
                      className="text-[10px] px-2 py-0.5 rounded bg-neutral-100 text-neutral-600 font-mono"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between">
                <button
                  onClick={() => handleUpvote(proj.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 hover:border-brand-500 hover:text-brand-600 text-xs font-semibold text-neutral-700 transition-colors cursor-pointer"
                >
                  <ThumbsUp className="w-3.5 h-3.5" /> {proj.upvotes}
                </button>

                <div className="flex items-center gap-2">
                  {proj.githubUrl && (
                    <a
                      href={proj.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 text-neutral-400 hover:text-neutral-700 transition-colors"
                      title="GitHub Repository"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                  {proj.demoUrl && (
                    <a
                      href={proj.demoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700"
                    >
                      Demo <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Submit Project Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full border border-neutral-200 p-6 animate-scale-in">
            <h3 className="text-lg font-bold text-neutral-900 mb-4">
              Submit Your Project
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1">
                  Project Title
                </label>
                <Input
                  placeholder="e.g. MergeGrid Judge"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1">
                  Tagline / Description
                </label>
                <textarea
                  rows={2}
                  placeholder="One sentence describing what it does..."
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full text-sm border border-neutral-200 rounded-lg p-2.5 bg-white text-neutral-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1">
                  Tech Stack (comma separated)
                </label>
                <Input
                  placeholder="e.g. Next.js, TypeScript, Go, Docker"
                  value={tagsStr}
                  onChange={(e) => setTagsStr(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-neutral-700 block mb-1">
                    GitHub URL
                  </label>
                  <Input
                    placeholder="https://github.com/..."
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-700 block mb-1">
                    Live Demo Link
                  </label>
                  <Input
                    placeholder="https://my-app.vercel.app"
                    value={demoUrl}
                    onChange={(e) => setDemoUrl(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowSubmitModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-brand-600 hover:bg-brand-700 text-white font-medium">
                  Submit Project
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
