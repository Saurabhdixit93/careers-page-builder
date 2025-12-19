-- Add job applications tracking
CREATE TABLE IF NOT EXISTS job_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  candidate_email VARCHAR(255) NOT NULL,
  candidate_name VARCHAR(255) NOT NULL,
  candidate_phone VARCHAR(50),
  resume_url TEXT,
  cover_letter TEXT,
  status VARCHAR(50) DEFAULT 'new' CHECK (status IN ('new', 'reviewing', 'shortlisted', 'rejected', 'accepted')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view applications for their jobs"
  ON job_applications FOR SELECT
  USING (
    job_id IN (
      SELECT j.id FROM jobs j
      JOIN companies c ON j.company_id = c.id
      WHERE c.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can submit applications"
  ON job_applications FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their job applications"
  ON job_applications FOR UPDATE
  USING (
    job_id IN (
      SELECT j.id FROM jobs j
      JOIN companies c ON j.company_id = c.id
      WHERE c.user_id = auth.uid()
    )
  );

-- Indexes
CREATE INDEX IF NOT EXISTS idx_applications_job 
  ON job_applications(job_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_applications_status 
  ON job_applications(status, created_at DESC);
