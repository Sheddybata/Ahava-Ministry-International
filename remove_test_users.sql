-- Remove test users from database to see real users in leaderboard
-- Run this in your Supabase SQL editor

-- First, let's see what test users exist
SELECT id, username, email, current_streak, total_visits 
FROM users 
WHERE email LIKE 'test%@faithflow.org' 
ORDER BY current_streak DESC;

-- Remove journal entries for test users
DELETE FROM journal_entries 
WHERE user_id IN (
  SELECT id FROM users WHERE email LIKE 'test%@faithflow.org'
);

-- Remove test users
DELETE FROM users 
WHERE email LIKE 'test%@faithflow.org';

-- Check what real users remain
SELECT id, username, email, current_streak, total_visits 
FROM users 
ORDER BY current_streak DESC;

-- Check the user_statistics view after cleanup
SELECT * FROM user_statistics 
ORDER BY current_streak DESC;
