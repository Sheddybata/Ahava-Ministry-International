-- BYPASS NETWORK ISSUE - Direct database operations
-- This will create a simple API endpoint that bypasses the network timeout

-- 1. Create a simple function to insert journal entries
CREATE OR REPLACE FUNCTION insert_journal_entry(
    p_user_id UUID,
    p_day INTEGER,
    p_title TEXT,
    p_content TEXT,
    p_insight TEXT DEFAULT NULL,
    p_attention TEXT DEFAULT NULL,
    p_commitment TEXT DEFAULT NULL,
    p_task TEXT DEFAULT NULL,
    p_system TEXT DEFAULT NULL,
    p_prayer TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    new_id UUID;
BEGIN
    INSERT INTO journal_entries (
        user_id, day, title, content, insight, attention, 
        commitment, task, system, prayer
    ) VALUES (
        p_user_id, p_day, p_title, p_content, p_insight, p_attention,
        p_commitment, p_task, p_system, p_prayer
    ) RETURNING id INTO new_id;
    
    RETURN new_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Create a simple function to insert community posts
CREATE OR REPLACE FUNCTION insert_community_post(
    p_user_id UUID,
    p_username TEXT,
    p_avatar TEXT DEFAULT NULL,
    p_day INTEGER,
    p_content TEXT,
    p_post_type TEXT,
    p_insight TEXT DEFAULT NULL,
    p_attention TEXT DEFAULT NULL,
    p_commitment TEXT DEFAULT NULL,
    p_task TEXT DEFAULT NULL,
    p_system TEXT DEFAULT NULL,
    p_prayer TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    new_id UUID;
BEGIN
    INSERT INTO community_posts (
        user_id, username, avatar, day, content, post_type,
        insight, attention, commitment, task, system, prayer
    ) VALUES (
        p_user_id, p_username, p_avatar, p_day, p_content, p_post_type,
        p_insight, p_attention, p_commitment, p_task, p_system, p_prayer
    ) RETURNING id INTO new_id;
    
    RETURN new_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Grant permissions
GRANT EXECUTE ON FUNCTION insert_journal_entry TO anon;
GRANT EXECUTE ON FUNCTION insert_journal_entry TO authenticated;
GRANT EXECUTE ON FUNCTION insert_community_post TO anon;
GRANT EXECUTE ON FUNCTION insert_community_post TO authenticated;

-- 4. Test the functions
SELECT insert_journal_entry(
    '4878b194-d046-4227-826a-442018c0b19d'::UUID,
    1,
    'Test Journal Entry',
    'This is a test journal entry',
    'Test insight',
    'Test attention',
    'Test commitment',
    'Test task',
    'Test system',
    'Test prayer'
) as journal_entry_id;

SELECT insert_community_post(
    '4878b194-d046-4227-826a-442018c0b19d'::UUID,
    'Test User',
    NULL,
    1,
    'This is a test community post',
    'prayer',
    'Test insight',
    'Test attention',
    'Test commitment',
    'Test task',
    'Test system',
    'Test prayer'
) as community_post_id;

-- 5. Clean up test data
DELETE FROM journal_entries WHERE title = 'Test Journal Entry';
DELETE FROM community_posts WHERE content = 'This is a test community post';

SELECT 'Database functions created and tested successfully!' as status;
