-- Test database connection and table structure
-- Run this in your Supabase SQL Editor

-- 1. Check if journal_entries table exists
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'journal_entries'
ORDER BY ordinal_position;

-- 2. Check current user authentication
SELECT 
    'Current user check' as test,
    auth.uid() as current_user_id,
    auth.role() as current_role;

-- 3. Test simple insert with your user ID
INSERT INTO journal_entries (user_id, day, title, content) 
VALUES ('4878b194-d046-4227-826a-442018c0b19d', 1, 'Test Entry', 'This is a test entry')
RETURNING id, user_id, title, created_at;

-- 4. Check if the insert worked
SELECT 
    'Test entry check' as test,
    COUNT(*) as count,
    MAX(created_at) as latest_entry
FROM journal_entries 
WHERE user_id = '4878b194-d046-4227-826a-442018c0b19d';

-- 5. Clean up test data
DELETE FROM journal_entries 
WHERE title = 'Test Entry' AND user_id = '4878b194-d046-4227-826a-442018c0b19d';

SELECT 'Database connection test completed!' as status;
