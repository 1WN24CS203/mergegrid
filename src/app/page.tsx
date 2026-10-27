'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Code2,
  Trophy,
  GitFork,
  GraduationCap,
  Sparkles,
  ArrowRight,
  Terminal,
  CheckCircle2,
  Users,
  Flame,
  Star,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<'editor' | 'leaderboard' | 'opensource'>('editor');

  return (
    <div className="min-h-screen bg-[#0a0d12] text-neutral-100 selection:bg-brand-500 selection:text-white overflow-x-hidden font-sans">
      {/* Background radial glow effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-[20%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-brand-600/20 via-emerald-500/10 to-transparent blur-[120px] rounded-full" />
        <div className="absolute top-[40%] -left-[10%] w-[600px] h-[600px] bg-cyan-600/10 blur-[140px] rounded-full" />
        <div className="absolute top-[60%] -right-[10%] w-[600px] h-[600px] bg-brand-600/15 blur-[140px] rounded-full" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      {/* Navigation Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#0a0d12]/75 border-b border-neutral-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-neutral-900 border border-neutral-700/60 p-1.5 flex items-center justify-center shadow-lg group-hover:border-brand-500/50 transition-all">
              <img
                src="/logo.png"
                alt="MergeGrid Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-xl font-bold tracking-tight text-white flex items-center">
              Merge<span className="text-brand-400">Grid</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-400">
            <Link href="#features" className="hover:text-white transition-colors">
              Features
            </Link>
            <Link href="#preview" className="hover:text-white transition-colors">
              Platform Demo
            </Link>
            <Link href="#community" className="hover:text-white transition-colors">
              Colleges
            </Link>
            <Link href="/problems" className="hover:text-white transition-colors flex items-center gap-1">
              Problems <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-300">Live</span>
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-neutral-300 hover:text-white px-3.5 py-2 rounded-lg hover:bg-neutral-800/60 transition-all"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="text-sm font-semibold bg-gradient-to-r from-brand-500 to-emerald-500 hover:from-brand-600 hover:to-emerald-600 text-white px-4 py-2 rounded-lg shadow-lg shadow-brand-500/20 transition-all transform active:scale-95"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-24 md:pt-28 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Release Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-900/90 border border-neutral-700/80 text-xs font-medium text-neutral-300 mb-8 shadow-inner animate-fade-in hover:border-brand-500/50 transition-colors">
          <span className="flex h-2 w-2 rounded-full bg-brand-400 animate-pulse" />
          <span className="text-brand-300 font-semibold">MergeGrid v2.0</span>
          <span className="text-neutral-500">•</span>
          <span>Next-Gen Developer Community & Challenge Arena</span>
          <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.12]">
          Build together. <br className="hidden sm:inline" />
          Compete fairly.{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-400 via-teal-300 to-emerald-400">
            Grow together.
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-neutral-400 max-w-2xl mx-auto font-normal leading-relaxed">
          The all-in-one developer workspace uniting real-time competitive coding,
          open-source project collaboration, placement archives, and cross-college engineering networks.
        </p>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-gradient-to-r from-brand-500 to-emerald-500 text-white font-semibold text-base shadow-xl shadow-brand-500/25 hover:shadow-brand-500/40 hover:brightness-110 transition-all transform active:scale-98"
          >
            Launch Workspace <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/problems"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 text-neutral-200 font-semibold text-base transition-all"
          >
            <Code2 className="w-4 h-4 text-brand-400" /> Browse 400+ Problems
          </Link>
        </div>

        {/* Platform Core Highlights */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto border-y border-neutral-800/80 py-8 bg-neutral-950/40 backdrop-blur-sm rounded-2xl">
          <div className="text-center px-4">
            <div className="text-2xl sm:text-3xl font-extrabold text-white">400+</div>
            <div className="text-xs uppercase tracking-wider text-neutral-400 mt-1 font-medium">Curated Challenges</div>
          </div>
          <div className="text-center px-4 border-l border-neutral-800/60">
            <div className="text-2xl sm:text-3xl font-extrabold text-white">Real-Time</div>
            <div className="text-xs uppercase tracking-wider text-neutral-400 mt-1 font-medium">Contest Arena</div>
          </div>
          <div className="text-center px-4 border-l border-neutral-800/60">
            <div className="text-2xl sm:text-3xl font-extrabold text-white">Open Source</div>
            <div className="text-xs uppercase tracking-wider text-neutral-400 mt-1 font-medium">Project Radar</div>
          </div>
          <div className="text-center px-4 border-l border-neutral-800/60">
            <div className="text-2xl sm:text-3xl font-extrabold text-white">Verified</div>
            <div className="text-xs uppercase tracking-wider text-neutral-400 mt-1 font-medium">Placement Vaults</div>
          </div>
        </div>

        {/* Live Interactive Preview Box */}
        <div id="preview" className="mt-16 text-left max-w-5xl mx-auto">
          <div className="rounded-2xl border border-neutral-800 bg-[#0f141c]/90 shadow-2xl backdrop-blur-xl overflow-hidden">
            {/* Window Topbar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800/80 bg-neutral-900/60">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 text-xs font-mono text-neutral-400 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-neutral-500" /> mergegrid://arena/solve
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('editor')}
                  className={`text-xs px-3 py-1 rounded-md font-medium transition-all ${
                    activeTab === 'editor'
                      ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  Code Runner
                </button>
                <button
                  onClick={() => setActiveTab('leaderboard')}
                  className={`text-xs px-3 py-1 rounded-md font-medium transition-all ${
                    activeTab === 'leaderboard'
                      ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  Collegiate Ranks
                </button>
                <button
                  onClick={() => setActiveTab('opensource')}
                  className={`text-xs px-3 py-1 rounded-md font-medium transition-all ${
                    activeTab === 'opensource'
                      ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  Project Radar
                </button>
              </div>
            </div>

            {/* Window Content */}
            <div className="p-6 font-mono text-sm">
              {activeTab === 'editor' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-neutral-400 border-b border-neutral-800 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-semibold">Medium</span>
                      <span className="text-white font-medium">322. Coin Change Optimization (Dynamic Programming)</span>
                    </div>
                    <span className="text-neutral-500 font-sans">Memory Limit: 256MB • Time: 1.0s</span>
                  </div>
                  <pre className="text-neutral-300 text-xs sm:text-sm leading-relaxed overflow-x-auto">
                    <code>
                      <span className="text-purple-400">function</span> <span className="text-blue-400">coinChange</span>(coins: <span className="text-teal-300">number[]</span>, amount: <span className="text-teal-300">number</span>): <span className="text-teal-300">number</span> &#123;{'\n'}
                      {'  '}<span className="text-purple-400">const</span> dp = <span className="text-purple-400">new</span> <span className="text-blue-400">Array</span>(amount + <span className="text-amber-300">1</span>).fill(<span className="text-amber-300">Infinity</span>);{'\n'}
                      {'  '}dp[<span className="text-amber-300">0</span>] = <span className="text-amber-300">0</span>;{'\n'}
                      {'  '}<span className="text-purple-400">for</span> (<span className="text-purple-400">const</span> coin <span className="text-purple-400">of</span> coins) &#123;{'\n'}
                      {'    '}<span className="text-purple-400">for</span> (<span className="text-purple-400">let</span> i = coin; i &lt;= amount; i++) &#123;{'\n'}
                      {'      '}dp[i] = <span className="text-blue-400">Math</span>.min(dp[i], dp[i - coin] + <span className="text-amber-300">1</span>);{'\n'}
                      {'    '}&#125;{'\n'}
                      {'  '}&#125;{'\n'}
                      {'  '}<span className="text-purple-400">return</span> dp[amount] === <span className="text-amber-300">Infinity</span> ? -<span className="text-amber-300">1</span> : dp[amount];{'\n'}
                      &#125;
                    </code>
                  </pre>
                  <div className="pt-4 border-t border-neutral-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3 text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Test Cases: 14/14 Passed (Runtime: 48ms, faster than 94.2%)</span>
                    </div>
                    <Link
                      href="/problems"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-medium transition-all"
                    >
                      Try in Arena <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              )}

              {activeTab === 'leaderboard' && (
                <div className="space-y-3 font-sans">
                  <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
                    <span>Rank & College Entity</span>
                    <span>Score & Solved Count</span>
                  </div>
                  {[
                    { rank: 1, college: 'BMS College of Engineering (BMSCE)', score: '18,420 pts', solved: '412 Problems', rep: '+480 this week' },
                    { rank: 2, college: 'RV College of Engineering (RVCE)', score: '17,890 pts', solved: '398 Problems', rep: '+310 this week' },
                    { rank: 3, college: 'IIT Bombay Developer Guild', score: '16,740 pts', solved: '380 Problems', rep: '+290 this week' },
                    { rank: 4, college: 'PES University Ring of Code', score: '15,120 pts', solved: '354 Problems', rep: '+180 this week' },
                  ].map((item) => (
                    <div
                      key={item.rank}
                      className="flex items-center justify-between p-3 rounded-lg bg-neutral-900/60 border border-neutral-800/80 hover:border-neutral-700 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-6 text-center font-bold text-sm ${item.rank === 1 ? 'text-amber-400' : item.rank === 2 ? 'text-neutral-300' : item.rank === 3 ? 'text-amber-600' : 'text-neutral-500'}`}>
                          #{item.rank}
                        </span>
                        <div>
                          <div className="text-sm font-semibold text-white">{item.college}</div>
                          <div className="text-xs text-neutral-400 font-mono">{item.solved} • <span className="text-brand-400">{item.rep}</span></div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-white font-mono">{item.score}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'opensource' && (
                <div className="space-y-3 font-sans">
                  <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
                    <span>Featured College Repositories Seeking Contributors</span>
                    <span>Issue Tags</span>
                  </div>
                  {[
                    { title: '1WN24CS203 / mergegrid', desc: 'All-in-one developer collaboration and competitive coding challenge arena', stars: 1, issues: 'open for contributors', tags: ['Next.js', 'Supabase', 'Tailwind'] },
                  ].map((repo, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-lg bg-neutral-900/60 border border-neutral-800/80 hover:border-neutral-700 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div>
                        <div className="text-sm font-semibold text-white flex items-center gap-2">
                          <GitFork className="w-4 h-4 text-brand-400" /> {repo.title}
                        </div>
                        <div className="text-xs text-neutral-400 mt-1">{repo.desc}</div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs px-2 py-0.5 rounded bg-brand-500/10 text-brand-300 border border-brand-500/20">
                          {repo.issues}
                        </span>
                        <span className="text-xs text-neutral-400 font-mono flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> {repo.stars}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pillars Section */}
      <section id="features" className="relative z-10 py-24 border-t border-neutral-800/80 bg-neutral-950/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-brand-400 mb-3">
              Built For The Modern Student & Hacker
            </h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Everything your developer journey needs, united under one grid.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group p-8 rounded-2xl bg-neutral-900/40 border border-neutral-800 hover:border-brand-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-brand-500/5 hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Code2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Competitive Problem Arena</h3>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Hundreds of curated challenges categorized by Data Structures, Algorithms, System Design, and Concurrency with automated judge metrics.
              </p>
              <Link href="/problems" className="inline-flex items-center gap-1 text-xs font-semibold text-brand-400 mt-4 group-hover:underline">
                Explore Problems <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Feature 2 */}
            <div className="group p-8 rounded-2xl bg-neutral-900/40 border border-neutral-800 hover:border-amber-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/5 hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Trophy className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Live Contests & Hackathons</h3>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Compete in timed bi-weekly contests with automated anti-cheat, dynamic Elo ratings, and college vs college team clashes.
              </p>
              <Link href="/contests" className="inline-flex items-center gap-1 text-xs font-semibold text-amber-400 mt-4 group-hover:underline">
                Upcoming Contests <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Feature 3 */}
            <div className="group p-8 rounded-2xl bg-neutral-900/40 border border-neutral-800 hover:border-emerald-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/5 hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <GitFork className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Open-Source Hub & Radar</h3>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Connect your GitHub repo, tag beginner-friendly tasks, match with co-builders, and turn academic projects into production software.
              </p>
              <Link href="/opensource" className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 mt-4 group-hover:underline">
                Contribute Now <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Feature 4 */}
            <div className="group p-8 rounded-2xl bg-neutral-900/40 border border-neutral-800 hover:border-cyan-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/5 hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Placement & Company Archives</h3>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Senior interview debriefs, question patterns from Google, Microsoft, Atlassian, and top tier startups with verified solution breakdowns.
              </p>
              <Link href="/placements" className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-400 mt-4 group-hover:underline">
                Interview Prep <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Feature 5 */}
            <div className="group p-8 rounded-2xl bg-neutral-900/40 border border-neutral-800 hover:border-purple-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/5 hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Collegiate Guild Leaderboard</h3>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Represent your college, accumulate points on every merge and solved challenge, and bring your engineering campus to the top of national rankings.
              </p>
              <Link href="/leaderboard" className="inline-flex items-center gap-1 text-xs font-semibold text-purple-400 mt-4 group-hover:underline">
                View Ranks <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Feature 6 */}
            <div className="group p-8 rounded-2xl bg-neutral-900/40 border border-neutral-800 hover:border-pink-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-pink-500/5 hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Supabase Real-Time Backend</h3>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Instant authentication, secure row-level security, live comment notifications, and instant leaderboard recalculations powered by Postgres.
              </p>
              <Link href="/dashboard" className="inline-flex items-center gap-1 text-xs font-semibold text-pink-400 mt-4 group-hover:underline">
                Explore Tech Stack <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* College Community Banner */}
      <section id="community" className="py-20 border-t border-neutral-800/80 bg-[#0a0d12]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs uppercase tracking-widest text-neutral-500 font-semibold mb-6">
            Trusted by active student developers across engineering colleges
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14 text-neutral-400 font-semibold text-base sm:text-lg">
            <span className="hover:text-white transition-colors">BMSCE Bangalore</span>
            <span className="hover:text-white transition-colors">RV College of Engg</span>
            <span className="hover:text-white transition-colors">IIT Bombay</span>
            <span className="hover:text-white transition-colors">PES University</span>
            <span className="hover:text-white transition-colors">MSRIT</span>
            <span className="hover:text-white transition-colors">NIT Karnataka</span>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl bg-gradient-to-b from-brand-900/40 via-neutral-900 to-neutral-950 border border-brand-500/30 p-10 sm:p-14 text-center overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-1/4 w-72 h-72 bg-brand-500/20 blur-[90px] rounded-full pointer-events-none" />
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Ready to elevate your engineering game?
            </h2>
            <p className="mt-4 text-base sm:text-lg text-neutral-300 max-w-xl mx-auto">
              Join thousands of developers solving problems, collaborating on open-source, and landing dream engineering offers.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white hover:bg-neutral-100 text-neutral-950 font-bold text-base shadow-xl transition-all"
              >
                Create Account Free
              </Link>
              <Link
                href="/dashboard"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-white font-semibold text-base transition-all"
              >
                Explore Live Demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-800/80 bg-neutral-950 py-12 text-sm text-neutral-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="MergeGrid Logo" className="w-7 h-7 object-contain" />
            <span className="font-bold text-white">MergeGrid</span>
            <span className="text-xs text-neutral-500">© 2026 MergeGrid. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6 text-xs text-neutral-400">
            <Link href="/problems" className="hover:text-white transition-colors">Problems</Link>
            <Link href="/contests" className="hover:text-white transition-colors">Contests</Link>
            <Link href="/opensource" className="hover:text-white transition-colors">Open Source</Link>
            <Link href="/placements" className="hover:text-white transition-colors">Placements</Link>
            <Link href="/leaderboard" className="hover:text-white transition-colors">Leaderboard</Link>
            <Link href="/login" className="hover:text-white transition-colors">Login</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
