// API endpoint to save community posts - bypasses client-side network issues
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { post } = req.body;
    
    if (!post) {
      return res.status(400).json({ error: 'Post data is required' });
    }

    // Import Supabase client for server-side
    const { createClient } = require('@supabase/supabase-js');
    
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      return res.status(500).json({ error: 'Supabase configuration missing' });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Insert community post
    const { data, error } = await supabase
      .from('community_posts')
      .insert({
        user_id: post.user_id,
        username: post.username,
        avatar: post.avatar || null,
        day: post.day,
        content: post.content,
        post_type: post.post_type,
        insight: post.insight || null,
        attention: post.attention || null,
        commitment: post.commitment || null,
        task: post.task || null,
        system: post.system || null,
        prayer: post.prayer || null
      })
      .select()
      .single();

    if (error) {
      console.error('Community post insert error:', error);
      return res.status(500).json({ error: 'Failed to save community post', details: error });
    }

    return res.status(200).json({
      success: true,
      communityPost: data
    });

  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}
