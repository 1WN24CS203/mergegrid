export type UserRole = 'member' | 'project_lead' | 'contest_organizer' | 'moderator' | 'admin';

export interface Profile {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string | null;
  bio: string | null;
  college: string | null;
  github_url: string | null;
  portfolio_url: string | null;
  skills: string[];
  role: UserRole;
  reputation_points: number;
  problems_solved: number;
  current_streak: number;
  longest_streak: number;
  created_at: string;
  updated_at: string;
}

export interface UserPreferences {
  user_id: string;
  theme: 'light' | 'dark' | 'system';
  email_notifications: boolean;
  show_college: boolean;
  show_email: boolean;
  created_at: string;
  updated_at: string;
}

export type Difficulty = 'easy' | 'medium' | 'hard';

export type SubmissionStatus =
  | 'queued'
  | 'running'
  | 'accepted'
  | 'wrong_answer'
  | 'compilation_error'
  | 'time_limit_exceeded'
  | 'runtime_error'
  | 'internal_error';

export type GoalCategory =
  | 'development'
  | 'dsa'
  | 'open_source'
  | 'projects'
  | 'career'
  | 'community';

export type GoalStatus = 'active' | 'completed' | 'abandoned';

export interface WeeklyGoal {
  id: string;
  user_id: string;
  title: string;
  category: GoalCategory;
  target_date: string;
  success_criteria: string | null;
  evidence_url: string | null;
  status: GoalStatus;
  retrospective: string | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  link: string | null;
  is_read: boolean;
  created_at: string;
}
