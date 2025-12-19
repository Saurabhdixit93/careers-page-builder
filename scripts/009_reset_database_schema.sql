-- Comprehensive script to reset and recreate the database schema
-- Use this when facing persistent schema cache issues

-- Drop tables in correct order (due to foreign key constraints)
DROP TABLE IF EXISTS job_applications CASCADE;
DROP TABLE IF EXISTS jobs CASCADE;
DROP TABLE IF EXISTS companies CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS company_analytics CASCADE;
DROP TABLE IF EXISTS job_templates CASCADE;

-- Recreate tables in correct order
-- Companies table
CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  tagline TEXT,
  description TEXT,
  
  -- Branding
  logo_url TEXT,
  banner_url TEXT,
  culture_video_url TEXT,
  primary_color TEXT DEFAULT '#3b82f6',
  secondary_color TEXT DEFAULT '#1e40af',
  
  -- Content sections (stored as JSONB for flexibility)
  sections JSONB DEFAULT '[]'::jsonb,
  
  -- Publishing
  is_published BOOLEAN DEFAULT false,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

-- RLS Policies for companies table
CREATE POLICY "Users can view their own companies"
  ON companies FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own companies"
  ON companies FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own companies"
  ON companies FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own companies"
  ON companies FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view published companies"
  ON companies FOR SELECT
  USING (is_published = true);

-- Create index on slug for fast lookups
CREATE INDEX idx_companies_slug ON companies(slug);
CREATE INDEX idx_companies_user_id ON companies(user_id);

-- Jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  department TEXT,
  location TEXT NOT NULL,
  location_type TEXT DEFAULT 'onsite',
  job_type TEXT DEFAULT 'fulltime',
  experience_level TEXT,
  description TEXT,
  responsibilities TEXT[],
  qualifications TEXT[],
  benefits TEXT[],
  salary_min INTEGER,
  salary_max INTEGER,
  salary_currency TEXT DEFAULT 'USD',
  is_active BOOLEAN DEFAULT true,
  application_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for jobs table
CREATE POLICY "Users can view their own company jobs"
  ON jobs FOR SELECT
  USING (
    company_id IN (
      SELECT id FROM companies WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Public can view active jobs from published companies"
  ON jobs FOR SELECT
  USING (
    is_active = true AND 
    company_id IN (
      SELECT id FROM companies WHERE is_published = true
    )
  );

CREATE POLICY "Users can insert jobs for their companies"
  ON jobs FOR INSERT
  WITH CHECK (
    company_id IN (
      SELECT id FROM companies WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update jobs for their companies"
  ON jobs FOR UPDATE
  USING (
    company_id IN (
      SELECT id FROM companies WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete jobs for their companies"
  ON jobs FOR DELETE
  USING (
    company_id IN (
      SELECT id FROM companies WHERE user_id = auth.uid()
    )
  );

-- Create indexes
CREATE INDEX idx_jobs_company_id ON jobs(company_id);
CREATE INDEX idx_jobs_is_active ON jobs(is_active);

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  company_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles table
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Company Analytics table
CREATE TABLE IF NOT EXISTS company_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  page_views INTEGER DEFAULT 0,
  unique_visitors INTEGER DEFAULT 0,
  job_views JSONB DEFAULT '{}'::jsonb,
  application_clicks INTEGER DEFAULT 0,
  date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(company_id, date)
);

-- Enable Row Level Security
ALTER TABLE company_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for analytics table
CREATE POLICY "Users can view their own company analytics"
  ON company_analytics FOR SELECT
  USING (
    company_id IN (
      SELECT id FROM companies WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "System can insert analytics"
  ON company_analytics FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their own company analytics"
  ON company_analytics FOR UPDATE
  USING (
    company_id IN (
      SELECT id FROM companies WHERE user_id = auth.uid()
    )
  );

-- Job Applications table
CREATE TABLE IF NOT EXISTS job_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  candidate_email TEXT NOT NULL,
  candidate_name TEXT NOT NULL,
  candidate_phone TEXT,
  resume_url TEXT,
  cover_letter TEXT,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for job applications table
CREATE POLICY "Users can view applications for their company jobs"
  ON job_applications FOR SELECT
  USING (
    job_id IN (
      SELECT id FROM jobs WHERE 
        company_id IN (
          SELECT id FROM companies WHERE user_id = auth.uid()
        )
    )
  );

CREATE POLICY "Public can insert applications"
  ON job_applications FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update applications for their company jobs"
  ON job_applications FOR UPDATE
  USING (
    job_id IN (
      SELECT id FROM jobs WHERE 
        company_id IN (
          SELECT id FROM companies WHERE user_id = auth.uid()
        )
    )
  );

-- Job Templates table
CREATE TABLE IF NOT EXISTS job_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  department TEXT,
  job_type TEXT DEFAULT 'fulltime',
  experience_level TEXT,
  description TEXT,
  responsibilities TEXT,
  qualifications TEXT,
  benefits TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE job_templates ENABLE ROW LEVEL SECURITY;

-- RLS Policies for job templates table
CREATE POLICY "Users can view their own templates"
  ON job_templates FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own templates"
  ON job_templates FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own templates"
  ON job_templates FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own templates"
  ON job_templates FOR DELETE
  USING (auth.uid() = user_id);

-- Refresh the PostgREST schema cache
NOTIFY pgrst, 'reload schema';