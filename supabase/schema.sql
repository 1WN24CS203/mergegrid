-- ====================================================================
-- MergeGrid Unified Database Schema for Supabase PostgreSQL
-- Project Dashboard: https://supabase.com/dashboard/project/qekvjxpfzhikqpythogw/sql
-- ====================================================================
-- INSTRUCTIONS:
-- 1. Copy the entire contents of this file.
-- 2. Open your Supabase Project SQL Editor:
--    https://supabase.com/dashboard/project/qekvjxpfzhikqpythogw/sql/new
-- 3. Paste and click "RUN" (or Ctrl + Enter).
-- ====================================================================

-- 1. Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. PROFILES Table (Publicly visible user directory)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT DEFAULT 'Student engineer practicing algorithms and system design on MergeGrid.',
  college TEXT DEFAULT 'Engineering Guild',
  github_url TEXT,
  portfolio_url TEXT,
  skills TEXT[] DEFAULT ARRAY['TypeScript', 'Python', 'C++', 'PostgreSQL', 'TailwindCSS'],
  role TEXT DEFAULT 'member' CHECK (role IN ('member', 'moderator', 'admin')),
  reputation_points INTEGER DEFAULT 120,
  problems_solved INTEGER DEFAULT 0,
  streak_days INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CUSTOM_PROBLEMS Table (Community & AI-Reviewed problems saved to DB)
CREATE TABLE IF NOT EXISTS public.custom_problems (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  difficulty TEXT DEFAULT 'Medium' CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  category TEXT DEFAULT 'Arrays & Hashing',
  companies TEXT[] DEFAULT ARRAY['Community'],
  description TEXT NOT NULL,
  examples JSONB DEFAULT '[]'::jsonb,
  constraints TEXT[] DEFAULT ARRAY[]::text[],
  starter_code JSONB DEFAULT '{}'::jsonb,
  acceptance TEXT DEFAULT '54%',
  author_name TEXT DEFAULT 'Community Developer',
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  impact_score INTEGER DEFAULT 85,
  status TEXT DEFAULT 'approved',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. USER_SOLVED_PROBLEMS Table (Tracks problems completed per user)
CREATE TABLE IF NOT EXISTS public.user_solved_problems (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  problem_id TEXT NOT NULL,
  solved_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, problem_id)
);

-- 5. USER_PREFERENCES Table
CREATE TABLE IF NOT EXISTS public.user_preferences (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
  theme TEXT DEFAULT 'system',
  email_notifications BOOLEAN DEFAULT TRUE,
  contest_reminders BOOLEAN DEFAULT TRUE,
  show_college BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_solved_problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- Profiles: Publicly readable so registered users are visible to everyone on Leaderboard
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id OR auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Custom Problems: Anyone can view, authenticated users or community can insert
DROP POLICY IF EXISTS "Custom problems are viewable by everyone" ON public.custom_problems;
CREATE POLICY "Custom problems are viewable by everyone"
  ON public.custom_problems FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Anyone can publish custom problems" ON public.custom_problems;
CREATE POLICY "Anyone can publish custom problems"
  ON public.custom_problems FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authors can update their problems" ON public.custom_problems;
CREATE POLICY "Authors can update their problems"
  ON public.custom_problems FOR UPDATE
  USING (auth.uid() = created_by OR created_by IS NULL);

-- Solved Problems: Users can view all solved counts & manage their own
DROP POLICY IF EXISTS "Solved records are viewable by everyone" ON public.user_solved_problems;
CREATE POLICY "Solved records are viewable by everyone"
  ON public.user_solved_problems FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can record their solved problems" ON public.user_solved_problems;
CREATE POLICY "Users can record their solved problems"
  ON public.user_solved_problems FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their solved records" ON public.user_solved_problems;
CREATE POLICY "Users can delete their solved records"
  ON public.user_solved_problems FOR DELETE
  USING (auth.uid() = user_id);

-- User Preferences: Private to owner
DROP POLICY IF EXISTS "Users can view their own preferences" ON public.user_preferences;
CREATE POLICY "Users can view their own preferences"
  ON public.user_preferences FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own preferences" ON public.user_preferences;
CREATE POLICY "Users can insert their own preferences"
  ON public.user_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own preferences" ON public.user_preferences;
CREATE POLICY "Users can update their own preferences"
  ON public.user_preferences FOR UPDATE
  USING (auth.uid() = user_id);

-- ====================================================================
-- AUTOMATIC TRIGGERS & FUNCTIONS
-- ====================================================================

-- Trigger Function: Automatically create profile on new user signup (Email or OAuth)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  extracted_username TEXT;
  extracted_name TEXT;
  extracted_avatar TEXT;
BEGIN
  -- Extract GitHub username or email prefix
  extracted_username := COALESCE(
    NEW.raw_user_meta_data->>'user_name',
    NEW.raw_user_meta_data->>'preferred_username',
    split_part(NEW.email, '@', 1),
    'dev_' || substr(NEW.id::text, 1, 6)
  );

  -- Extract display name
  extracted_name := COALESCE(
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'name',
    NEW.raw_user_meta_data->>'display_name',
    extracted_username,
    'Developer'
  );

  -- Extract avatar
  extracted_avatar := COALESCE(
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.raw_user_meta_data->>'picture',
    'https://github.com/' || extracted_username || '.png'
  );

  -- Insert profile
  INSERT INTO public.profiles (
    id,
    username,
    display_name,
    avatar_url,
    github_url,
    reputation_points,
    problems_solved
  )
  VALUES (
    NEW.id,
    extracted_username,
    extracted_name,
    extracted_avatar,
    'https://github.com/' || extracted_username,
    120,
    0
  )
  ON CONFLICT (id) DO UPDATE SET
    display_name = COALESCE(EXCLUDED.display_name, public.profiles.display_name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, public.profiles.avatar_url),
    updated_at = NOW();

  -- Insert preferences
  INSERT INTO public.user_preferences (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger Function: Keep problems_solved counter in sync
CREATE OR REPLACE FUNCTION public.sync_problems_solved_counter()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    UPDATE public.profiles
    SET problems_solved = problems_solved + 1,
        reputation_points = reputation_points + 50,
        updated_at = NOW()
    WHERE id = NEW.user_id;
  ELSIF (TG_OP = 'DELETE') THEN
    UPDATE public.profiles
    SET problems_solved = GREATEST(0, problems_solved - 1),
        reputation_points = GREATEST(100, reputation_points - 50),
        updated_at = NOW()
    WHERE id = OLD.user_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_problem_solved_changed ON public.user_solved_problems;
CREATE TRIGGER on_problem_solved_changed
  AFTER INSERT OR DELETE ON public.user_solved_problems
  FOR EACH ROW EXECUTE FUNCTION public.sync_problems_solved_counter();

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles (username);
CREATE INDEX IF NOT EXISTS idx_profiles_problems_solved ON public.profiles (problems_solved DESC);
CREATE INDEX IF NOT EXISTS idx_custom_problems_created_at ON public.custom_problems (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_solved_problems_user ON public.user_solved_problems (user_id);

-- ====================================================================
-- 6. GROUPS Table (Friends Groups & Official Campus Guilds)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.groups (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  description TEXT,
  group_type TEXT NOT NULL DEFAULT 'friends' CHECK (group_type IN ('friends', 'official', 'guild', 'study')),
  leader_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  avatar_url TEXT,
  practice_topics TEXT[] DEFAULT ARRAY['Algorithms', 'Data Structures', 'Dynamic Programming'],
  member_count INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- 7. GROUP_MEMBERS Table (Membership & Roles)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.group_members (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT DEFAULT 'member' CHECK (role IN ('leader', 'admin', 'member')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(group_id, user_id)
);

-- ====================================================================
-- 8. CONTESTS Table (Clashes, Speedruns, & Targeted Challenges)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.contests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  start_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  end_time TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'live', 'ended')),
  target_type TEXT DEFAULT 'all' CHECK (target_type IN ('all', 'selected_friends')),
  invited_user_ids UUID[] DEFAULT ARRAY[]::UUID[],
  problem_ids TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Enablement
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contests ENABLE ROW LEVEL SECURITY;

-- Groups Policies
DROP POLICY IF EXISTS "Groups are viewable by everyone" ON public.groups;
CREATE POLICY "Groups are viewable by everyone"
  ON public.groups FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can create groups" ON public.groups;
CREATE POLICY "Authenticated users can create groups"
  ON public.groups FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Group leaders can update their group" ON public.groups;
CREATE POLICY "Group leaders can update their group"
  ON public.groups FOR UPDATE
  USING (auth.uid() = leader_id);

-- Group Members Policies
DROP POLICY IF EXISTS "Group members are viewable by everyone" ON public.group_members;
CREATE POLICY "Group members are viewable by everyone"
  ON public.group_members FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can join groups" ON public.group_members;
CREATE POLICY "Users can join groups"
  ON public.group_members FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Members can leave groups" ON public.group_members;
CREATE POLICY "Members can leave groups"
  ON public.group_members FOR DELETE
  USING (auth.uid() = user_id);

-- Contests Policies
DROP POLICY IF EXISTS "Contests are viewable by everyone" ON public.contests;
CREATE POLICY "Contests are viewable by everyone"
  ON public.contests FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Contest creation RLS" ON public.contests;
CREATE POLICY "Contest creation RLS"
  ON public.contests FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- ====================================================================
-- CONTEST CREATION PERMISSION ENFORCEMENT TRIGGER
-- Rule 1: In friends group, ANY member can call for contest (even by selecting some people).
-- Rule 2: In other groups (official/guild), ONLY group leaders can create contests.
-- ====================================================================
CREATE OR REPLACE FUNCTION public.enforce_contest_creation_rules()
RETURNS TRIGGER AS $$
DECLARE
  v_group_type TEXT;
  v_leader_id UUID;
  v_is_member BOOLEAN;
BEGIN
  -- If contest is tied to a group, strictly enforce permission rules
  IF NEW.group_id IS NOT NULL THEN
    SELECT group_type, leader_id INTO v_group_type, v_leader_id
    FROM public.groups
    WHERE id = NEW.group_id;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Target group does not exist';
    END IF;

    IF v_group_type = 'friends' THEN
      -- In a friends group, ANY member of the group can call a contest
      SELECT EXISTS (
        SELECT 1 FROM public.group_members
        WHERE group_id = NEW.group_id AND user_id = NEW.created_by
      ) INTO v_is_member;

      -- If the creator is the leader or in group_members, allow
      IF NOT v_is_member AND NEW.created_by != v_leader_id THEN
        RAISE EXCEPTION 'Only members of this friends group can call a contest';
      END IF;
    ELSE
      -- In official/guild/other groups, ONLY the group leader can create contests
      IF NEW.created_by != v_leader_id THEN
        RAISE EXCEPTION 'Only the group leader can create contests in non-friends groups (% group)', v_group_type;
      END IF;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_enforce_contest_creation ON public.contests;
CREATE TRIGGER trg_enforce_contest_creation
  BEFORE INSERT ON public.contests
  FOR EACH ROW EXECUTE FUNCTION public.enforce_contest_creation_rules();

-- Indexes for groups & contests
CREATE INDEX IF NOT EXISTS idx_groups_slug ON public.groups (slug);
CREATE INDEX IF NOT EXISTS idx_groups_type ON public.groups (group_type);
CREATE INDEX IF NOT EXISTS idx_group_members_group_user ON public.group_members (group_id, user_id);
CREATE INDEX IF NOT EXISTS idx_contests_group ON public.contests (group_id);
CREATE INDEX IF NOT EXISTS idx_contests_status ON public.contests (status);
