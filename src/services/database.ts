import { supabase } from '@/lib/supabaseClient';

// User operations
export const userService = {
  // Get current user
  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  // Get user profile
  async getUserProfile(userId: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Create or update user profile
  async upsertUserProfile(profile: {
    id: string;
    email: string;
    username: string;
    profile_picture?: string;
    reading_plan?: string;
    reading_start_date?: string;
    current_streak?: number;
    total_visits?: number;
    is_facilitator?: boolean;
  }) {
    const { data, error } = await supabase
      .from('users')
      .upsert(profile)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update user statistics
  async updateUserStats(userId: string, stats: {
    current_streak?: number;
    total_visits?: number;
  }) {
    const { data, error } = await supabase
      .from('users')
      .update(stats)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// Journal entries operations
export const journalService = {
  // Get user's journal entries
  async getUserJournalEntries(userId: string) {
    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Create journal entry - SIMPLE AND DIRECT
  async createJournalEntry(entry: {
    user_id: string;
    day: number;
    title: string;
    content: string;
    insight?: string;
    attention?: string;
    commitment?: string;
    task?: string;
    system?: string;
    prayer?: string;
  }) {
    console.log('📝 Creating journal entry with data:', entry);
    
    try {
      console.log('🔍 Executing direct journal entry insert...');
      const { data, error } = await supabase
        .from('journal_entries')
        .insert(entry)
        .select()
        .single();
      
      if (error) {
        console.error('💥 Error creating journal entry:', error);
        console.error('💥 Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw error;
      }
      
      console.log('✅ Journal entry created successfully:', data);
      return data;
    } catch (error) {
      console.error('💥 createJournalEntry error:', error);
      throw error;
    }
  },

  // Update journal entry
  async updateJournalEntry(entryId: string, updates: Partial<{
    title: string;
    content: string;
    insight?: string;
    attention?: string;
    commitment?: string;
    task?: string;
    system?: string;
    prayer?: string;
  }>) {
    const { data, error } = await supabase
      .from('journal_entries')
      .update(updates)
      .eq('id', entryId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Delete journal entry
  async deleteJournalEntry(entryId: string) {
    const { error } = await supabase
      .from('journal_entries')
      .delete()
      .eq('id', entryId);
    
    if (error) throw error;
  }
};

// Wake up Supabase (free tier projects sleep after inactivity)
export const wakeUpSupabase = async () => {
  try {
    console.log('🔄 Attempting to wake up Supabase...');
    // Try a simple query to wake up the project
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .limit(1);
    
    if (error) {
      console.log('💤 Supabase appears to be sleeping, trying to wake up...');
      // Wait a bit and try again
      await new Promise(resolve => setTimeout(resolve, 2000));
      const { data: retryData, error: retryError } = await supabase
        .from('users')
        .select('id')
        .limit(1);
      
      if (retryError) {
        console.error('💥 Failed to wake up Supabase:', retryError);
        return false;
      }
    }
    console.log('✅ Supabase is awake and ready');
    return true;
  } catch (error) {
    console.error('💥 Error waking up Supabase:', error);
    return false;
  }
};

// Test Supabase connection with multiple fallback strategies
export const testSupabaseConnection = async () => {
  try {
    console.log('🔍 Testing Supabase connection...');
    console.log('🔍 Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
    console.log('🔍 Supabase Key exists:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);
    
    // Strategy 1: Test with simple query
    try {
      const { data, error } = await supabase
        .from('users')
        .select('count')
        .limit(1)
        .abortSignal(AbortSignal.timeout(5000));
      
      if (!error) {
        console.log('✅ Supabase connection test successful (strategy 1)');
        return true;
      }
      console.log('⚠️ Strategy 1 failed, trying strategy 2...');
    } catch (strategy1Error) {
      console.log('⚠️ Strategy 1 failed, trying strategy 2...');
    }
    
    // Strategy 2: Test with function call
    try {
      const { data, error } = await supabase
        .rpc('test_connection')
        .abortSignal(AbortSignal.timeout(5000));
      
      if (!error && data) {
        console.log('✅ Supabase connection test successful (strategy 2)');
        return true;
      }
      console.log('⚠️ Strategy 2 failed, trying strategy 3...');
    } catch (strategy2Error) {
      console.log('⚠️ Strategy 2 failed, trying strategy 3...');
    }
    
    // Strategy 3: Test with auth check
    try {
      const { data, error } = await supabase.auth.getSession();
      if (!error) {
        console.log('✅ Supabase connection test successful (strategy 3)');
        return true;
      }
    } catch (strategy3Error) {
      console.log('⚠️ Strategy 3 failed');
    }
    
    console.error('💥 All connection test strategies failed');
    return false;
  } catch (error) {
    console.error('💥 Supabase connection test error:', error);
    return false;
  }
};

// Community posts operations
export const communityService = {
  // Get all community posts
  async getCommunityPosts(postType?: 'insight' | 'prayer' | 'testimony') {
    console.log('🔍 getCommunityPosts called with postType:', postType);
    console.log('🔍 Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
    console.log('🔍 Supabase Key exists:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);
    
    try {
      // Retry logic for better reliability on Vercel
      let attempts = 0;
      const maxAttempts = 3;
      
      while (attempts < maxAttempts) {
        try {
          console.log(`🔄 Attempt ${attempts + 1}/${maxAttempts} to fetch community posts`);
          
          let query = supabase
            .from('community_posts')
            .select(`
              *,
              users!community_posts_user_id_fkey(is_facilitator),
              post_likes(id, user_id),
              post_comments(id, user_id, username, avatar, content, created_at)
            `)
            .order('created_at', { ascending: false });

          if (postType) {
            query = query.eq('post_type', postType);
          }

          console.log('🔍 Executing community posts query...');
          const { data, error } = await query;
          
          if (error) {
            console.error(`💥 Attempt ${attempts + 1} failed:`, error);
            console.error('💥 Error details:', {
              message: error.message,
              details: error.details,
              hint: error.hint,
              code: error.code
            });
            if (attempts === maxAttempts - 1) throw error;
            attempts++;
            await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
            continue;
          }
          
          console.log('✅ Community posts fetched successfully:', data);
          console.log('✅ Number of posts fetched:', data?.length || 0);
          if (data && data.length > 0) {
            console.log('✅ First post ID:', data[0]?.id);
            console.log('✅ First post username:', data[0]?.username);
          }
          return data;
        } catch (error) {
          console.error(`💥 Attempt ${attempts + 1} error:`, error);
          if (attempts === maxAttempts - 1) throw error;
          attempts++;
          await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
        }
      }
    } catch (error) {
      console.error('💥 getCommunityPosts final error:', error);
      throw error;
    }
  },

  // Create community post
  async createCommunityPost(post: {
    user_id: string;
    username: string;
    avatar?: string;
    day: number;
    content: string;
    post_type: 'insight' | 'prayer' | 'testimony';
    insight?: string;
    attention?: string;
    commitment?: string;
    task?: string;
    system?: string;
    prayer?: string;
  }) {
    console.log('🌐 Creating community post with data:', post);
    console.log('🔍 Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
    console.log('🔍 Supabase Key exists:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);
    console.log('🔍 Current user ID:', post.user_id);
    console.log('🔍 Post type:', post.post_type);
    console.log('🔍 Day value:', post.day);
    
    try {
      // Test connection first
      console.log('🔍 Testing Supabase connection...');
      const { data: testData, error: testError } = await supabase
        .from('community_posts')
        .select('id')
        .limit(1);
      
      if (testError) {
        console.error('💥 Supabase connection test failed:', testError);
        throw new Error(`Connection test failed: ${testError.message}`);
      }
      console.log('✅ Supabase connection test passed');
      
      // Validate required fields
      if (!post.user_id) {
        throw new Error('user_id is required');
      }
      if (!post.username) {
        throw new Error('username is required');
      }
      if (!post.content) {
        throw new Error('content is required');
      }
      if (!post.post_type) {
        throw new Error('post_type is required');
      }
      
      // Ensure day is always a valid positive integer
      if (post.day === null || post.day === undefined || post.day <= 0) {
        console.warn('⚠️ Day is invalid, setting to 1. Original value:', post.day);
        post.day = 1;
      }
      
      // Ensure day is an integer
      post.day = Math.floor(post.day);
      
      console.log('🔍 Validated post data:', post);
      
      // Retry logic for better reliability on Vercel
      let attempts = 0;
      const maxAttempts = 3;
      
      while (attempts < maxAttempts) {
        try {
          console.log(`🔄 Attempt ${attempts + 1}/${maxAttempts} to create community post`);
          console.log('🔄 Inserting post:', JSON.stringify(post, null, 2));
          
          const { data, error } = await supabase
            .from('community_posts')
            .insert(post)
            .select()
            .single();
          
          if (error) {
            console.error(`💥 Attempt ${attempts + 1} failed:`, error);
            console.error('💥 Error details:', {
              message: error.message,
              details: error.details,
              hint: error.hint,
              code: error.code
            });
            
            // If it's an RLS error, provide more specific guidance
            if (error.code === '42501') {
              console.error('💥 RLS Policy Error: Row Level Security is blocking this operation');
              console.error('💥 Please run the fix_community_rls_final.sql script in Supabase');
            }
            
            if (attempts === maxAttempts - 1) throw error;
            attempts++;
            await new Promise(resolve => setTimeout(resolve, 1000 * attempts)); // Exponential backoff
            continue;
          }
          
          console.log('✅ Community post created successfully:', data);
          console.log('✅ Post ID:', data.id);
          console.log('✅ Created at:', data.created_at);
          return data;
        } catch (error) {
          console.error(`💥 Attempt ${attempts + 1} error:`, error);
          if (attempts === maxAttempts - 1) throw error;
          attempts++;
          await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
        }
      }
    } catch (error) {
      console.error('💥 createCommunityPost final error:', error);
      console.error('💥 Error stack:', error.stack);
      throw error;
    }
  },

  // Like/unlike post
  async togglePostLike(postId: string, userId: string) {
    console.log('❤️ togglePostLike called with:', { postId, userId });
    
    try {
      // Check if user already liked
      console.log('🔍 Checking if user already liked...');
      const { data: existingLike } = await supabase
        .from('post_likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', userId)
        .single();

      if (existingLike) {
        // Unlike
        console.log('💔 User already liked, removing like...');
        const { error } = await supabase
          .from('post_likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', userId);
        
        if (error) {
          console.error('💥 Error removing like:', error);
          throw error;
        }
        console.log('✅ Like removed successfully');
        return { liked: false };
      } else {
        // Like
        console.log('💖 User has not liked, adding like...');
        const { error } = await supabase
          .from('post_likes')
          .insert({ post_id: postId, user_id: userId });
        
        if (error) {
          console.error('💥 Error adding like:', error);
          throw error;
        }
        console.log('✅ Like added successfully');
        return { liked: true };
      }
    } catch (error) {
      console.error('💥 togglePostLike error:', error);
      throw error;
    }
  },

  // Add comment to post
  async addComment(postId: string, userId: string, username: string, avatar: string, content: string) {
    console.log('💬 addComment called with:', { postId, userId, username, avatar, content });
    
    try {
      const { data, error } = await supabase
        .from('post_comments')
        .insert({
          post_id: postId,
          user_id: userId,
          username,
          avatar,
          content
        })
        .select()
        .single();
      
      if (error) {
        console.error('💥 Error adding comment:', error);
        throw error;
      }
      console.log('✅ Comment added successfully:', data);
      return data;
    } catch (error) {
      console.error('💥 addComment error:', error);
      throw error;
    }
  }
};

// Announcements operations
export const announcementService = {
  // Get all announcements
  async getAnnouncements() {
    const { data, error } = await supabase
      .from('announcements')
      .select(`
        *,
        users!facilitator_id(username)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Create announcement (facilitators only)
  async createAnnouncement(announcement: {
    facilitator_id: string;
    title: string;
    message: string;
    link?: string;
  }) {
    const { data, error } = await supabase
      .from('announcements')
      .insert(announcement)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// Real-time subscriptions
export const realtimeService = {
  // Subscribe to community posts
  subscribeToCommunityPosts(callback: (payload: any) => void) {
    return supabase
      .channel('community_posts')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'community_posts' },
        callback
      )
      .subscribe();
  },

  // Subscribe to post likes
  subscribeToPostLikes(callback: (payload: any) => void) {
    return supabase
      .channel('post_likes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'post_likes' },
        callback
      )
      .subscribe();
  },

  // Subscribe to post comments
  subscribeToPostComments(callback: (payload: any) => void) {
    return supabase
      .channel('post_comments')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'post_comments' },
        callback
      )
      .subscribe();
  },

  // Subscribe to announcements
  subscribeToAnnouncements(callback: (payload: any) => void) {
    return supabase
      .channel('announcements')
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'announcements' },
        callback
      )
      .subscribe();
  }
};

// Statistics / leaderboard
export const statsService = {
  async getLeaderboard() {
    // Prefer RPC if created; fallback to view select
    try {
      const { data, error } = await supabase.rpc('get_leaderboard');
      if (error) throw error;
      return data as any[];
    } catch (_) {
      const { data, error } = await supabase
        .from('user_statistics')
        .select('*')
        .order('current_streak', { ascending: false });
      if (error) throw error;
      return data as any[];
    }
  }
};

// Authentication helpers
export const authService = {
  // Sign up with email
  async signUp(email: string, password: string, username: string, phone?: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username, phone },
      }
    });
    
    if (error) throw error;
    return data;
  },

  // Sign in with email
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    return data;
  },

  // Request password reset email
  async requestPasswordReset(email: string) {
    const baseRedirect = import.meta.env.VITE_AUTH_REDIRECT_URL as string | undefined;
    const redirectTo = baseRedirect
      ? `${baseRedirect.replace(/\/$/, '')}/reset-password`
      : undefined;
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });
    if (error) throw error;
    return data;
  },

  // Update password after redirect (recovery session)
  async updatePassword(newPassword: string) {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (error) throw error;
    return data;
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // Get session
  async getSession() {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  },

  // On auth state change
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }
};

