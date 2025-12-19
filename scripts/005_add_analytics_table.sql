-- Add analytics tracking for career page performance
CREATE TABLE IF NOT EXISTS company_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  page_views INT DEFAULT 0,
  unique_visitors INT DEFAULT 0,
  job_views JSONB DEFAULT '{}',
  application_clicks INT DEFAULT 0,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(company_id, date)
);

-- RLS Policies for analytics
ALTER TABLE company_analytics ENABLE ROW LEVEL SECURITY;

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

CREATE POLICY "System can update analytics"
  ON company_analytics FOR UPDATE
  USING (true);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_analytics_company_date 
  ON company_analytics(company_id, date DESC);
