-- Friction-to-Flow AI Audit Database Schema
-- Version: 1.0
-- Run this in the Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- Users Table (extends Supabase auth.users)
-- ============================================
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR NOT NULL UNIQUE,
  name VARCHAR,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Survey Responses Table
-- ============================================
CREATE TABLE public.survey_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  responses JSONB NOT NULL,
  archetype VARCHAR,
  weekly_friction_hours DECIMAL,
  ai_readiness_score INTEGER,
  automation_potential INTEGER,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster lookups
CREATE INDEX idx_survey_responses_user_id ON public.survey_responses(user_id);
CREATE INDEX idx_survey_responses_archetype ON public.survey_responses(archetype);
CREATE INDEX idx_survey_responses_completed_at ON public.survey_responses(completed_at DESC);

-- ============================================
-- AI Outputs Table
-- ============================================
CREATE TABLE public.ai_outputs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  response_id UUID REFERENCES public.survey_responses(id) ON DELETE CASCADE,
  toolkit_recommendations JSONB,
  automation_opportunities JSONB,
  narrative TEXT,
  core_recommendation TEXT,
  generated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster lookups
CREATE INDEX idx_ai_outputs_response_id ON public.ai_outputs(response_id);

-- ============================================
-- Tool Config Table (for editable tutorial URLs)
-- ============================================
CREATE TABLE public.tool_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_name VARCHAR NOT NULL UNIQUE,
  tutorial_url VARCHAR,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default tool configurations
INSERT INTO public.tool_config (tool_name, tutorial_url) VALUES
  ('NotebookLM', NULL),
  ('Claude / Gemini / ChatGPT', NULL),
  ('AI Studio', NULL),
  ('Claude Cowork', NULL),
  ('Custom Agents', NULL);

-- ============================================
-- Row Level Security Policies
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_outputs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tool_config ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read own data"
  ON public.users
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON public.users
  FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own data"
  ON public.users
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Admin can read all users
CREATE POLICY "Admins can read all users"
  ON public.users
  FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = TRUE)
  );

-- Survey responses policies
CREATE POLICY "Users can read own surveys"
  ON public.survey_responses
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own surveys"
  ON public.survey_responses
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own surveys"
  ON public.survey_responses
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Admin can read all surveys
CREATE POLICY "Admins can read all surveys"
  ON public.survey_responses
  FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = TRUE)
  );

-- AI outputs policies
CREATE POLICY "Users can read own AI outputs"
  ON public.ai_outputs
  FOR SELECT
  USING (
    response_id IN (SELECT id FROM public.survey_responses WHERE user_id = auth.uid())
  );

CREATE POLICY "Service role can insert AI outputs"
  ON public.ai_outputs
  FOR INSERT
  WITH CHECK (TRUE);

-- Admin can read all AI outputs
CREATE POLICY "Admins can read all AI outputs"
  ON public.ai_outputs
  FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = TRUE)
  );

-- Tool config policies (everyone can read, admins can update)
CREATE POLICY "Anyone can read tool config"
  ON public.tool_config
  FOR SELECT
  USING (TRUE);

CREATE POLICY "Admins can update tool config"
  ON public.tool_config
  FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = TRUE)
  );

-- ============================================
-- Functions and Triggers
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for users table
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for tool_config table
CREATE TRIGGER update_tool_config_updated_at
  BEFORE UPDATE ON public.tool_config
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on auth.users insert
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- Views for Admin Dashboard
-- ============================================

-- View for aggregated survey stats
CREATE OR REPLACE VIEW public.survey_stats AS
SELECT
  COUNT(DISTINCT user_id) as total_respondents,
  COUNT(*) as total_responses,
  AVG(weekly_friction_hours) as avg_friction_hours,
  AVG(ai_readiness_score) as avg_ai_readiness,
  AVG(automation_potential) as avg_automation_potential
FROM public.survey_responses
WHERE completed_at IS NOT NULL;

-- View for archetype distribution
CREATE OR REPLACE VIEW public.archetype_distribution AS
SELECT
  archetype,
  COUNT(*) as count,
  ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM public.survey_responses WHERE completed_at IS NOT NULL), 1) as percentage
FROM public.survey_responses
WHERE completed_at IS NOT NULL AND archetype IS NOT NULL
GROUP BY archetype
ORDER BY count DESC;

-- Grant access to views for authenticated users
GRANT SELECT ON public.survey_stats TO authenticated;
GRANT SELECT ON public.archetype_distribution TO authenticated;
