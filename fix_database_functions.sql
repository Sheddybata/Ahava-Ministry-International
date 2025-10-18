-- FIX DATABASE FUNCTIONS - Simple version without default parameters
-- Run this in your Supabase SQL Editor

-- 1. Drop existing functions if they exist
DROP FUNCTION IF EXISTS insert_journal_entry(UUID, INTEGER, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT);
DROP FUNCTION IF EXISTS insert_community_post(UUID, TEXT, TEXT, INTEGER, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT);

-- 2. Create simple function to insert journal entries (no default parameters)
CREATE OR REPLACE FUNCTION insert_journal_entry(
    p_user_id UUID,
    p_day INTEGER,
    p_title TEXT,
    p_content TEXT,
    p_insight TEXT,
    p_attention TEXT,
    p_commitment TEXT,
    p_task TEXT,
    p_system TEXT,
    p_prayer TEXT
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

-- 3. Create simple function to insert community posts (no default parameters)
CREATE OR REPLACE FUNCTION insert_community_post(
    p_user_id UUID,
    p_username TEXT,
    p_avatar TEXT,
    p_day INTEGER,
    p_content TEXT,
    p_post_type TEXT,
    p_insight TEXT,
    p_attention TEXT,
    p_commitment TEXT,
    p_task TEXT,
    p_system TEXT,
    p_prayer TEXT
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

-- 4. Grant permissions
GRANT EXECUTE ON FUNCTION insert_journal_entry TO anon;
GRANT EXECUTE ON FUNCTION insert_journal_entry TO authenticated;
GRANT EXECUTE ON FUNCTION insert_community_post TO anon;
GRANT EXECUTE ON FUNCTION insert_community_post TO authenticated;

-- 5. Test the functions
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

-- 6. Clean up test data
DELETE FROM journal_entries WHERE title = 'Test Journal Entry';
DELETE FROM community_posts WHERE content = 'This is a test community post';

SELECT 'Database functions created and tested successfully!' as status;
