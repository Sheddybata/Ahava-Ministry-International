-- Add test users with different streak values for leaderboard testing
-- Run this in your Supabase SQL editor

-- First, let's see what users exist
SELECT id, username, email, current_streak, total_visits FROM users ORDER BY current_streak DESC;

-- Insert test users with different streak values
INSERT INTO users (email, username, current_streak, total_visits, profile_picture, reading_plan) VALUES
('test1@faithflow.org', 'Faithful John', 25, 30, '/placeholder.svg', '40-days'),
('test2@faithflow.org', 'Prayerful Mary', 18, 22, '/placeholder.svg', '40-days'),
('test3@faithflow.org', 'Devoted David', 12, 15, '/placeholder.svg', '40-days'),
('test4@faithflow.org', 'Blessed Sarah', 8, 10, '/placeholder.svg', '40-days'),
('test5@faithflow.org', 'Graceful Anna', 5, 7, '/placeholder.svg', '40-days')
ON CONFLICT (email) DO UPDATE SET
  current_streak = EXCLUDED.current_streak,
  total_visits = EXCLUDED.total_visits;

-- Add some journal entries to make it more realistic
INSERT INTO journal_entries (user_id, day, title, content) VALUES
((SELECT id FROM users WHERE email = 'test1@faithflow.org'), 1, 'Day 1', 'Starting my journey with God.'),
((SELECT id FROM users WHERE email = 'test1@faithflow.org'), 2, 'Day 2', 'Learning about patience.'),
((SELECT id FROM users WHERE email = 'test2@faithflow.org'), 1, 'Day 1', 'Excited to begin.'),
((SELECT id FROM users WHERE email = 'test3@faithflow.org'), 1, 'Day 1', 'Ready to grow in faith.')
ON CONFLICT DO NOTHING;

-- Check the user_statistics view
SELECT * FROM user_statistics ORDER BY current_streak DESC;

-- Check if our test data is there
SELECT id, username, email, current_streak, total_visits FROM users WHERE email LIKE 'test%@faithflow.org' ORDER BY current_streak DESC;
