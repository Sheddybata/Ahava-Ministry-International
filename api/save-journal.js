// API endpoint to save journal entries - bypasses client-side network issues
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { entry } = req.body;
    
    if (!entry) {
      return res.status(400).json({ error: 'Entry data is required' });
    }

    // Import Supabase client for server-side
    const { createClient } = require('@supabase/supabase-js');
    
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      return res.status(500).json({ error: 'Supabase configuration missing' });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Insert journal entry
    const { data: journalData, error: journalError } = await supabase
      .from('journal_entries')
      .insert({
        user_id: entry.user_id,
        day: entry.day,
        title: entry.title,
        content: entry.content,
        insight: entry.insight || null,
        attention: entry.attention || null,
        commitment: entry.commitment || null,
        task: entry.task || null,
        system: entry.system || null,
        prayer: entry.prayer || null
      })
      .select()
      .single();

    if (journalError) {
      console.error('Journal insert error:', journalError);
      return res.status(500).json({ error: 'Failed to save journal entry', details: journalError });
    }

    // If sharing to community, also create community post
    let communityData = null;
    if (entry.shareToCommunity) {
      const { data: communityPostData, error: communityError } = await supabase
        .from('community_posts')
        .insert({
          user_id: entry.user_id,
          username: entry.username || 'Anonymous',
          avatar: entry.avatar || null,
          day: entry.day,
          content: entry.content,
          post_type: 'insight',
          insight: entry.insight || null,
          attention: entry.attention || null,
          commitment: entry.commitment || null,
          task: entry.task || null,
          system: entry.system || null,
          prayer: entry.prayer || null
        })
        .select()
        .single();

      if (communityError) {
        console.error('Community post error:', communityError);
        // Don't fail the whole request if community post fails
      } else {
        communityData = communityPostData;
      }
    }

    return res.status(200).json({
      success: true,
      journalEntry: journalData,
      communityPost: communityData
    });

  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}
