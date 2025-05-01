-- Initial Supabase schema for Squire
-- Convention: Use plural table names, snake_case for columns.

-- User specific settings and preferences
create table user_settings (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null unique, -- Link to Supabase auth user
  phone_number text, -- For SMS digests
  classification_threshold smallint default 70 not null check (classification_threshold >= 0 and classification_threshold <= 100),
  -- Other preferences like SMS frequency, timezone, etc.
  created_at timestamptz default timezone('utc', now()) not null,
  updated_at timestamptz
);

-- Log of processed emails (consider TTL/redaction strategy)
create table processed_emails (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  gmail_message_id text not null, -- Store Gmail's unique ID
  received_at timestamptz not null,
  classification text not null, -- e.g., 'spam', 'ai', 'human', 'warm'
  confidence_score smallint check (confidence_score >= 0 and confidence_score <= 100),
  action_taken text, -- e.g., 'replied', 'archived', 'blocked', 'forwarded_altbot'
  processed_at timestamptz default timezone('utc', now()) not null,
  -- Store redacted body or key features? TBD based on privacy/retention needs.
  unique (user_id, gmail_message_id) -- Prevent duplicate processing
);

-- Blocklist for senders
create table blocklist (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  sender_address text not null,
  created_at timestamptz default timezone('utc', now()) not null,
  unique (user_id, sender_address)
);

-- Placeholder for Altbot integration config/logs if needed within Supabase
-- create table altbot_handoffs (...);

-- Enable Row Level Security (RLS)
alter table user_settings enable row level security;
alter table processed_emails enable row level security;
alter table blocklist enable row level security;

-- RLS Policies: Users can only access their own data
create policy "Allow users to manage their own settings" on user_settings
  for all using (auth.uid() = user_id);

create policy "Allow users to view their processed emails" on processed_emails
  for select using (auth.uid() = user_id);
-- Note: Insert/Update/Delete for processed_emails likely handled by service role key

create policy "Allow users to manage their own blocklist" on blocklist
  for all using (auth.uid() = user_id);

-- Add indexes for common lookups
create index idx_user_settings_user_id on user_settings(user_id);
create index idx_processed_emails_user_id on processed_emails(user_id);
create index idx_blocklist_user_id on blocklist(user_id); 