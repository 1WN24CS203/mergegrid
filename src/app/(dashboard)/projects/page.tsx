'use client';

import React, { useState } from 'react';
import {
  FolderKanban,
  ExternalLink,
  Github,
  ThumbsUp,
  Plus,
  Search,
  Sparkles,
} from 'lucide-react';
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

const initialProjects: Project[] = [
  {
    id: 'p-1',
    title: 'AuraVoice AI',
    tagline: 'Real-time multilingual voice assistant running client-side with Whisper and WebGPU.',
    author: 'Samarth K',
    college: 'BMSCE',
    tags: ['Next.js', 'WebGPU', 'Whisper', 'Tailwind'],
    upvotes: 84,
    demoUrl: 'https://demo.example.com',
    githubUrl: 'https://github.com',
    featured: true,
  },
  {
    id: 'p-2',
    title: 'ChainTrust Credentials',
    tagline: 'Decentralized college degree verification and badge issuer using zero-knowledge proofs.',
    author: 'Tanvi M',
    college: 'RVCE',
    tags: ['ZK-Proofs', 'Solidity', 'Ethers.js', 'React'],
    upvotes: 62,
    demoUrl: 'https://demo.example.com',
    githubUrl: 'https://github.com',
  },
  {
    id: 'p-3',
    title: 'DevMesh Observability',
    tagline: 'Lightweight distributed tracing and latency profiler for Docker microservices.',
    author: 'Rahul Sen',
    college: 'IIT Bombay',
    tags: ['Go', 'Prometheus', 'Grafana', 'Docker'],
    upvotes: 51,
    githubUrl: 'https://github.com',
  },
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState(initialProjects);
  const [search, setSearch] = useState('');
  const { toast } = useToast();

  const handleUpvote = (id: string) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, upvotes: p.upvotes + 1 } : p))
    );
    toast({ type: 'success', title: 'Upvoted project!' });
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
          className="bg-brand-600 hover:bg-brand-700 text-white"
          onClick={() =>
            toast({
              type: 'info',
              title: 'Project Submission',
              message: 'Submission form opens for verified college members.',
            })
          }
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
        {filtered.map((proj) => (
          <Card key={proj.id} className="p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-neutral-400 font-medium">
                  {proj.college}
                </span>
                {proj.featured && (
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                    Staff Pick
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
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 hover:border-brand-500 hover:text-brand-600 text-xs font-semibold text-neutral-700 transition-colors"
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
                    Live Demo <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
