-- Fix the day column constraint issue
-- Run this in your Supabase SQL Editor

-- 1. Check current constraints on community_posts table
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'community_posts' 
AND column_name = 'day';

-- 2. Remove any NOT NULL constraint on the day column if it exists
ALTER TABLE community_posts ALTER COLUMN day DROP NOT NULL;

-- 3. Set a proper default value for the day column
ALTER TABLE community_posts ALTER COLUMN day SET DEFAULT 1;

-- 4. Update any existing NULL day values to 1
UPDATE community_posts SET day = 1 WHERE day IS NULL;

-- 5. Now we can safely add the NOT NULL constraint back
ALTER TABLE community_posts ALTER COLUMN day SET NOT NULL;

-- 6. Verify the fix
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'community_posts' 
AND column_name = 'day';

-- 7. Test that we can insert a community post
-- This should work now
INSERT INTO community_posts (user_id, username, content, post_type, day) 
VALUES ('4878b194-d046-4227-826a-442018c0b19d', 'Test User', 'This is a test post after fix', 'prayer', 1);

-- 8. Clean up the test post
DELETE FROM community_posts WHERE content = 'This is a test post after fix';
