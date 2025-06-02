-- Migration: Create prospect_intake table for lead qualification
-- Description: Store prospect intake form submissions with comprehensive lead qualification data

CREATE TABLE prospect_intake (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  -- Contact Information
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  
  -- Company Information
  company TEXT NOT NULL,
  job_title TEXT NOT NULL,
  company_size TEXT NOT NULL CHECK (company_size IN ('1-10', '11-50', '51-200', '201-1000', '1000+')),
  industry TEXT NOT NULL,
  website TEXT,
  
  -- Email Management Pain Points
  current_email_volume TEXT NOT NULL CHECK (current_email_volume IN ('under-50', '50-100', '100-200', '200-500', '500+')),
  time_spent_on_email TEXT NOT NULL CHECK (time_spent_on_email IN ('under-1h', '1-2h', '2-4h', '4-6h', '6h+')),
  biggest_pain_points TEXT[] NOT NULL,
  current_solutions TEXT,
  
  -- Project Details
  primary_goals TEXT[] NOT NULL,
  timeline TEXT NOT NULL CHECK (timeline IN ('immediate', '1-month', '3-months', '6-months', 'exploring')),
  budget TEXT NOT NULL CHECK (budget IN ('under-1k', '1k-5k', '5k-15k', '15k-50k', '50k+', 'no-budget')),
  decision_makers TEXT NOT NULL CHECK (decision_makers IN ('me-only', 'me-plus-1', 'small-team', 'large-committee')),
  
  -- Technical Requirements
  technical_requirements TEXT,
  integration_needs TEXT[],
  security_requirements TEXT,
  
  -- Additional Information
  additional_notes TEXT,
  preferred_contact_method TEXT NOT NULL CHECK (preferred_contact_method IN ('email', 'phone', 'video-call', 'in-person')),
  best_time_to_contact TEXT,
  
  -- Lead Scoring & Status
  lead_score INTEGER DEFAULT 0,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'demo_scheduled', 'proposal_sent', 'closed_won', 'closed_lost')),
  assigned_to TEXT,
  follow_up_date TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  source TEXT DEFAULT 'website_form',
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  referrer TEXT,
  ip_address INET,
  user_agent TEXT
);

-- Create indexes for better performance
CREATE INDEX idx_prospect_intake_email ON prospect_intake(email);
CREATE INDEX idx_prospect_intake_created_at ON prospect_intake(created_at);
CREATE INDEX idx_prospect_intake_status ON prospect_intake(status);
CREATE INDEX idx_prospect_intake_lead_score ON prospect_intake(lead_score);
CREATE INDEX idx_prospect_intake_company_size ON prospect_intake(company_size);
CREATE INDEX idx_prospect_intake_timeline ON prospect_intake(timeline);
CREATE INDEX idx_prospect_intake_budget ON prospect_intake(budget);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_prospect_intake_updated_at
    BEFORE UPDATE ON prospect_intake
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security) policies
ALTER TABLE prospect_intake ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read all prospect data (for internal team)
CREATE POLICY "Authenticated users can read prospect intake data" ON prospect_intake
    FOR SELECT USING (auth.role() = 'authenticated');

-- Allow anyone to insert (for form submissions)
CREATE POLICY "Anyone can submit prospect intake form" ON prospect_intake
    FOR INSERT WITH CHECK (true);

-- Allow authenticated users to update (for lead management)
CREATE POLICY "Authenticated users can update prospect intake data" ON prospect_intake
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Lead scoring function (basic scoring algorithm)
CREATE OR REPLACE FUNCTION calculate_lead_score(
  p_company_size TEXT,
  p_budget TEXT,
  p_timeline TEXT,
  p_decision_makers TEXT,
  p_email_volume TEXT,
  p_time_spent_on_email TEXT
) RETURNS INTEGER AS $$
DECLARE
  score INTEGER := 0;
BEGIN
  -- Company size scoring (larger companies = higher score)
  CASE p_company_size
    WHEN '1000+' THEN score := score + 30;
    WHEN '201-1000' THEN score := score + 25;
    WHEN '51-200' THEN score := score + 20;
    WHEN '11-50' THEN score := score + 15;
    WHEN '1-10' THEN score := score + 10;
  END CASE;
  
  -- Budget scoring (higher budget = higher score)
  CASE p_budget
    WHEN '50k+' THEN score := score + 25;
    WHEN '15k-50k' THEN score := score + 20;
    WHEN '5k-15k' THEN score := score + 15;
    WHEN '1k-5k' THEN score := score + 10;
    WHEN 'under-1k' THEN score := score + 5;
    WHEN 'no-budget' THEN score := score + 0;
  END CASE;
  
  -- Timeline scoring (more urgent = higher score)
  CASE p_timeline
    WHEN 'immediate' THEN score := score + 20;
    WHEN '1-month' THEN score := score + 15;
    WHEN '3-months' THEN score := score + 10;
    WHEN '6-months' THEN score := score + 5;
    WHEN 'exploring' THEN score := score + 2;
  END CASE;
  
  -- Decision maker scoring (fewer decision makers = higher score)
  CASE p_decision_makers
    WHEN 'me-only' THEN score := score + 15;
    WHEN 'me-plus-1' THEN score := score + 12;
    WHEN 'small-team' THEN score := score + 8;
    WHEN 'large-committee' THEN score := score + 3;
  END CASE;
  
  -- Email volume scoring (more emails = higher potential value)
  CASE p_email_volume
    WHEN '500+' THEN score := score + 10;
    WHEN '200-500' THEN score := score + 8;
    WHEN '100-200' THEN score := score + 6;
    WHEN '50-100' THEN score := score + 4;
    WHEN 'under-50' THEN score := score + 2;
  END CASE;
  
  RETURN score;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically calculate lead score on insert/update
CREATE OR REPLACE FUNCTION auto_calculate_lead_score()
RETURNS TRIGGER AS $$
BEGIN
  NEW.lead_score := calculate_lead_score(
    NEW.company_size,
    NEW.budget,
    NEW.timeline,
    NEW.decision_makers,
    NEW.current_email_volume,
    NEW.time_spent_on_email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER calculate_lead_score_trigger
    BEFORE INSERT OR UPDATE ON prospect_intake
    FOR EACH ROW
    EXECUTE FUNCTION auto_calculate_lead_score();

-- Comments for documentation
COMMENT ON TABLE prospect_intake IS 'Stores prospect intake form submissions for lead qualification and management';
COMMENT ON COLUMN prospect_intake.lead_score IS 'Automatically calculated lead score based on company size, budget, timeline, and other factors';
COMMENT ON COLUMN prospect_intake.status IS 'Current status of the lead in the sales pipeline';
COMMENT ON COLUMN prospect_intake.biggest_pain_points IS 'Array of selected pain points from the form';
COMMENT ON COLUMN prospect_intake.primary_goals IS 'Array of selected primary goals from the form';
COMMENT ON COLUMN prospect_intake.integration_needs IS 'Array of required integrations from the form'; 