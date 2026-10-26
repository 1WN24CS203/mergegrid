import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { DashboardContent } from '@/components/dashboard/dashboard-content';

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const displayName =
    user?.user_metadata?.display_name ||
    user?.email?.split('@')[0] ||
    'Developer';

  return <DashboardContent displayName={displayName} />;
}
