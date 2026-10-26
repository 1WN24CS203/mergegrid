'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/toast';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const redirectTo = searchParams.get('redirect') || '/dashboard';

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
        toast({ type: 'error', title: 'Login failed', message: error.message });
      } else {
        toast({ type: 'success', title: 'Welcome back!' });
        router.push(redirectTo);
        router.refresh();
      }
    } catch {
      toast({ type: 'error', title: 'Something went wrong' });
    } finally {
      setLoading(false);
    }
  };

  const handleGitHubLogin = async () => {
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?redirect=${redirectTo}`,
        },
      });
      if (error) {
        toast({ type: 'error', title: 'GitHub login failed', message: error.message });
      }
    } catch {
      toast({ type: 'error', title: 'Something went wrong' });
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Mobile logo */}
      <div className="flex justify-center lg:hidden mb-8">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="MergeGrid" className="w-8 h-8" />
          <span className="text-xl font-bold text-neutral-900">
            Merge<span className="text-brand-600">Grid</span>
          </span>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">
          Welcome back
        </h2>
        <p className="text-sm text-neutral-500 mt-1.5">
          Sign in to continue to your workspace
        </p>
      </div>

      {/* GitHub OAuth */}
      <Button
        variant="outline"
        size="lg"
        className="w-full mb-6"
        onClick={handleGitHubLogin}
        icon={<Github className="w-4 h-4" />}
      >
        Continue with GitHub
      </Button>

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
          placeholder="you@example.com"
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
          className="text-brand-600 hover:text-brand-700 font-medium transition-colors"
        >
          Create account
        </Link>
      </p>
    </div>
  );
}
