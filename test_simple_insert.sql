-- SIMPLE TEST - Check if basic inserts work
-- Run this in Supabase SQL Editor to test basic functionality

-- 1. Test basic journal entry insert
INSERT INTO journal_entries (
    user_id, day, title, content, insight, attention, 
    commitment, task, system, prayer
) VALUES (
    '4878b194-d046-4227-826a-442018c0b19d'::UUID,
    1,
    'Direct Test Entry',
    'This is a direct insert test',
    'Test insight',
    'Test attention',
    'Test commitment',
    'Test task',
    'Test system',
    'Test prayer'
) RETURNING id, title, created_at;

-- 2. Test basic community post insert
INSERT INTO community_posts (
    user_id, username, avatar, day, content, post_type,
    insight, attention, commitment, task, system, prayer
) VALUES (
    '4878b194-d046-4227-826a-442018c0b19d'::UUID,
    'Test User',
    NULL,
    1,
    'This is a direct community post test',
    'prayer',
    'Test insight',
    'Test attention',
    'Test commitment',
    'Test task',
    'Test system',
    'Test prayer'
) RETURNING id, content, created_at;

-- 3. Check if functions exist
SELECT 
    routine_name, 
    routine_type,
    data_type as return_type
FROM information_schema.routines 
WHERE routine_name IN ('insert_journal_entry', 'insert_community_post')
AND routine_schema = 'public';

-- 4. Test the function directly
SELECT insert_journal_entry(
    '4878b194-d046-4227-826a-442018c0b19d'::UUID,
    1,
    'Function Test Entry',
    'This is a function test',
    'Test insight',
    'Test attention',
    'Test commitment',
    'Test task',
    'Test system',
    'Test prayer'
) as function_result;

-- 5. Clean up test data
DELETE FROM journal_entries WHERE title LIKE '%Test%';
DELETE FROM community_posts WHERE content LIKE '%test%';

SELECT 'Simple insert test completed!' as status;
