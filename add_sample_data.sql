-- Add sample data for all three post types
INSERT INTO community_posts (user_id, username, avatar, day, content, post_type, insight, attention, commitment, task, system, prayer) VALUES
(
  (SELECT id FROM users LIMIT 1),
  'Test User',
  null,
  1,
  'This is a sample insight post to test the community functionality.',
  'insight',
  'God is teaching me about patience through this season.',
  'I need to focus more on prayer and meditation.',
  'I commit to reading my Bible daily.',
  'Complete the 40-day reading plan.',
  'I will create a morning routine with God.',
  'Lord, help me stay consistent in my walk with You.'
),
(
  (SELECT id FROM users LIMIT 1),
  'Blessed One',
  null,
  2,
  'God answered my prayer in an amazing way! I was struggling with work stress, but through prayer and faith, God opened a new door for me.',
  'testimony',
  null,
  null,
  null,
  null,
  null,
  null
);

