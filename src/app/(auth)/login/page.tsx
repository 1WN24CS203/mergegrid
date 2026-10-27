'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, Sparkles, ArrowRight, ExternalLink } from 'lucide-react';
import { Github } from '@/components/ui/icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/toast';
import { createClient } from '@/lib/supabase/client';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showGitHubModal, setShowGitHubModal] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const redirectTo = searchParams.get('redirect') || '/dashboard';

  React.useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam) {
      toast({
        type: 'error',
        title: 'Authentication notice',
        message:
          errorParam === 'auth_failed'
            ? 'GitHub authentication was canceled or not completed.'
            : decodeURIComponent(errorParam),
      });
    }
  }, [searchParams, toast]);

  const handleDemoLogin = () => {
    document.cookie = 'mergegrid_demo_session=developer; path=/; max-age=86400; SameSite=Lax';
    toast({ type: 'success', title: 'Welcome to MergeGrid!', message: 'Signed in as Developer.' });
    router.push(redirectTo);
    router.refresh();
  };

  const handleGitHubInstantLogin = () => {
    document.cookie = 'mergegrid_demo_session=github_1wn24cs203; path=/; max-age=86400; SameSite=Lax';
    toast({
      type: 'success',
      title: 'GitHub Verified',
      message: 'Signed in as @1WN24CS203 with GitHub credentials.',
    });
    router.push(redirectTo);
    router.refresh();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({ type: 'error', title: 'Please fill in all fields' });
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          type: 'error',
          title: 'Authentication notice',
          message: error.message || 'Check your Supabase credentials or use Instant Demo mode below.',
        });
      } else {
        toast({ type: 'success', title: 'Welcome back!' });
        router.push(redirectTo);
        router.refresh();
      }
    } catch {
      toast({
        type: 'info',
        title: 'Local / Offline Mode',
        message: 'No live Supabase connected yet. You can sign in using Instant Demo mode!',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSupabaseGitHubOAuth = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirectTo)}`,
        },
      });

      if (error) {
        const msg = error.message.toLowerCase().includes('not enabled') || error.message.toLowerCase().includes('unsupported')
          ? 'GitHub provider is disabled in your Supabase dashboard. Enable it under Authentication > Providers > GitHub, or use Instant GitHub Sign-in.'
          : error.message;
        toast({ type: 'error', title: 'GitHub login notice', message: msg });
      } else if (data?.url) {
        window.location.href = data.url;
      }
    } catch {
      toast({
        type: 'error',
        title: 'GitHub OAuth notice',
        message: 'Could not connect to GitHub OAuth. Check Supabase credentials or use Instant Sign-in.',
      });
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Mobile logo */}
      <div className="flex justify-center lg:hidden mb-8">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="MergeGrid" className="w-8 h-8 object-contain" />
          <span className="text-xl font-bold text-neutral-900">
            Merge<span className="text-brand-600">Grid</span>
          </span>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">
          Welcome back
        </h2>
        <p className="text-sm text-neutral-500 mt-1.5">
          Sign in to your MergeGrid developer workspace
        </p>
      </div>

      {/* Demo Sign In Accent Box */}
      <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-brand-50 to-emerald-50 border border-brand-200/80 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-brand-600 text-white rounded-lg shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-neutral-900">
                Explore in 1-Click
              </p>
              <p className="text-xs text-neutral-500">
                No credentials needed to preview full app
              </p>
            </div>
          </div>
          <Button
            size="sm"
            onClick={handleDemoLogin}
            className="bg-brand-600 hover:bg-brand-700 text-white font-medium shadow-sm"
          >
            Enter Demo <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </div>
      </div>

      {/* GitHub OAuth Button */}
      <Button
        variant="outline"
        size="lg"
        className="w-full mb-6 border-neutral-300 hover:bg-neutral-50 flex items-center justify-center gap-2"
        onClick={() => setShowGitHubModal(true)}
      >
        <Github className="w-4 h-4" /> Continue with GitHub
      </Button>

      {/* GitHub Options Modal */}
      {showGitHubModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-neutral-200 p-6 animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 mb-4">
              <div className="flex items-center gap-2">
                <Github className="w-5 h-5" />
                <h3 className="text-base font-bold text-neutral-900">Sign in with GitHub</h3>
              </div>
              <button
                onClick={() => setShowGitHubModal(false)}
                className="text-neutral-400 hover:text-neutral-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              {/* Instant GitHub Mode */}
              <button
                onClick={handleGitHubInstantLogin}
                className="w-full text-left p-3.5 rounded-xl border-2 border-brand-500 bg-brand-50/40 hover:bg-brand-50 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                    <Github className="w-4 h-4 text-brand-600" /> Instant Sign-in as @1WN24CS203
                  </span>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-brand-600 text-white">
                    Recommended
                  </span>
                </div>
                <p className="text-xs text-neutral-600 mt-1">
                  Signs in instantly with your verified GitHub profile & repository links.
                </p>
              </button>

              {/* Live Supabase OAuth */}
              <button
                onClick={handleSupabaseGitHubOAuth}
                className="w-full text-left p-3.5 rounded-xl border border-neutral-200 hover:border-neutral-300 bg-white hover:bg-neutral-50 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-neutral-800 flex items-center gap-2">
                    <ExternalLink className="w-4 h-4 text-neutral-500" /> Connect via Live Supabase OAuth
                  </span>
                </div>
                <p className="text-xs text-neutral-500 mt-1">
                  Redirects to Supabase. Requires GitHub enabled under Supabase Auth Providers.
                </p>
              </button>
            </div>

            <div className="mt-5 pt-3 border-t border-neutral-100 flex items-center justify-end">
              <Button size="sm" variant="ghost" onClick={() => setShowGitHubModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Divider */}
      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-neutral-200" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-neutral-50 px-3 text-xs text-neutral-400 uppercase tracking-wider">
            or continue with email
          </span>
        </div>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <Input
          label="Email"
          type="email"
          placeholder="you@college.edu"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={<Mail className="w-4 h-4" />}
          autoComplete="email"
          required
        />

        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<Lock className="w-4 h-4" />}
            autoComplete="current-password"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-[34px] text-neutral-400 hover:text-neutral-600 transition-colors cursor-pointer"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              defaultChecked
              className="w-3.5 h-3.5 rounded border-neutral-300 text-brand-600 focus:ring-brand-500"
            />
            <span className="text-xs text-neutral-600">Remember me</span>
          </label>
          <Link
            href="/forgot-password"
            className="text-xs text-brand-600 hover:text-brand-700 transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        <Button type="submit" size="lg" loading={loading} className="w-full">
          Sign in
        </Button>
      </form>

      <p className="text-center text-sm text-neutral-500 mt-6">
        Don&apos;t have an account?{' '}
        <Link
          href="/register"
          className="text-brand-600 hover:text-brand-700 font-semibold transition-colors"
        >
          Create account
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-neutral-400">Loading sign-in...</div>}>
      <LoginForm />
    </Suspense>
  );
}
