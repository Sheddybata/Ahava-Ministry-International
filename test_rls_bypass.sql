-- Temporarily disable RLS to test if that's the issue
ALTER TABLE community_posts DISABLE ROW LEVEL SECURITY;

-- Test insert
INSERT INTO community_posts (user_id, username, content, post_type) 
VALUES (
  (SELECT id FROM users LIMIT 1),
  'Test User',
  'This is a test post to check if RLS is blocking inserts',
  'prayer'
);

-- Re-enable RLS
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;

