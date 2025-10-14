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

  // Create journal entry
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
    const { data, error } = await supabase
      .from('journal_entries')
      .insert(entry)
      .select()
      .single();
    
    if (error) throw error;
    return data;
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

// Community posts operations
export const communityService = {
  // Get all community posts
  async getCommunityPosts(postType?: 'insight' | 'prayer' | 'testimony') {
    let query = supabase
      .from('community_posts')
      .select(`
        *,
        post_likes(id, user_id),
        post_comments(id, user_id, username, avatar, content, created_at)
      `)
      .order('created_at', { ascending: false });

    if (postType) {
      query = query.eq('post_type', postType);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
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
    const { data, error } = await supabase
      .from('community_posts')
      .insert(post)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Like/unlike post
  async togglePostLike(postId: string, userId: string) {
    // Check if user already liked
    const { data: existingLike } = await supabase
      .from('post_likes')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .single();

    if (existingLike) {
      // Unlike
      const { error } = await supabase
        .from('post_likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', userId);
      
      if (error) throw error;
      return { liked: false };
    } else {
      // Like
      const { error } = await supabase
        .from('post_likes')
        .insert({ post_id: postId, user_id: userId });
      
      if (error) throw error;
      return { liked: true };
    }
  },

  // Add comment to post
  async addComment(postId: string, userId: string, username: string, avatar: string, content: string) {
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
    
    if (error) throw error;
    return data;
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

// Authentication helpers
export const authService = {
  // Sign up with email
  async signUp(email: string, password: string, username: string) {
    const redirectTo = import.meta.env.VITE_AUTH_REDIRECT_URL as string | undefined;
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username },
        emailRedirectTo: redirectTo,
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

