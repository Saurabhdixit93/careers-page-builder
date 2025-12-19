-- Companies table stores company profile and branding information
-- Each company gets their own careers page with unique slug

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
  content_sections JSONB DEFAULT '[]'::jsonb,
  
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

-- Allow public to view published companies
CREATE POLICY "Anyone can view published companies"
  ON companies FOR SELECT
  USING (is_published = true);

-- Create index on slug for fast lookups
CREATE INDEX idx_companies_slug ON companies(slug);
CREATE INDEX idx_companies_user_id ON companies(user_id);
