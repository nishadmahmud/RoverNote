-- ============================================
-- RoverNote Database Schema
-- ============================================
-- This file contains all SQL needed to set up
-- your Supabase database for RoverNote
-- ============================================

-- ============================================
-- 1. CREATE TABLES
-- ============================================

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Journeys table (main content)
CREATE TABLE IF NOT EXISTS journeys (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  location TEXT,
  start_date DATE,
  end_date DATE,
  body TEXT,
  tags TEXT[],
  image_url TEXT,
  image_path TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 2. CREATE INDEXES (for performance)
-- ============================================

CREATE INDEX IF NOT EXISTS idx_journeys_user_id ON journeys(user_id);
CREATE INDEX IF NOT EXISTS idx_journeys_created_at ON journeys(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_journeys_tags ON journeys USING GIN(tags);

-- ============================================
-- 3. ENABLE ROW LEVEL SECURITY
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE journeys ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 4. CREATE RLS POLICIES - PROFILES
-- ============================================

-- Policy: Users can view their own profile
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Policy: Users can insert their own profile
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Policy: Users can update their own profile
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ============================================
-- 5. CREATE RLS POLICIES - JOURNEYS
-- ============================================

-- Policy: Users can view their own journeys
DROP POLICY IF EXISTS "Users can view their own journeys" ON journeys;
CREATE POLICY "Users can view their own journeys"
  ON journeys FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy: Users can create their own journeys
DROP POLICY IF EXISTS "Users can create their own journeys" ON journeys;
CREATE POLICY "Users can create their own journeys"
  ON journeys FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own journeys
DROP POLICY IF EXISTS "Users can update their own journeys" ON journeys;
CREATE POLICY "Users can update their own journeys"
  ON journeys FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own journeys
DROP POLICY IF EXISTS "Users can delete their own journeys" ON journeys;
CREATE POLICY "Users can delete their own journeys"
  ON journeys FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================
-- 6. CREATE FUNCTIONS (optional helpers)
-- ============================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for profiles
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for journeys
DROP TRIGGER IF EXISTS update_journeys_updated_at ON journeys;
CREATE TRIGGER update_journeys_updated_at
  BEFORE UPDATE ON journeys
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 7. STORAGE BUCKET SETUP
-- ============================================

-- Note: Storage buckets must be created via Supabase Dashboard or API
-- After creating the 'journey-images' bucket, run these policies:

-- Policy: Users can upload their own images
DROP POLICY IF EXISTS "Users can upload their own images" ON storage.objects;
CREATE POLICY "Users can upload their own images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'journey-images' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Policy: Users can view their own images
DROP POLICY IF EXISTS "Users can view their own images" ON storage.objects;
CREATE POLICY "Users can view their own images"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'journey-images' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Policy: Public images are viewable by anyone
DROP POLICY IF EXISTS "Public images are viewable by anyone" ON storage.objects;
CREATE POLICY "Public images are viewable by anyone"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'journey-images');

-- Policy: Users can update their own images
DROP POLICY IF EXISTS "Users can update their own images" ON storage.objects;
CREATE POLICY "Users can update their own images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'journey-images' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Policy: Users can delete their own images
DROP POLICY IF EXISTS "Users can delete their own images" ON storage.objects;
CREATE POLICY "Users can delete their own images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'journey-images' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- ============================================
-- 8. VERIFICATION QUERIES
-- ============================================

-- Run these to verify everything is set up correctly:

-- Check tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'journeys');

-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('profiles', 'journeys');

-- Check policies exist
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE tablename IN ('profiles', 'journeys');

-- ============================================
-- SETUP COMPLETE! 🎉
-- ============================================
-- Your database is ready for RoverNote!
-- Next steps:
-- 1. Create the 'journey-images' storage bucket in Supabase Dashboard
-- 2. Make sure it's set to 'public'
-- 3. Update your .env.local file with Supabase credentials
-- 4. Run 'npm run dev' and start journaling!
-- ============================================

