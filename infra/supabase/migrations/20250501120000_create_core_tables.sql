-- Migration: Create core tables for Squire application

-- Enable UUID generation if not already enabled
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table linked to Supabase Auth
CREATE TABLE public.users (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL,
    email text,
    preferences jsonb DEFAULT '{}'::jsonb
);
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
-- Add policies as needed, e.g.:
-- CREATE POLICY "Allow individual read access" ON public.users FOR SELECT USING (auth.uid() = id);
-- CREATE POLICY "Allow individual update access" ON public.users FOR UPDATE USING (auth.uid() = id);

-- Emails table for storing processed email metadata
CREATE TABLE public.emails (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    gmail_message_id text NOT NULL,
    gmail_thread_id text,
    subject text,
    sender_address text,
    sender_name text,
    received_at timestamptz,
    processed_at timestamptz,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL,
    raw_content_preview text,
    UNIQUE (user_id, gmail_message_id) -- Ensure unique email per user
);
ALTER TABLE public.emails ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_emails_user_id ON public.emails(user_id);
CREATE INDEX idx_emails_received_at ON public.emails(received_at DESC);
-- Add policies, e.g.:
-- CREATE POLICY "Allow user access" ON public.emails FOR ALL USING (auth.uid() = user_id);

-- Email Classifications table
CREATE TABLE public.email_classifications (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    email_id uuid NOT NULL REFERENCES public.emails(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE, -- Denormalized for simpler policy/querying
    classification text,
    confidence_score numeric,
    llm_model_used text,
    prompt_version text,
    classified_at timestamptz DEFAULT now(),
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);
ALTER TABLE public.email_classifications ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_email_classifications_email_id ON public.email_classifications(email_id);
CREATE INDEX idx_email_classifications_user_id ON public.email_classifications(user_id);
-- Add policies, e.g.:
-- CREATE POLICY "Allow user access" ON public.email_classifications FOR ALL USING (auth.uid() = user_id);

-- Email Actions table
CREATE TABLE public.email_actions (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    email_id uuid NOT NULL REFERENCES public.emails(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE, -- Denormalized
    action_type text NOT NULL, -- e.g., 'delete', 'archive', 'label', 'draft_created'
    action_details jsonb DEFAULT '{}'::jsonb,
    status text DEFAULT 'completed' NOT NULL, -- e.g., 'pending_approval', 'completed', 'failed'
    performed_by text DEFAULT 'agent' NOT NULL, -- 'agent' or 'user'
    performed_at timestamptz DEFAULT now(),
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);
ALTER TABLE public.email_actions ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_email_actions_email_id ON public.email_actions(email_id);
CREATE INDEX idx_email_actions_user_id ON public.email_actions(user_id);
CREATE INDEX idx_email_actions_status ON public.email_actions(status);
-- Add policies, e.g.:
-- CREATE POLICY "Allow user access" ON public.email_actions FOR ALL USING (auth.uid() = user_id);

-- Daily Digests table
CREATE TABLE public.daily_digests (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    digest_date date NOT NULL,
    stats jsonb DEFAULT '{}'::jsonb,
    highlighted_email_ids uuid[], -- Array of email IDs
    generated_at timestamptz DEFAULT now(),
    sent_at timestamptz,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL,
    UNIQUE (user_id, digest_date)
);
ALTER TABLE public.daily_digests ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_daily_digests_user_id_date ON public.daily_digests(user_id, digest_date DESC);
-- Add policies, e.g.:
-- CREATE POLICY "Allow user access" ON public.daily_digests FOR ALL USING (auth.uid() = user_id);

-- Function to update 'updated_at' column automatically
CREATE OR REPLACE FUNCTION public.trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply the trigger function to relevant tables
CREATE TRIGGER set_timestamp_users
BEFORE UPDATE ON public.users
FOR EACH ROW
EXECUTE FUNCTION public.trigger_set_timestamp();

CREATE TRIGGER set_timestamp_emails
BEFORE UPDATE ON public.emails
FOR EACH ROW
EXECUTE FUNCTION public.trigger_set_timestamp();

CREATE TRIGGER set_timestamp_email_classifications
BEFORE UPDATE ON public.email_classifications
FOR EACH ROW
EXECUTE FUNCTION public.trigger_set_timestamp();

CREATE TRIGGER set_timestamp_email_actions
BEFORE UPDATE ON public.email_actions
FOR EACH ROW
EXECUTE FUNCTION public.trigger_set_timestamp();

CREATE TRIGGER set_timestamp_daily_digests
BEFORE UPDATE ON public.daily_digests
FOR EACH ROW
EXECUTE FUNCTION public.trigger_set_timestamp(); 