# Database Setup Guide - Step 2

This guide will help you set up the Supabase database for the Sunrise Recovery mobile app.

## Prerequisites

1. **Supabase Account**: Sign up at [supabase.com](https://supabase.com)
2. **Project Created**: Create a new Supabase project
3. **API Keys**: Get your project URL and anon key

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Choose your organization
4. Create a new project with:
   - **Name**: `sunrise-recovery`
   - **Database Password**: Choose a strong password
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free tier (sufficient for development)

## Step 2: Get API Keys

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (e.g., `https://your-project.supabase.co`)
   - **Anon public key** (starts with `eyJ...`)

## Step 3: Configure Environment

1. Copy the environment example:
   ```bash
   cp env.example .env
   ```

2. Update `.env` with your Supabase credentials:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   ```

## Step 4: Run Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the entire contents of `database-schema.sql`
3. Paste and run the SQL commands

**Expected Output:**
- ✅ 6 tables created
- ✅ RLS policies enabled
- ✅ Indexes created for performance
- ✅ Triggers and functions created
- ✅ Sample data inserted

## Step 5: Set Up Storage Buckets

1. Go to **Storage** in your Supabase dashboard
2. Create the following buckets:

### Bucket: `uploads`
- **Public**: ✅ Yes
- **File size limit**: 100MB
- **Allowed MIME types**: 
  - `image/*`
  - `video/*`
  - `application/pdf`

### Bucket: `thumbnails`
- **Public**: ✅ Yes
- **File size limit**: 10MB
- **Allowed MIME types**: `image/*`

### Bucket: `videos`
- **Public**: ✅ Yes
- **File size limit**: 500MB
- **Allowed MIME types**: `video/*`

## Step 6: Configure Storage Policies

Run these SQL commands in the SQL Editor:

```sql
-- Allow authenticated users to upload files
CREATE POLICY "Users can upload files" ON storage.objects
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow users to view their own uploads
CREATE POLICY "Users can view own uploads" ON storage.objects
FOR SELECT USING (auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to update their own uploads
CREATE POLICY "Users can update own uploads" ON storage.objects
FOR UPDATE USING (auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to delete their own uploads
CREATE POLICY "Users can delete own uploads" ON storage.objects
FOR DELETE USING (auth.uid()::text = (storage.foldername(name))[1]);
```

## Step 7: Test Database Connection

1. Run the mobile app:
   ```bash
   npm start
   ```

2. Try to log in with test credentials:
   - **Email**: `admin@sunrise-recovery.com`
   - **Password**: `admin123`

3. Check the console for any connection errors

## Step 8: Verify Setup

### Check Tables
In SQL Editor, run:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE';
```

**Expected Tables:**
- profiles
- videos
- admin_posts
- user_progress
- user_favorites
- user_watch_history

### Check Sample Data
```sql
SELECT * FROM public.profiles;
SELECT * FROM public.videos;
SELECT * FROM public.admin_posts;
```

## Troubleshooting

### Common Issues:

1. **"Missing Supabase environment variables"**
   - Check your `.env` file exists
   - Verify the variable names start with `EXPO_PUBLIC_`

2. **"Invalid API key"**
   - Double-check your anon key
   - Make sure you're using the anon key, not the service role key

3. **"RLS policy violation"**
   - Ensure you're logged in before accessing data
   - Check that the user has the correct role

4. **"Table doesn't exist"**
   - Run the database schema again
   - Check for any SQL errors in the Supabase logs

## Security Checklist

- ✅ **Row Level Security**: Enabled on all tables
- ✅ **Proper Policies**: User-specific access control
- ✅ **Input Validation**: Check constraints in place
- ✅ **Secure Storage**: Proper bucket policies
- ✅ **HIPAA Compliant**: No sensitive data exposure

## Next Steps

After completing this setup:

1. **Test Authentication**: Try logging in/out
2. **Test API Calls**: Verify data fetching works
3. **Continue to Step 3**: Navigation and core features

## Support

If you encounter issues:
1. Check the Supabase logs in the dashboard
2. Verify your environment variables
3. Test the connection in the SQL Editor
4. Check the mobile app console for errors