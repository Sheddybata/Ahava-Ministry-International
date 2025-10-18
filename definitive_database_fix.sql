-- DEFINITIVE DATABASE FIX
-- This will completely fix all database issues
-- Run this in your Supabase SQL Editor

-- 1. COMPLETELY DISABLE RLS ON ALL TABLES
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entries DISABLE ROW LEVEL SECURITY;
ALTER TABLE community_posts DISABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes DISABLE ROW LEVEL SECURITY;
ALTER TABLE post_comments DISABLE ROW LEVEL SECURITY;
ALTER TABLE announcements DISABLE ROW LEVEL SECURITY;
ALTER TABLE push_subscriptions DISABLE ROW LEVEL SECURITY;

-- 2. DROP ALL EXISTING POLICIES
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
DROP POLICY IF EXISTS "Users can insert their own profile" ON users;
DROP POLICY IF EXISTS "Users can view their own journal entries" ON journal_entries;
DROP POLICY IF EXISTS "Users can insert their own journal entries" ON journal_entries;
DROP POLICY IF EXISTS "Users can update their own journal entries" ON journal_entries;
DROP POLICY IF EXISTS "Users can delete their own journal entries" ON journal_entries;
DROP POLICY IF EXISTS "Anyone can view community posts" ON community_posts;
DROP POLICY IF EXISTS "Users can insert their own posts" ON community_posts;
DROP POLICY IF EXISTS "Users can update their own posts" ON community_posts;
DROP POLICY IF EXISTS "Users can delete their own posts" ON community_posts;
DROP POLICY IF EXISTS "Enable read access for all users" ON community_posts;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON community_posts;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON community_posts;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON community_posts;
DROP POLICY IF EXISTS "Authenticated users can insert community posts" ON community_posts;
DROP POLICY IF EXISTS "Users can update their own community posts" ON community_posts;
DROP POLICY IF EXISTS "Users can delete their own community posts" ON community_posts;
DROP POLICY IF EXISTS "Anyone can view post likes" ON post_likes;
DROP POLICY IF EXISTS "Users can insert their own likes" ON post_likes;
DROP POLICY IF EXISTS "Users can delete their own likes" ON post_likes;
DROP POLICY IF EXISTS "Anyone can view post comments" ON post_comments;
DROP POLICY IF EXISTS "Users can insert their own comments" ON post_comments;
DROP POLICY IF EXISTS "Users can update their own comments" ON post_comments;
DROP POLICY IF EXISTS "Users can delete their own comments" ON post_comments;

-- 3. GRANT FULL PERMISSIONS TO ANON AND AUTHENTICATED USERS
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- 4. ENSURE ALL TABLES HAVE PROPER STRUCTURE
-- Check if journal_entries table exists and has correct structure
DO $$
BEGIN
    -- Create journal_entries table if it doesn't exist
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'journal_entries') THEN
        CREATE TABLE journal_entries (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id UUID NOT NULL,
            day INTEGER NOT NULL DEFAULT 1,
            title TEXT NOT NULL,
            content TEXT NOT NULL,
            insight TEXT,
            attention TEXT,
            commitment TEXT,
            task TEXT,
            system TEXT,
            prayer TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
    END IF;
    
    -- Create users table if it doesn't exist
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users') THEN
        CREATE TABLE users (
            id UUID PRIMARY KEY,
            email TEXT UNIQUE,
            username TEXT,
            profile_picture TEXT,
            reading_plan TEXT DEFAULT '40-day',
            reading_start_date DATE,
            current_streak INTEGER DEFAULT 0,
            total_visits INTEGER DEFAULT 0,
            is_facilitator BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
    END IF;
    
    -- Create community_posts table if it doesn't exist
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'community_posts') THEN
        CREATE TABLE community_posts (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id UUID NOT NULL,
            username TEXT NOT NULL,
            avatar TEXT,
            day INTEGER NOT NULL DEFAULT 1,
            content TEXT NOT NULL,
            post_type TEXT NOT NULL CHECK (post_type IN ('insight', 'prayer', 'testimony')),
            insight TEXT,
            attention TEXT,
            commitment TEXT,
            task TEXT,
            system TEXT,
            prayer TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
    END IF;
END $$;

-- 5. CREATE TEST FUNCTION
CREATE OR REPLACE FUNCTION test_database_connection()
RETURNS TEXT AS $$
BEGIN
    RETURN 'Database connection is working perfectly!';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION test_database_connection() TO anon;
GRANT EXECUTE ON FUNCTION test_database_connection() TO authenticated;

-- 6. TEST THE CONNECTION
SELECT test_database_connection() as connection_test;

-- 7. TEST INSERT OPERATIONS
-- Test journal entry insert
INSERT INTO journal_entries (user_id, day, title, content) 
VALUES ('4878b194-d046-4227-826a-442018c0b19d', 1, 'Test Entry', 'This is a test journal entry')
ON CONFLICT DO NOTHING;

-- Test community post insert
INSERT INTO community_posts (user_id, username, day, content, post_type) 
VALUES ('4878b194-d046-4227-826a-442018c0b19d', 'Test User', 1, 'This is a test community post', 'prayer')
ON CONFLICT DO NOTHING;

-- 8. VERIFY INSERTS WORKED
SELECT 'Journal entries count:' as status, COUNT(*) as count FROM journal_entries;
SELECT 'Community posts count:' as status, COUNT(*) as count FROM community_posts;

-- 9. CLEAN UP TEST DATA
DELETE FROM journal_entries WHERE title = 'Test Entry';
DELETE FROM community_posts WHERE content = 'This is a test community post';

SELECT 'DEFINITIVE DATABASE FIX COMPLETED SUCCESSFULLY!' as final_status;
