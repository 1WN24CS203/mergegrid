'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, User } from 'lucide-react';
import { Github } from '@/components/ui/icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/toast';
import { createClient } from '@/lib/supabase/client';

export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName || !email || !password || !confirmPassword) {
      toast({ type: 'error', title: 'Please fill in all fields' });
      return;
    }

    if (password.length < 8) {
      toast({ type: 'error', title: 'Password must be at least 8 characters' });
      return;
    }

    if (password !== confirmPassword) {
      toast({ type: 'error', title: 'Passwords do not match' });
      return;
    }

    if (!agreed) {
      toast({ type: 'error', title: 'Please agree to the terms' });
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: fullName,
          },
        },
      });

      if (error) {
        toast({ type: 'error', title: 'Registration failed', message: error.message });
      } else {
        toast({
          type: 'success',
          title: 'Account created!',
          message: 'Check your email to verify your account.',
        });
        router.push('/login');
      }
    } catch {
      toast({ type: 'error', title: 'Something went wrong' });
    } finally {
      setLoading(false);
    }
  };

  const handleGitHubSignUp = async () => {
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?redirect=/dashboard`,
        },
      });
      if (error) {
        toast({ type: 'error', title: 'GitHub sign up failed', message: error.message });
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
          Create your account
        </h2>
        <p className="text-sm text-neutral-500 mt-1.5">
          Join the developer community
        </p>
      </div>

      {/* GitHub OAuth */}
      <Button
        variant="outline"
        size="lg"
        className="w-full mb-6"
        onClick={handleGitHubSignUp}
        icon={<Github className="w-4 h-4" />}
      >
        Sign up with GitHub
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

      <form onSubmit={handleRegister} className="space-y-4">
        <Input
          label="Full name"
          type="text"
          placeholder="Jane Doe"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          icon={<User className="w-4 h-4" />}
          autoComplete="name"
          required
        />

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
            placeholder="Min. 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<Lock className="w-4 h-4" />}
            autoComplete="new-password"
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

        <Input
          label="Confirm password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Repeat your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          icon={<Lock className="w-4 h-4" />}
          autoComplete="new-password"
          required
        />

        {/* Password strength indicator */}
        {password && (
          <div className="flex gap-1">
            {[1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  password.length >= level * 3
                    ? level <= 2
                      ? 'bg-amber-400'
                      : 'bg-green-500'
                    : 'bg-neutral-200'
                }`}
              />
            ))}
          </div>
        )}

        <label className="flex items-start gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="w-3.5 h-3.5 mt-0.5 rounded border-neutral-300 text-brand-600 focus:ring-brand-500"
          />
          <span className="text-xs text-neutral-600 leading-relaxed">
            I agree to the{' '}
            <Link href="#" className="text-brand-600 hover:text-brand-700">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="#" className="text-brand-600 hover:text-brand-700">
              Privacy Policy
            </Link>
          </span>
        </label>

        <Button type="submit" size="lg" loading={loading} className="w-full">
          Create account
        </Button>
      </form>

      <p className="text-center text-sm text-neutral-500 mt-6">
        Already have an account?{' '}
        <Link
          href="/login"
          className="text-brand-600 hover:text-brand-700 font-medium transition-colors"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
