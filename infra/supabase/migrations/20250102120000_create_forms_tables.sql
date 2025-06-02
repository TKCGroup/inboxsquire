-- Migration: Create forms system tables for InboxSquire Forms feature

-- Enable UUID generation if not already enabled
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Forms table - stores form definitions and metadata
CREATE TABLE public.forms (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    title text NOT NULL,
    description text,
    token text UNIQUE NOT NULL,
    custom_alias text UNIQUE,
    template_type text,
    questions jsonb NOT NULL DEFAULT '[]'::jsonb,
    branding jsonb DEFAULT '{}'::jsonb,
    settings jsonb DEFAULT '{}'::jsonb,
    is_active boolean DEFAULT true,
    expires_at timestamptz,
    view_count integer DEFAULT 0,
    submission_count integer DEFAULT 0,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS on forms table
ALTER TABLE public.forms ENABLE ROW LEVEL SECURITY;

-- Create indexes for forms table
CREATE INDEX idx_forms_user_id ON public.forms(user_id);
CREATE INDEX idx_forms_token ON public.forms(token);
CREATE INDEX idx_forms_custom_alias ON public.forms(custom_alias) WHERE custom_alias IS NOT NULL;
CREATE INDEX idx_forms_template_type ON public.forms(template_type);
CREATE INDEX idx_forms_is_active ON public.forms(is_active);

-- Form responses table - stores submitted form data
CREATE TABLE public.form_responses (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    form_id uuid NOT NULL REFERENCES public.forms(id) ON DELETE CASCADE,
    respondent_email text,
    respondent_name text,
    response_data jsonb NOT NULL DEFAULT '{}'::jsonb,
    metadata jsonb DEFAULT '{}'::jsonb,
    ip_address inet,
    user_agent text,
    completion_time_seconds integer,
    status text DEFAULT 'completed' NOT NULL, -- 'completed', 'partial', 'abandoned'
    submitted_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS on form_responses table
ALTER TABLE public.form_responses ENABLE ROW LEVEL SECURITY;

-- Create indexes for form_responses table
CREATE INDEX idx_form_responses_form_id ON public.form_responses(form_id);
CREATE INDEX idx_form_responses_respondent_email ON public.form_responses(respondent_email);
CREATE INDEX idx_form_responses_submitted_at ON public.form_responses(submitted_at DESC);
CREATE INDEX idx_form_responses_status ON public.form_responses(status);

-- Form analytics table - tracks form interactions and events
CREATE TABLE public.form_analytics (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    form_id uuid NOT NULL REFERENCES public.forms(id) ON DELETE CASCADE,
    event_type text NOT NULL, -- 'view', 'start', 'complete', 'abandon', 'question_skip'
    session_id text NOT NULL,
    question_id text, -- For question-specific events
    ip_address inet,
    user_agent text,
    referrer text,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS on form_analytics table
ALTER TABLE public.form_analytics ENABLE ROW LEVEL SECURITY;

-- Create indexes for form_analytics table
CREATE INDEX idx_form_analytics_form_id ON public.form_analytics(form_id);
CREATE INDEX idx_form_analytics_event_type ON public.form_analytics(event_type);
CREATE INDEX idx_form_analytics_session_id ON public.form_analytics(session_id);
CREATE INDEX idx_form_analytics_created_at ON public.form_analytics(created_at DESC);

-- Form templates table - stores reusable form templates
CREATE TABLE public.form_templates (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    description text,
    category text NOT NULL, -- 'vendor_evaluation', 'partnership', 'due_diligence', etc.
    template_data jsonb NOT NULL DEFAULT '{}'::jsonb,
    is_active boolean DEFAULT true,
    usage_count integer DEFAULT 0,
    created_by uuid REFERENCES public.users(id),
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS on form_templates table
ALTER TABLE public.form_templates ENABLE ROW LEVEL SECURITY;

-- Create indexes for form_templates table
CREATE INDEX idx_form_templates_category ON public.form_templates(category);
CREATE INDEX idx_form_templates_is_active ON public.form_templates(is_active);
CREATE INDEX idx_form_templates_usage_count ON public.form_templates(usage_count DESC);

-- Row Level Security Policies

-- Forms policies - users can only access their own forms
CREATE POLICY "Users can view their own forms" ON public.forms
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own forms" ON public.forms
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own forms" ON public.forms
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own forms" ON public.forms
    FOR DELETE USING (auth.uid() = user_id);

-- Form responses policies - users can only access responses to their forms
CREATE POLICY "Users can view responses to their forms" ON public.form_responses
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.forms 
            WHERE forms.id = form_responses.form_id 
            AND forms.user_id = auth.uid()
        )
    );

CREATE POLICY "Anyone can create form responses" ON public.form_responses
    FOR INSERT WITH CHECK (true); -- Public form submissions

-- Form analytics policies - users can only access analytics for their forms
CREATE POLICY "Users can view analytics for their forms" ON public.form_analytics
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.forms 
            WHERE forms.id = form_analytics.form_id 
            AND forms.user_id = auth.uid()
        )
    );

CREATE POLICY "Anyone can create form analytics" ON public.form_analytics
    FOR INSERT WITH CHECK (true); -- Public form interactions

-- Form templates policies - all users can view templates, only admins can modify
CREATE POLICY "Anyone can view active templates" ON public.form_templates
    FOR SELECT USING (is_active = true);

CREATE POLICY "Template creators can modify their templates" ON public.form_templates
    FOR ALL USING (auth.uid() = created_by);

-- Functions

-- Function to generate unique form token
CREATE OR REPLACE FUNCTION public.generate_form_token()
RETURNS text AS $$
DECLARE
    token text;
    token_exists boolean;
BEGIN
    LOOP
        -- Generate 8-character alphanumeric token
        token := upper(substr(md5(random()::text), 1, 8));
        
        -- Check if token already exists
        SELECT EXISTS(SELECT 1 FROM public.forms WHERE forms.token = token) INTO token_exists;
        
        -- Exit loop if token is unique
        IF NOT token_exists THEN
            EXIT;
        END IF;
    END LOOP;
    
    RETURN token;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update form view count
CREATE OR REPLACE FUNCTION public.increment_form_views(form_token text)
RETURNS void AS $$
BEGIN
    UPDATE public.forms 
    SET view_count = view_count + 1 
    WHERE token = form_token AND is_active = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update form submission count
CREATE OR REPLACE FUNCTION public.increment_form_submissions(form_token text)
RETURNS void AS $$
BEGIN
    UPDATE public.forms 
    SET submission_count = submission_count + 1 
    WHERE token = form_token AND is_active = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply timestamp triggers to forms tables
CREATE TRIGGER set_timestamp_forms
BEFORE UPDATE ON public.forms
FOR EACH ROW
EXECUTE FUNCTION public.trigger_set_timestamp();

CREATE TRIGGER set_timestamp_form_templates
BEFORE UPDATE ON public.form_templates
FOR EACH ROW
EXECUTE FUNCTION public.trigger_set_timestamp();

-- Insert default form templates
INSERT INTO public.form_templates (name, description, category, template_data) VALUES
('Vendor Evaluation', 'Comprehensive vendor assessment form', 'vendor_evaluation', '{
    "questions": [
        {
            "id": "company_info",
            "type": "section",
            "title": "Company Information",
            "description": "Basic information about your company"
        },
        {
            "id": "company_name",
            "type": "text",
            "title": "Company Name",
            "required": true,
            "placeholder": "Enter your company name"
        },
        {
            "id": "website",
            "type": "text",
            "title": "Company Website",
            "required": true,
            "placeholder": "https://yourcompany.com"
        },
        {
            "id": "company_size",
            "type": "select",
            "title": "Company Size",
            "required": true,
            "options": ["1-10 employees", "11-50 employees", "51-200 employees", "201-1000 employees", "1000+ employees"]
        },
        {
            "id": "security_section",
            "type": "section",
            "title": "Security & Compliance",
            "description": "Information about your security practices"
        },
        {
            "id": "security_certifications",
            "type": "multiselect",
            "title": "Security Certifications",
            "options": ["SOC 2 Type II", "ISO 27001", "PCI DSS", "HIPAA", "GDPR Compliant", "Other"]
        },
        {
            "id": "data_location",
            "type": "text",
            "title": "Data Storage Location",
            "placeholder": "Where is customer data stored?"
        }
    ]
}'),
('Partnership Assessment', 'Evaluate potential partnership opportunities', 'partnership', '{
    "questions": [
        {
            "id": "partnership_info",
            "type": "section",
            "title": "Partnership Information",
            "description": "Tell us about your partnership interests"
        },
        {
            "id": "partnership_type",
            "type": "select",
            "title": "Partnership Type",
            "required": true,
            "options": ["Technology Integration", "Reseller Partnership", "Strategic Alliance", "Joint Venture", "Other"]
        },
        {
            "id": "market_presence",
            "type": "multiselect",
            "title": "Market Presence",
            "options": ["North America", "Europe", "Asia Pacific", "Latin America", "Middle East", "Africa"]
        },
        {
            "id": "target_customers",
            "type": "textarea",
            "title": "Target Customer Profile",
            "placeholder": "Describe your ideal customer profile..."
        }
    ]
}'),
('Customer Research', 'Understand customer needs and requirements', 'customer_research', '{
    "questions": [
        {
            "id": "current_situation",
            "type": "section",
            "title": "Current Situation",
            "description": "Help us understand your current setup"
        },
        {
            "id": "current_solution",
            "type": "textarea",
            "title": "Current Solution",
            "placeholder": "What tools/solutions are you currently using?"
        },
        {
            "id": "pain_points",
            "type": "textarea",
            "title": "Main Pain Points",
            "required": true,
            "placeholder": "What challenges are you facing with your current setup?"
        },
        {
            "id": "budget_range",
            "type": "select",
            "title": "Budget Range",
            "options": ["Under $1,000", "$1,000 - $5,000", "$5,000 - $10,000", "$10,000 - $25,000", "$25,000+", "Not sure yet"]
        }
    ]
}'); 