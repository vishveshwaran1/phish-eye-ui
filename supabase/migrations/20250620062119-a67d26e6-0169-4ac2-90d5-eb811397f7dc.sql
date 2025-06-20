
-- Create enum for email risk levels
CREATE TYPE email_risk_level AS ENUM ('safe', 'low', 'medium', 'high', 'critical');

-- Create enum for email scan status
CREATE TYPE scan_status AS ENUM ('pending', 'scanning', 'completed', 'failed');

-- Create table for storing user email accounts
CREATE TABLE public.email_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    email_address TEXT NOT NULL,
    provider TEXT NOT NULL, -- 'gmail', 'outlook', etc.
    access_token_encrypted TEXT, -- encrypted access token
    refresh_token_encrypted TEXT, -- encrypted refresh token
    is_active BOOLEAN DEFAULT true,
    last_sync TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(user_id, email_address)
);

-- Create table for storing scanned emails
CREATE TABLE public.scanned_emails (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email_account_id UUID REFERENCES public.email_accounts(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    message_id TEXT NOT NULL, -- unique identifier from email provider
    subject TEXT,
    sender TEXT NOT NULL,
    recipient TEXT,
    content TEXT,
    headers JSONB,
    risk_level email_risk_level,
    risk_score INTEGER CHECK (risk_score >= 0 AND risk_score <= 100),
    scan_status scan_status DEFAULT 'pending',
    scan_details JSONB, -- store detailed analysis results
    flagged_keywords TEXT[],
    suspicious_links TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    scanned_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(email_account_id, message_id)
);

-- Create table for AI analysis results
CREATE TABLE public.ai_analysis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scanned_email_id UUID REFERENCES public.scanned_emails(id) ON DELETE CASCADE NOT NULL,
    model_used TEXT NOT NULL, -- which AI model was used
    analysis_type TEXT NOT NULL, -- 'content_analysis', 'url_analysis', etc.
    confidence_score DECIMAL(5,2) CHECK (confidence_score >= 0 AND confidence_score <= 100),
    analysis_result JSONB NOT NULL, -- detailed analysis results
    processing_time_ms INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create table for storing threat patterns
CREATE TABLE public.threat_patterns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pattern_type TEXT NOT NULL, -- 'phishing', 'malware', 'spam', etc.
    pattern_data JSONB NOT NULL,
    severity email_risk_level NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.email_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scanned_emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.threat_patterns ENABLE ROW LEVEL SECURITY;

-- RLS Policies for email_accounts
CREATE POLICY "Users can view their own email accounts" 
    ON public.email_accounts FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own email accounts" 
    ON public.email_accounts FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own email accounts" 
    ON public.email_accounts FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own email accounts" 
    ON public.email_accounts FOR DELETE 
    USING (auth.uid() = user_id);

-- RLS Policies for scanned_emails
CREATE POLICY "Users can view their own scanned emails" 
    ON public.scanned_emails FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own scanned emails" 
    ON public.scanned_emails FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own scanned emails" 
    ON public.scanned_emails FOR UPDATE 
    USING (auth.uid() = user_id);

-- RLS Policies for ai_analysis (read-only for users)
CREATE POLICY "Users can view AI analysis for their emails" 
    ON public.ai_analysis FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM public.scanned_emails se 
            WHERE se.id = ai_analysis.scanned_email_id 
            AND se.user_id = auth.uid()
        )
    );

-- RLS Policies for threat_patterns (read-only for all authenticated users)
CREATE POLICY "Authenticated users can view active threat patterns" 
    ON public.threat_patterns FOR SELECT 
    TO authenticated
    USING (is_active = true);

-- Create indexes for better performance
CREATE INDEX idx_email_accounts_user_id ON public.email_accounts(user_id);
CREATE INDEX idx_scanned_emails_user_id ON public.scanned_emails(user_id);
CREATE INDEX idx_scanned_emails_account_id ON public.scanned_emails(email_account_id);
CREATE INDEX idx_scanned_emails_risk_level ON public.scanned_emails(risk_level);
CREATE INDEX idx_scanned_emails_scan_status ON public.scanned_emails(scan_status);
CREATE INDEX idx_ai_analysis_email_id ON public.ai_analysis(scanned_email_id);

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_email_accounts_updated_at 
    BEFORE UPDATE ON public.email_accounts 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_threat_patterns_updated_at 
    BEFORE UPDATE ON public.threat_patterns 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
