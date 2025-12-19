-- Jobs table stores job postings for each company

CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  
  -- Job details
  title TEXT NOT NULL,
  department TEXT,
  location TEXT NOT NULL,
  job_type TEXT NOT NULL, -- Full-time, Part-time, Contract, Internship
  experience_level TEXT, -- Entry Level, Mid Level, Senior Level, Lead, Executive
  
  -- Job description
  description TEXT,
  responsibilities JSONB DEFAULT '[]'::jsonb,
  qualifications JSONB DEFAULT '[]'::jsonb,
  benefits JSONB DEFAULT '[]'::jsonb,
  
  -- Salary (optional)
  salary_min INTEGER,
  salary_max INTEGER,
  salary_currency TEXT DEFAULT 'USD',
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Application link
  application_url TEXT
);

-- Enable Row Level Security
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for jobs table
-- Recruiters can manage jobs for their own companies
CREATE POLICY "Users can view jobs for their companies"
  ON jobs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM companies
      WHERE companies.id = jobs.company_id
      AND companies.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert jobs for their companies"
  ON jobs FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM companies
      WHERE companies.id = jobs.company_id
      AND companies.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update jobs for their companies"
  ON jobs FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM companies
      WHERE companies.id = jobs.company_id
      AND companies.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete jobs for their companies"
  ON jobs FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM companies
      WHERE companies.id = jobs.company_id
      AND companies.user_id = auth.uid()
    )
  );

-- Public can view active jobs for published companies
CREATE POLICY "Anyone can view active jobs for published companies"
  ON jobs FOR SELECT
  USING (
    is_active = true
    AND EXISTS (
      SELECT 1 FROM companies
      WHERE companies.id = jobs.company_id
      AND companies.is_published = true
    )
  );

-- Create indexes for better performance
CREATE INDEX idx_jobs_company_id ON jobs(company_id);
CREATE INDEX idx_jobs_location ON jobs(location);
CREATE INDEX idx_jobs_job_type ON jobs(job_type);
CREATE INDEX idx_jobs_is_active ON jobs(is_active);

-- Full-text search index for job titles
CREATE INDEX idx_jobs_title_search ON jobs USING gin(to_tsvector('english', title));
