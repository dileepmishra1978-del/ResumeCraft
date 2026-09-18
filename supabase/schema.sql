-- ResumeCraft Database Schema

-- 1. Resumes table
CREATE TABLE IF NOT EXISTS public.resumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'Untitled Resume',
  target_role TEXT,
  template TEXT NOT NULL DEFAULT 'engineeringresumes',
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  ats_score INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. User Usage and Subscription table
CREATE TABLE IF NOT EXISTS public.user_usage (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  is_pro BOOLEAN DEFAULT FALSE,
  ai_rewrites_used INT DEFAULT 0,
  resumes_count INT DEFAULT 0,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_usage ENABLE ROW LEVEL SECURITY;

-- Policies for resumes
CREATE POLICY "Users can manage their own resumes"
  ON public.resumes
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policies for user_usage
CREATE POLICY "Users can view their own usage"
  ON public.user_usage
  FOR SELECT
  USING (auth.uid() = user_id);

