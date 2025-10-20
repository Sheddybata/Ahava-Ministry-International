-- Update the user_statistics view to include profile_picture
-- Run this in your Supabase SQL editor

DROP VIEW IF EXISTS user_statistics;

CREATE VIEW user_statistics AS
SELECT 
  u.id,
  u.username,
  u.email,
  u.profile_picture,
  u.current_streak,
  u.total_visits,
  COALESCE(je.journal_count, 0) as journal_entries,
  COALESCE(cp.posts_count, 0) as community_posts,
  COALESCE(pl.likes_received, 0) as total_likes
FROM users u
LEFT JOIN (
  SELECT user_id, COUNT(*) as journal_count 
  FROM journal_entries 
  GROUP BY user_id
) je ON u.id = je.user_id
LEFT JOIN (
  SELECT user_id, COUNT(*) as posts_count 
  FROM community_posts 
  GROUP BY user_id
) cp ON u.id = cp.user_id
LEFT JOIN (
  SELECT cp.user_id, SUM(cp.likes_count) as likes_received
  FROM community_posts cp
  GROUP BY cp.user_id
) pl ON u.id = pl.user_id;

-- Test the view
SELECT * FROM user_statistics ORDER BY current_streak DESC LIMIT 5;
