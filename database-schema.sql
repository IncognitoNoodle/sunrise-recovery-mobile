-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT NOT NULL,
  sobriety_start_date DATE NOT NULL,
  interest_tags TEXT[] DEFAULT '{}',
  profile_image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  preferences JSONB DEFAULT '{"notifications": true, "dailyReminders": true, "theme": "auto"}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Videos table
CREATE TABLE public.videos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('coping', 'coach-tips', 'mindfulness', 'motivation', 'education')),
  duration INTEGER NOT NULL,
  thumbnail_url TEXT NOT NULL,
  video_url TEXT NOT NULL,
  is_published BOOLEAN DEFAULT false,
  created_by UUID REFERENCES public.profiles(id),
  view_count INTEGER DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin posts table
CREATE TABLE public.admin_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('announcement', 'motivational', 'event', 'tip')),
  is_published BOOLEAN DEFAULT false,
  created_by UUID REFERENCES public.profiles(id),
  expires_at TIMESTAMP WITH TIME ZONE,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  target_audience TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User progress table
CREATE TABLE public.user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  sobriety_days INTEGER NOT NULL,
  mood INTEGER CHECK (mood >= 1 AND mood <= 5),
  check_in_completed BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- User favorites table
CREATE TABLE public.user_favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  video_id UUID REFERENCES public.videos(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, video_id)
);

-- User watch history table
CREATE TABLE public.user_watch_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  video_id UUID REFERENCES public.videos(id) ON DELETE CASCADE,
  watched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  watch_duration INTEGER NOT NULL,
  completed BOOLEAN DEFAULT false
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_watch_history ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Videos policies
CREATE POLICY "Anyone can view published videos" ON public.videos
  FOR SELECT USING (is_published = true);

CREATE POLICY "Admins can manage videos" ON public.videos
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admin posts policies
CREATE POLICY "Users can view published posts" ON public.admin_posts
  FOR SELECT USING (is_published = true);

CREATE POLICY "Admins can manage posts" ON public.admin_posts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- User progress policies
CREATE POLICY "Users can manage their own progress" ON public.user_progress
  FOR ALL USING (auth.uid() = user_id);

-- User favorites policies
CREATE POLICY "Users can manage their own favorites" ON public.user_favorites
  FOR ALL USING (auth.uid() = user_id);

-- User watch history policies
CREATE POLICY "Users can manage their own watch history" ON public.user_watch_history
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================================
-- ADDITIONAL SETUP FOR COMPLETE DATABASE
-- ============================================================================

-- Create indexes for better performance
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_videos_category ON public.videos(category);
CREATE INDEX idx_videos_is_published ON public.videos(is_published);
CREATE INDEX idx_videos_created_at ON public.videos(created_at);
CREATE INDEX idx_admin_posts_type ON public.admin_posts(type);
CREATE INDEX idx_admin_posts_is_published ON public.admin_posts(is_published);
CREATE INDEX idx_user_progress_user_date ON public.user_progress(user_id, date);
CREATE INDEX idx_user_favorites_user ON public.user_favorites(user_id);
CREATE INDEX idx_user_watch_history_user ON public.user_watch_history(user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_videos_updated_at BEFORE UPDATE ON public.videos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_posts_updated_at BEFORE UPDATE ON public.admin_posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_progress_updated_at BEFORE UPDATE ON public.user_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to increment view count
CREATE OR REPLACE FUNCTION increment_view_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.videos 
    SET view_count = view_count + 1 
    WHERE id = NEW.video_id;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to increment view count when watch history is created
CREATE TRIGGER increment_video_view_count 
    AFTER INSERT ON public.user_watch_history
    FOR EACH ROW EXECUTE FUNCTION increment_view_count();

-- Create function to calculate sobriety days
CREATE OR REPLACE FUNCTION calculate_sobriety_days(start_date DATE)
RETURNS INTEGER AS $$
BEGIN
    RETURN EXTRACT(DAY FROM (CURRENT_DATE - start_date));
END;
$$ language 'plpgsql';

-- Insert sample data for testing (optional)
INSERT INTO public.profiles (id, full_name, sobriety_start_date, role) VALUES 
('00000000-0000-0000-0000-000000000001', 'Admin User', '2024-01-01', 'admin'),
('00000000-0000-0000-0000-000000000002', 'Test User', '2024-06-01', 'user');

-- Insert sample videos (optional)
INSERT INTO public.videos (title, description, category, duration, thumbnail_url, video_url, is_published, created_by) VALUES 
('Mindfulness Meditation', 'A guided meditation for beginners', 'mindfulness', 300, 'https://example.com/thumb1.jpg', 'https://example.com/video1.mp4', true, '00000000-0000-0000-0000-000000000001'),
('Coping with Stress', 'Techniques for managing daily stress', 'coping', 420, 'https://example.com/thumb2.jpg', 'https://example.com/video2.mp4', true, '00000000-0000-0000-0000-000000000001'),
('Daily Motivation', 'Start your day with positive energy', 'motivation', 180, 'https://example.com/thumb3.jpg', 'https://example.com/video3.mp4', true, '00000000-0000-0000-0000-000000000001');

-- Insert sample admin posts (optional)
INSERT INTO public.admin_posts (title, content, type, is_published, created_by) VALUES 
('Welcome to Sunrise Recovery', 'We are excited to support you on your recovery journey.', 'announcement', true, '00000000-0000-0000-0000-000000000001'),
('Daily Check-in Reminder', 'Remember to complete your daily check-in for better tracking.', 'tip', true, '00000000-0000-0000-0000-000000000001');