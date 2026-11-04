import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const redirect = searchParams.get('redirect') || '/dashboard';
  const errorParam = searchParams.get('error_description') || searchParams.get('error');

  if (errorParam) {
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(errorParam)}`);
  }

  if (code) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      if (!error && data?.user) {
        // Guarantee user profile exists in public.profiles table
        const user = data.user;
        const username =
          user.user_metadata?.user_name ||
          user.user_metadata?.preferred_username ||
          user.email?.split('@')[0] ||
          `dev_${user.id.slice(0, 6)}`;
        const displayName =
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          user.user_metadata?.display_name ||
          username;
        const avatarUrl =
          user.user_metadata?.avatar_url ||
          user.user_metadata?.picture ||
          `https://github.com/${username}.png`;

        await supabase.from('profiles').upsert(
          {
            id: user.id,
            username,
            display_name: displayName,
            avatar_url: avatarUrl,
            github_url: `https://github.com/${username}`,
            reputation_points: 120,
            problems_solved: 0,
          },
          { onConflict: 'id' }
        );

        return NextResponse.redirect(`${origin}${redirect}`);
      }

      if (error) {
        return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error.message)}`);
      }

      return NextResponse.redirect(`${origin}${redirect}`);
    } catch {
      return NextResponse.redirect(`${origin}/login?error=auth_failed`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
