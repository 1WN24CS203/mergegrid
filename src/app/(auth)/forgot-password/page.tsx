'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/toast';
import { createClient } from '@/lib/supabase/client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({ type: 'error', title: 'Please enter your email' });
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login`,
      });
      setSubmitted(true);
      toast({
        type: 'success',
        title: 'Reset instructions sent',
        message: 'If an account exists with that email, you will receive a reset link.',
      });
    } catch {
      setSubmitted(true);
      toast({
        type: 'info',
        title: 'Demo / Offline mode',
        message: 'Password reset link simulated for demo purposes.',
      });
    } finally {
      setLoading(false);
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
          Reset password
        </h2>
        <p className="text-sm text-neutral-500 mt-1.5">
          Enter your registered college or personal email to receive a password reset link.
        </p>
      </div>

      {submitted ? (
        <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
          <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-neutral-900">Check your inbox</h3>
          <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
            We sent a password reset link to <span className="font-semibold">{email}</span>.
          </p>
          <div className="mt-5">
            <Link href="/login">
              <Button size="sm" variant="outline" className="w-full">
                Back to Sign in
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleReset} className="space-y-4">
          <Input
            label="Email address"
            type="email"
            placeholder="you@college.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<Mail className="w-4 h-4" />}
            required
          />

          <Button type="submit" size="lg" loading={loading} className="w-full">
            Send Reset Link
          </Button>

          <div className="text-center mt-4">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to sign in
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
