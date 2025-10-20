-- Test data for leaderboard functionality
-- This script adds sample users with different streak values to test the leaderboard

-- Insert sample users with different streaks
INSERT INTO users (email, username, current_streak, total_visits, profile_picture) VALUES
('alice@test.com', 'Alice', 15, 25, '/placeholder.svg'),
('bob@test.com', 'Bob', 8, 12, '/placeholder.svg'),
('charlie@test.com', 'Charlie', 22, 30, '/placeholder.svg'),
('diana@test.com', 'Diana', 3, 5, '/placeholder.svg'),
('eve@test.com', 'Eve', 18, 20, '/placeholder.svg');

-- Add some journal entries for these users to make the leaderboard more realistic
INSERT INTO journal_entries (user_id, day, title, content) VALUES
((SELECT id FROM users WHERE email = 'alice@test.com'), 1, 'Day 1 Reflection', 'Starting my journey with God today.'),
((SELECT id FROM users WHERE email = 'alice@test.com'), 2, 'Day 2 Reflection', 'Learning about patience and trust.'),
((SELECT id FROM users WHERE email = 'bob@test.com'), 1, 'Day 1 Reflection', 'Excited to begin this spiritual journey.'),
((SELECT id FROM users WHERE email = 'charlie@test.com'), 1, 'Day 1 Reflection', 'Feeling blessed to be part of this community.'),
((SELECT id FROM users WHERE email = 'charlie@test.com'), 2, 'Day 2 Reflection', 'God is working in my life in amazing ways.'),
((SELECT id FROM users WHERE email = 'charlie@test.com'), 3, 'Day 3 Reflection', 'Growing stronger in my faith each day.'),
((SELECT id FROM users WHERE email = 'diana@test.com'), 1, 'Day 1 Reflection', 'New to this journey but eager to learn.'),
((SELECT id FROM users WHERE email = 'eve@test.com'), 1, 'Day 1 Reflection', 'Ready to deepen my relationship with God.'),
((SELECT id FROM users WHERE email = 'eve@test.com'), 2, 'Day 2 Reflection', 'Finding peace in daily prayer.');

-- Verify the user_statistics view works
SELECT * FROM user_statistics ORDER BY current_streak DESC;
