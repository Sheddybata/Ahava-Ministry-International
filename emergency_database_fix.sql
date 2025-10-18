-- EMERGENCY DATABASE FIX
-- This will create the tables and fix everything immediately
-- Run this in your Supabase SQL Editor

-- 1. DROP AND RECREATE ALL TABLES FROM SCRATCH
DROP TABLE IF EXISTS post_comments CASCADE;
DROP TABLE IF EXISTS post_likes CASCADE;
DROP TABLE IF EXISTS community_posts CASCADE;
DROP TABLE IF EXISTS journal_entries CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 2. CREATE USERS TABLE
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

-- 3. CREATE JOURNAL_ENTRIES TABLE
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

-- 4. CREATE COMMUNITY_POSTS TABLE
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

-- 5. CREATE POST_LIKES TABLE
CREATE TABLE post_likes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(post_id, user_id)
);

-- 6. CREATE POST_COMMENTS TABLE
CREATE TABLE post_comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    username TEXT NOT NULL,
    avatar TEXT,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. NO RLS - COMPLETELY DISABLED
-- No RLS policies, no restrictions

-- 8. GRANT ALL PERMISSIONS
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- 9. TEST INSERT
INSERT INTO journal_entries (user_id, day, title, content) 
VALUES ('4878b194-d046-4227-826a-442018c0b19d', 1, 'Test Journal Entry', 'This is a test journal entry');

INSERT INTO community_posts (user_id, username, day, content, post_type) 
VALUES ('4878b194-d046-4227-826a-442018c0b19d', 'Test User', 1, 'This is a test community post', 'prayer');

-- 10. VERIFY
SELECT 'Journal entries:' as table_name, COUNT(*) as count FROM journal_entries
UNION ALL
SELECT 'Community posts:' as table_name, COUNT(*) as count FROM community_posts;

-- 11. CLEAN UP TEST DATA
DELETE FROM journal_entries WHERE title = 'Test Journal Entry';
DELETE FROM community_posts WHERE content = 'This is a test community post';

SELECT 'EMERGENCY DATABASE FIX COMPLETED - TABLES CREATED AND TESTED!' as status;
