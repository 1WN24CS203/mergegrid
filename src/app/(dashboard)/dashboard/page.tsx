import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { DashboardContent } from '@/components/dashboard/dashboard-content';

export default async function DashboardPage() {
  let displayName = 'Alex Rivera';

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const isConfigured = supabaseUrl && !supabaseUrl.includes('placeholder');

  if (isConfigured) {
    try {
      const supabase = await createClient();
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        displayName =
          data.user.user_metadata?.display_name ||
          data.user.email?.split('@')[0] ||
          'Developer';
      }
    } catch {
      displayName = 'Alex Rivera';
    }
  }

  return <DashboardContent displayName={displayName} />;
}
