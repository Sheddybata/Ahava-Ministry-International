-- Check for community posts with invalid day values
-- Run this in your Supabase SQL Editor to diagnose the "Invalid day" issue

-- 1. Check all community posts and their day values
SELECT 
    id,
    username,
    day,
    post_type,
    content,
    created_at
FROM community_posts 
ORDER BY created_at DESC;

-- 2. Check for posts with null or invalid day values
SELECT 
    id,
    username,
    day,
    post_type,
    content,
    created_at
FROM community_posts 
WHERE day IS NULL OR day <= 0 OR day > 365
ORDER BY created_at DESC;

-- 3. Count posts by day value to see the distribution
SELECT 
    day,
    COUNT(*) as post_count
FROM community_posts 
GROUP BY day
ORDER BY day;

-- 4. Update any posts with invalid day values to day 1
UPDATE community_posts 
SET day = 1 
WHERE day IS NULL OR day <= 0 OR day > 365;

-- 5. Verify the fix
SELECT 
    id,
    username,
    day,
    post_type,
    content
FROM community_posts 
ORDER BY created_at DESC;
