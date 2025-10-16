-- Drop existing policies and create simpler ones
DROP POLICY IF EXISTS "Anyone can view community posts" ON community_posts;
DROP POLICY IF EXISTS "Users can insert their own posts" ON community_posts;
DROP POLICY IF EXISTS "Users can update their own posts" ON community_posts;
DROP POLICY IF EXISTS "Users can delete their own posts" ON community_posts;

-- Create simpler policies
CREATE POLICY "Enable read access for all users" ON community_posts
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON community_posts
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Enable update for users based on user_id" ON community_posts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Enable delete for users based on user_id" ON community_posts
  FOR DELETE USING (auth.uid() = user_id);

