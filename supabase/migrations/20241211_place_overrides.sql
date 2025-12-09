-- Place overrides table for admin edits to static data
CREATE TABLE IF NOT EXISTS place_overrides (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  category text NOT NULL,
  place_id text NOT NULL,
  overrides jsonb NOT NULL DEFAULT '{}',
  notes text,
  updated_by text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(category, place_id)
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_place_overrides_category_place
  ON place_overrides(category, place_id);

-- RLS policies
ALTER TABLE place_overrides ENABLE ROW LEVEL SECURITY;

-- Only admins can view/modify overrides
CREATE POLICY "Admin users can view place overrides" ON place_overrides
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM admin_emails
      WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
  );

CREATE POLICY "Admin users can insert place overrides" ON place_overrides
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_emails
      WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
  );

CREATE POLICY "Admin users can update place overrides" ON place_overrides
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM admin_emails
      WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
  );

CREATE POLICY "Admin users can delete place overrides" ON place_overrides
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM admin_emails
      WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
  );
