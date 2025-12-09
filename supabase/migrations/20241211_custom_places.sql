-- Custom places table for admin-created places from suggestions
CREATE TABLE IF NOT EXISTS custom_places (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  category text NOT NULL,
  place_id text NOT NULL UNIQUE,
  name text NOT NULL,
  lat numeric,
  lng numeric,
  website text,
  state text,
  country text,
  region text,
  description text,
  source_suggestion_id uuid REFERENCES suggestions(id) ON DELETE SET NULL,
  created_by text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_custom_places_category ON custom_places(category);
CREATE INDEX IF NOT EXISTS idx_custom_places_place_id ON custom_places(place_id);

-- RLS policies
ALTER TABLE custom_places ENABLE ROW LEVEL SECURITY;

-- Everyone can read custom places (they're part of the app data)
CREATE POLICY "Everyone can view custom places" ON custom_places
  FOR SELECT USING (true);

-- Only admins can create/modify custom places
CREATE POLICY "Admin users can insert custom places" ON custom_places
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_emails
      WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
  );

CREATE POLICY "Admin users can update custom places" ON custom_places
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM admin_emails
      WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
  );

CREATE POLICY "Admin users can delete custom places" ON custom_places
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM admin_emails
      WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
  );
