import React, { useState, useEffect } from 'react';
import SplashScreen from './SplashScreen';
import AuthScreen from './AuthScreen';
// import FacilitatorLogin from './FacilitatorLogin';
import OnboardingScreen from './OnboardingScreen';
import TopHeader from './TopHeader';
import BottomNavigation from './BottomNavigation';
import HomePage from './HomePage';
// Removed AnnouncementForm import
import JournalPage from './JournalPage';
import LeaderboardPage from './LeaderboardPage';
import CommunityPage from './CommunityPage';
import ProfileModal from './ProfileModal';
import { supabase } from '@/lib/supabaseClient';
import { 
  userService, 
  journalService, 
  communityService, 
  announcementService,
  realtimeService,
  authService,
  testSupabaseConnection,
  statsService
} from '@/services/database';

const AppLayout: React.FC = () => {
  const [appState, setAppState] = useState<'splash' | 'auth' | 'onboarding' | 'main'>('splash');
  const [activeTab, setActiveTab] = useState('home');
  const [userData, setUserData] = useState({
    username: '',
    readingPlan: '',
    readingStartDate: null as string | null,
    profilePicture: null as string | null,
    streaks: 0,
    totalVisits: 0
  });
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [journalEntries, setJournalEntries] = useState<any[]>([]);
  const [communityEntries, setCommunityEntries] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  // Removed facilitator functionality
  const [loading, setLoading] = useState(true);

  const [leaderboardUsers, setLeaderboardUsers] = useState<any[]>([]);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  const [showDebug, setShowDebug] = useState(false);

  const addDebugLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const logMessage = `[${timestamp}] ${message}`;
    console.log(logMessage);
    setDebugInfo(prev => [...prev.slice(-9), logMessage]); // Keep last 10 messages
  };

  useEffect(() => {
    // Increment total visits when entering main
    if (appState === 'main') {
      setUserData(prev => ({ ...prev, totalVisits: prev.totalVisits + 1 }));
    }
  }, [appState]);

  const handleSplashComplete = () => {
    // After splash, go to auth unless we already have a session
    setAppState('auth');
  };

  const handleAuthComplete = async (isNewUser?: boolean, user?: any) => {
    try {
      console.log('🔐 Auth completed for user:', user?.email);
      
      // Set current user from auth result
      if (user) {
        setCurrentUser(user);
      }
      
      // Session is handled by Supabase automatically - no need for localStorage backup
      console.log('💾 User authenticated, session managed by Supabase');
      
      // Removed facilitator logic
      
      // Load user data after authentication
      if (user) {
        await loadUserData(user);
      }

      if (isNewUser) {
        // New users go through onboarding
        setAppState('onboarding');
      } else {
        // Existing users go directly to main app
        setAppState('main');
      }
    } catch (error) {
      console.error('💥 Error completing auth:', error);
    }
  };

  const initializeApp = async () => {
    try {
      console.log('🔍 Checking for existing session...');
      
      // Always try to get the real session first
      try {
        const session = await authService.getSession();
        if (session?.user) {
          console.log('✅ Real session found, loading full user data');
          setCurrentUser(session.user);
          await loadUserData(session.user);
          setAppState('main');
          return;
        }
      } catch (sessionError) {
        console.log('⚠️ Session check failed:', sessionError);
      }
      
      // Clear any stale localStorage data if no real session
      console.log('🧹 Clearing stale localStorage data');
      localStorage.removeItem('ff_user_session');
      localStorage.removeItem('ff_user_email');
      localStorage.removeItem('ff_user_id');
      localStorage.removeItem('ff_is_facilitator');
      
      // No session found - go to auth
      console.log('❌ No session found, going to auth');
      setAppState('auth');
    } catch (error) {
      console.error('💥 Error initializing app:', error);
      setAppState('auth');
    } finally {
      setLoading(false);
    }
  };

  // Initialize app with real-time data
  useEffect(() => {
    initializeApp();
  }, []);

  const loadUserDataForRefresh = async (user: any) => {
    try {
      let profile: any | null = null;
      try {
        profile = await userService.getUserProfile(user.id);
      } catch (_) {
        profile = null;
      }

      if (!profile) {
        // For refresh, create a minimal profile but don't redirect to onboarding
        const fallbackUsername = (user.email || '').split('@')[0] || 'New User';
        const today = new Date().toISOString().slice(0, 10);
        const makeFacilitator = (user.email || '').toLowerCase() === 'admin@faithflow.org';
        
        try {
          await userService.upsertUserProfile({
            id: user.id,
            email: user.email,
            username: fallbackUsername,
            reading_plan: '40-days',
            reading_start_date: today,
            is_facilitator: makeFacilitator
          });
        } catch (_) {
          // Ignore profile creation errors during refresh
        }
        
        setUserData(prev => ({
          ...prev,
          username: fallbackUsername,
          readingPlan: '40-days',
          readingStartDate: today,
          profilePicture: null,
          streaks: 0,
          totalVisits: 0
        }));
        // Removed facilitator logic(makeFacilitator);
        return;
      }

      setUserData({
        username: profile.username,
        readingPlan: profile.reading_plan,
        readingStartDate: profile.reading_start_date || null,
        profilePicture: profile.profile_picture,
        streaks: profile.current_streak,
        totalVisits: profile.total_visits
      });
      // Removed facilitator logic(profile.is_facilitator);

      // Auto-elevate facilitator for specific admin email
      if ((user.email || '').toLowerCase() === 'admin@faithflow.org' && !profile.is_facilitator) {
        try {
          await userService.upsertUserProfile({
            id: user.id,
            email: user.email,
            username: profile.username,
            profile_picture: profile.profile_picture,
            reading_plan: profile.reading_plan,
            reading_start_date: profile.reading_start_date,
            is_facilitator: true
          });
          // Removed facilitator logic(true);
        } catch (e) {
          console.error('Failed to auto-elevate facilitator:', e);
        }
      }

      // Load leaderboard data for refresh
      try {
        const leaderboardData = await statsService.getLeaderboard();
        if (Array.isArray(leaderboardData) && leaderboardData.length > 0) {
          const transformedLeaderboard = leaderboardData.map((user: any, index: number) => ({
            id: user.id,
            username: user.username,
            avatar: user.profile_picture || '/placeholder.svg',
            streaks: user.current_streak || 0,
            entries: user.journal_entries || 0,
            position: index + 1
          }));
          setLeaderboardUsers(transformedLeaderboard);
        } else {
          console.log('⚠️ No leaderboard data received in refresh');
          setLeaderboardUsers([]);
        }
      } catch (error) {
        console.error('Error loading leaderboard data for refresh:', error);
        setLeaderboardUsers([]);
      }
    } catch (error) {
      console.error('Error loading user data for refresh:', error);
    }
  };

  const loadUserData = async (user: any) => {
    console.log('🔄 loadUserData called with user:', user);
    addDebugLog('🔄 Starting user data load...');
    try {
      setCurrentUser(user);
      let profile: any | null = null;
      try {
        profile = await userService.getUserProfile(user.id);
      } catch (_) {
        profile = null;
      }

      if (!profile) {
        const fallbackUsername = (user.email || '').split('@')[0] || 'New User';
        const today = new Date().toISOString().slice(0, 10);
        const makeFacilitator = (user.email || '').toLowerCase() === 'admin@faithflow.org';
        await userService.upsertUserProfile({
          id: user.id,
          email: user.email,
          username: fallbackUsername,
          reading_plan: '40-days',
          reading_start_date: today,
          is_facilitator: makeFacilitator
        });
        setUserData(prev => ({
          ...prev,
          username: fallbackUsername,
          readingPlan: '40-days',
          readingStartDate: today,
          profilePicture: null,
          streaks: 0,
          totalVisits: 0
        }));
        // Removed facilitator logic(makeFacilitator);
        setAppState('onboarding');
        return;
      }

      setUserData({
        username: profile.username,
        readingPlan: profile.reading_plan,
        readingStartDate: profile.reading_start_date || null,
        profilePicture: profile.profile_picture,
        streaks: profile.current_streak,
        totalVisits: profile.total_visits
      });
      // Removed facilitator logic(profile.is_facilitator);

      // Auto-elevate facilitator for specific admin email
      if ((user.email || '').toLowerCase() === 'admin@faithflow.org' && !profile.is_facilitator) {
        try {
          await userService.upsertUserProfile({
            id: user.id,
            email: user.email,
            username: profile.username,
            profile_picture: profile.profile_picture,
            reading_plan: profile.reading_plan,
            reading_start_date: profile.reading_start_date,
            is_facilitator: true
          });
          // Removed facilitator logic(true);
        } catch (e) {
          console.error('Failed to auto-elevate facilitator:', e);
        }
      }

      const journalData = await journalService.getUserJournalEntries(user.id);
      setJournalEntries(journalData);
      
      // Test Supabase connection first
      addDebugLog('🔍 Testing Supabase connection...');
      addDebugLog('🔍 Supabase URL: ' + (import.meta.env.VITE_SUPABASE_URL || 'NOT SET'));
      addDebugLog('🔍 Supabase Key exists: ' + (!!import.meta.env.VITE_SUPABASE_ANON_KEY));
      
      const connectionOk = await testSupabaseConnection();
      if (!connectionOk) {
        addDebugLog('💥 Supabase connection failed, skipping community data');
        setCommunityEntries([]);
      } else {
        addDebugLog('✅ Supabase connection test passed, loading community data...');
        try {
          // Add timeout to prevent hanging
          const communityDataPromise = communityService.getCommunityPosts();
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Community data loading timeout')), 30000)
          );
          
          addDebugLog('🔄 Starting community data fetch...');
          const communityData = await Promise.race([communityDataPromise, timeoutPromise]);
          addDebugLog(`📋 Raw community data received: ${Array.isArray(communityData) ? communityData.length : 0} posts`);
          
          if (Array.isArray(communityData) && communityData.length > 0) {
            addDebugLog(`📋 First post ID: ${communityData[0]?.id}`);
            addDebugLog(`📋 First post type: ${communityData[0]?.post_type}`);
          } else {
            addDebugLog('⚠️ No community data received or empty array');
          }
          
          const mappedCommunity = (Array.isArray(communityData) ? communityData : []).map((row: any) => ({
            ...row,
            type: row.post_type, // Map post_type to type for filtering
            is_facilitator: row?.users?.is_facilitator ?? false,
            comments: row.post_comments || [], // Map post_comments to comments
            likedBy: row.post_likes?.map((like: any) => like.user_id) || [], // Map post_likes to likedBy array
            likes: row.post_likes?.length || 0, // Count of likes
          }));
          addDebugLog(`📋 Mapped community data: ${mappedCommunity?.length || 0} posts`);
          if (mappedCommunity && mappedCommunity.length > 0) {
            addDebugLog(`📋 First mapped post ID: ${mappedCommunity[0]?.id}`);
          }
          setCommunityEntries(mappedCommunity);
          addDebugLog('✅ Community entries set in state');
        } catch (error) {
          addDebugLog(`💥 Error loading community data: ${error}`);
          setCommunityEntries([]);
        }
      }

      // Load leaderboard data
      addDebugLog('🏆 Loading leaderboard data...');
      try {
        const leaderboardData = await statsService.getLeaderboard();
        addDebugLog(`🏆 Raw leaderboard data received: ${Array.isArray(leaderboardData) ? leaderboardData.length : 0} users`);
        
        if (Array.isArray(leaderboardData) && leaderboardData.length > 0) {
          addDebugLog(`🏆 First user: ${leaderboardData[0]?.username} (${leaderboardData[0]?.current_streak} streak)`);
          addDebugLog(`🏆 Raw data sample: ${JSON.stringify(leaderboardData[0], null, 2)}`);
          
          // Transform data to match LeaderboardUser interface
          const transformedLeaderboard = leaderboardData.map((user: any, index: number) => {
            const transformedUser = {
              id: user.id,
              username: user.username,
              avatar: user.profile_picture || null, // Use null if no profile picture
              streaks: user.current_streak || 0,
              entries: user.journal_entries || 0,
              position: index + 1
            };
            addDebugLog(`🏆 Transformed user ${index + 1}: ${transformedUser.username} - ${transformedUser.streaks} streaks`);
            return transformedUser;
          });
          
          addDebugLog(`🏆 Transformed leaderboard data: ${transformedLeaderboard.length} users`);
          setLeaderboardUsers(transformedLeaderboard);
          addDebugLog('✅ Leaderboard data loaded successfully');
        } else {
          addDebugLog('⚠️ No leaderboard data received or empty array');
          addDebugLog(`🏆 Environment check - DEV: ${import.meta.env.DEV}, MODE: ${import.meta.env.MODE}`);
          addDebugLog('🏆 Production mode: Showing empty leaderboard (no mock data)');
          setLeaderboardUsers([]);
        }
      } catch (error) {
        addDebugLog(`💥 Error loading leaderboard data: ${error}`);
        setLeaderboardUsers([]);
      }

      setupRealtimeSubscriptions();
      
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  // Function to force refresh all app data
  const forceRefreshAllData = async () => {
    addDebugLog('🔄 Force refreshing all app data...');
    try {
      // Try to get fresh session
      const session = await authService.getSession();
      if (session?.user) {
        addDebugLog('✅ Fresh session found, loading full data');
        setCurrentUser(session.user);
        await loadUserData(session.user);
        return true;
      } else {
        // Fallback to stored session
        const storedSession = localStorage.getItem('ff_user_session');
        const storedEmail = localStorage.getItem('ff_user_email');
        if (storedSession === '1' && storedEmail) {
          addDebugLog('🔄 Using stored session for data refresh');
          const storedUserId = localStorage.getItem('ff_user_id') || 'local-user';
          const user = { email: storedEmail, id: storedUserId };
          setCurrentUser(user);
          await loadUserData(user);
          return true;
        }
      }
      addDebugLog('⚠️ No session available for data refresh');
      return false;
    } catch (error) {
      addDebugLog(`💥 Error force refreshing data: ${error}`);
      return false;
    }
  };

  // Function to refresh leaderboard data
  const refreshLeaderboardData = async () => {
    addDebugLog('🏆 Refreshing leaderboard data...');
    try {
      const leaderboardData = await statsService.getLeaderboard();
      addDebugLog(`🏆 Raw leaderboard data received: ${Array.isArray(leaderboardData) ? leaderboardData.length : 0} users`);
      
      if (Array.isArray(leaderboardData) && leaderboardData.length > 0) {
        addDebugLog(`🏆 First user: ${leaderboardData[0]?.username} (${leaderboardData[0]?.current_streak} streak)`);
        
        const transformedLeaderboard = leaderboardData.map((user: any, index: number) => ({
          id: user.id,
          username: user.username,
          avatar: user.profile_picture || '/placeholder.svg',
          streaks: user.current_streak || 0,
          entries: user.journal_entries || 0,
          position: index + 1
        }));
        
        addDebugLog(`🏆 Transformed leaderboard data: ${transformedLeaderboard.length} users`);
        setLeaderboardUsers(transformedLeaderboard);
        addDebugLog('✅ Leaderboard data refreshed successfully');
      } else {
        addDebugLog('⚠️ No leaderboard data received or empty array');
        setLeaderboardUsers([]);
      }
    } catch (error) {
      addDebugLog(`💥 Error refreshing leaderboard data: ${error}`);
    }
  };

  const setupRealtimeSubscriptions = () => {
    // Subscribe to community posts changes
    realtimeService.subscribeToCommunityPosts((payload) => {
      console.log('🔄 Realtime community post update:', payload);
      if (payload.eventType === 'INSERT') {
        const mappedNew = {
          ...payload.new,
          type: payload.new.post_type, // Map post_type to type
          is_facilitator: false
        };
        setCommunityEntries(prev => [mappedNew, ...prev]);
      } else if (payload.eventType === 'UPDATE') {
        const mappedUpdated = {
          ...payload.new,
          type: payload.new.post_type, // Map post_type to type
          is_facilitator: false
        };
        setCommunityEntries(prev => 
          prev.map(entry => entry.id === payload.new.id ? mappedUpdated : entry)
        );
      } else if (payload.eventType === 'DELETE') {
        setCommunityEntries(prev => 
          prev.filter(entry => entry.id !== payload.old.id)
        );
      }
    });

    // Subscribe to post likes changes
    realtimeService.subscribeToPostLikes((payload) => {
      setCommunityEntries(prev => 
        prev.map(entry => {
          if (entry.id === payload.new?.post_id || entry.id === payload.old?.post_id) {
            return {
              ...entry,
              likes_count: payload.eventType === 'INSERT' 
                ? (entry.likes_count || 0) + 1 
                : (entry.likes_count || 0) - 1
            };
          }
          return entry;
        })
      );
    });

    // Subscribe to post comments changes
    realtimeService.subscribeToPostComments((payload) => {
      setCommunityEntries(prev => 
        prev.map(entry => {
          if (entry.id === payload.new?.post_id) {
            return {
              ...entry,
              post_comments: payload.eventType === 'INSERT' 
                ? [...(entry.post_comments || []), payload.new]
                : entry.post_comments?.filter(comment => comment.id !== payload.old?.id)
            };
          }
          return entry;
        })
      );
    });
  };

  // Listen for auth state changes
  useEffect(() => {

    const { data: { subscription } } = authService.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        console.log('🚪 User signed out, clearing all app data');
        setCurrentUser(null);
        setUserData({
          username: '',
          readingPlan: '',
          readingStartDate: null,
          profilePicture: null,
          streaks: 0,
          totalVisits: 0
        });
        setJournalEntries([]);
        setCommunityEntries([]);
        setLeaderboardUsers([]); // Clear leaderboard data too
        setDebugInfo([]); // Clear debug info
        // Removed facilitator logic(false);
        setAppState('auth');
      }
      // Note: SIGNED_IN is handled by handleAuthComplete, not here
    });

    return () => subscription.unsubscribe();
  }, []);

  // Refresh data when app becomes visible (user returns after being away)
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (!document.hidden && currentUser && appState === 'main') {
        console.log('🔄 App became visible, refreshing data...');
        try {
          // Always try to get fresh session and load full data
          const session = await authService.getSession();
          if (session?.user) {
            console.log('🔄 Refreshing full user data on visibility change');
            setCurrentUser(session.user);
            await loadUserData(session.user);
          } else {
            // If no session, try to refresh with stored data
            const storedSession = localStorage.getItem('ff_user_session');
            const storedEmail = localStorage.getItem('ff_user_email');
            if (storedSession === '1' && storedEmail) {
              console.log('🔄 Refreshing with stored session data');
              const storedUserId = localStorage.getItem('ff_user_id') || 'local-user';
              const user = { email: storedEmail, id: storedUserId };
              setCurrentUser(user);
              await loadUserData(user);
            }
          }
        } catch (error) {
          console.error('💥 Error refreshing data on visibility change:', error);
        }
      }
    };

    const handleFocus = async () => {
      if (currentUser && appState === 'main') {
        console.log('🔄 Window focused, refreshing data...');
        try {
          // Always try to get fresh session and load full data
          const session = await authService.getSession();
          if (session?.user) {
            console.log('🔄 Refreshing full user data on focus');
            setCurrentUser(session.user);
            await loadUserData(session.user);
          } else {
            // If no session, try to refresh with stored data
            const storedSession = localStorage.getItem('ff_user_session');
            const storedEmail = localStorage.getItem('ff_user_email');
            if (storedSession === '1' && storedEmail) {
              console.log('🔄 Refreshing with stored session data on focus');
              const storedUserId = localStorage.getItem('ff_user_id') || 'local-user';
              const user = { email: storedEmail, id: storedUserId };
              setCurrentUser(user);
              await loadUserData(user);
            }
          }
        } catch (error) {
          console.error('💥 Error refreshing data on focus:', error);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [currentUser, appState]);

  // Refresh leaderboard data when leaderboard tab is accessed
  useEffect(() => {
    if (activeTab === 'leaderboard' && appState === 'main') {
      addDebugLog('🏆 Leaderboard tab accessed, refreshing data...');
      refreshLeaderboardData();
    }
  }, [activeTab, appState]);

  const handleOnboardingComplete = async (data: { username: string; readingPlan: string; profilePicture?: string | null }) => {
    try {
      setUserData(prev => ({ ...prev, ...data }));
      
      // Update user profile in database
      if (currentUser) {
        let phone: string | null = null;
        try { phone = localStorage.getItem('ff_signup_phone'); } catch {}
        await userService.upsertUserProfile({
          id: currentUser.id,
          email: currentUser.email,
          username: data.username,
          profile_picture: data.profilePicture,
          reading_plan: data.readingPlan,
          // set start date if not already set
          reading_start_date: (userData as any).readingStartDate || new Date().toISOString().slice(0, 10),
          is_facilitator: false
        });
        try { localStorage.removeItem('ff_signup_phone'); } catch {}
      } else {
        // If no session (unlikely with confirmation OFF), do nothing special
      }
      
      setAppState('main');
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };

  // Removed facilitator toggle function

  const handleSaveJournalEntry = async (entry: any) => {
    console.log('📝 handleSaveJournalEntry called with:', entry);
    
    if (!currentUser) {
      console.error('❌ No current user for journal entry');
      return;
    }
    
    console.log('📝 Current user:', currentUser);
    console.log('📝 User data:', userData);
    
    try {
      console.log('📝 Saving journal entry:', entry);
      console.log('🔍 Share to community:', entry.shareToCommunity);
      console.log('👤 Current user ID:', currentUser.id);
      console.log('👤 Current user email:', currentUser.email);
      
      // Save to database
      addDebugLog('📝 Attempting to save journal entry...');
      addDebugLog('🔍 Skipping connection test, proceeding directly to journal save...');
      
      let savedEntry;
      try {
        console.log('🔍 Attempting database save with data:', {
          user_id: currentUser.id,
          day: entry.day,
          title: entry.title,
          content: entry.content
        });
        
        savedEntry = await journalService.createJournalEntry({
        user_id: currentUser.id,
        day: entry.day,
        title: entry.title,
        content: entry.content,
        insight: entry.insight,
        attention: entry.attention,
        commitment: entry.commitment,
        task: entry.task,
        system: entry.system,
          prayer: entry.prayer,
          shareToCommunity: entry.shareToCommunity,
          username: userData.username,
          avatar: userData.profilePicture
        });
        
        console.log('✅ Journal entry saved to database:', savedEntry);
        addDebugLog('✅ Journal entry saved to database successfully');
        addDebugLog(`✅ Entry ID: ${savedEntry.id}`);
      } catch (dbError) {
        console.error('💥 Database save failed with detailed error:', dbError);
        addDebugLog(`💥 Database save failed: ${dbError.message}`);
        addDebugLog(`💥 Error code: ${dbError.code || 'unknown'}`);
        addDebugLog(`💥 Error details: ${JSON.stringify(dbError)}`);
        
        // Create a local entry with timestamp
        savedEntry = {
          id: `local-${Date.now()}`,
          user_id: currentUser.id,
          day: entry.day,
          title: entry.title,
          content: entry.content,
          insight: entry.insight,
          attention: entry.attention,
          commitment: entry.commitment,
          task: entry.task,
          system: entry.system,
          prayer: entry.prayer,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          is_local_only: true
        };
        
        addDebugLog('💥 Created local fallback entry');
      }
      
      // Update local state
      setJournalEntries(prev => [savedEntry, ...prev]);
      console.log('📝 Journal entries updated in local state');
      
      // Community post is now handled by the API endpoint
      console.log('🔍 Community post creation handled by API endpoint');
      // Create community post if sharing
      console.log('🔍 Checking if should share to community:', entry.shareToCommunity);
      if (entry.shareToCommunity) {
        console.log('🌐 Creating community post for journal entry...');
        console.log('🌐 Community post data:', {
          user_id: currentUser.id,
          username: userData.username,
          avatar: userData.profilePicture,
          day: entry.day,
          content: entry.content,
          post_type: 'insight',
          insight: entry.insight,
          attention: entry.attention,
          commitment: entry.commitment,
          task: entry.task,
          system: entry.system,
          prayer: entry.prayer
        });
        console.log('🌐 User data available:', {
          username: userData.username,
          profilePicture: userData.profilePicture
        });
        
        try {
          const communityPost = await communityService.createCommunityPost({
            user_id: currentUser.id,
            username: userData.username,
            avatar: userData.profilePicture,
            day: entry.day,
            content: entry.content,
            post_type: 'insight',
            insight: entry.insight,
            attention: entry.attention,
            commitment: entry.commitment,
            task: entry.task,
            system: entry.system,
            prayer: entry.prayer
          });
          
          console.log('✅ Community post created successfully:', communityPost);
          addDebugLog('✅ Community post created and shared successfully');
          
          // Add to local state immediately with type mapping
          const mappedPost = {
            ...communityPost,
            type: communityPost.post_type, // Map post_type to type
            is_facilitator: false // Default for new posts
          };
          console.log('📋 Mapped post to add:', mappedPost);
          setCommunityEntries(prev => {
            const updated = [mappedPost, ...prev];
            console.log('📋 Updated community entries:', updated);
            return updated;
          });
          console.log('📋 Community entries updated with mapped post');
        } catch (communityError) {
          console.error('💥 Failed to create community post:', communityError);
          addDebugLog('💥 Community post creation failed, journal entry saved locally only');
          // Don't throw here, let the journal entry still be saved
        }
      } else {
        console.log('❌ Not sharing to community');
      }
    } catch (error) {
    console.error('💥 Error saving journal entry:', error);
    
    // Add fallback journal entry to local state
    console.log('🔄 Adding journal entry as fallback...');
    const fallbackJournalEntry = {
      id: `temp-${Date.now()}`,
      user_id: currentUser.id,
      day: entry.day,
      title: entry.title,
      content: entry.content,
      insight: entry.insight,
      attention: entry.attention,
      commitment: entry.commitment,
      task: entry.task,
      system: entry.system,
      prayer: entry.prayer,
      created_at: new Date().toISOString()
    };
    setJournalEntries(prev => [fallbackJournalEntry, ...prev]);
    console.log('✅ Journal entry added to local state as fallback');
    
    // If community post creation failed, add fallback
    if (entry.shareToCommunity) {
      console.log('🔄 Adding community post as fallback...');
      const fallbackPost = {
        id: `temp-${Date.now()}`,
        user_id: currentUser.id,
        username: userData.username,
        avatar: userData.profilePicture,
        day: entry.day,
        content: entry.content,
        post_type: 'insight',
        type: 'insight',
        insight: entry.insight,
        attention: entry.attention,
        commitment: entry.commitment,
        task: entry.task,
        system: entry.system,
        prayer: entry.prayer,
        created_at: new Date().toISOString(),
        is_facilitator: false,
        likes: 0,
        likedBy: [],
        comments: [],
        isTemporary: true // Mark as temporary for UI indication
      };
      setCommunityEntries(prev => [fallbackPost, ...prev]);
      console.log('✅ Journal entry added to community as fallback');
      console.log('⚠️ WARNING: This is a temporary post that will only be visible to you until the database connection is restored.');
    }
    }
  };

  const handleAddComment = async (entryId: string, comment: string) => {
    console.log('💬 handleAddComment called with:', { entryId, comment });
    
    if (!currentUser) {
      console.error('❌ No current user for comment');
      return;
    }
    
    console.log('💬 Current user:', currentUser);
    console.log('💬 User data:', userData);
    
    // Check if this is a temporary post (fallback post)
    if (entryId.startsWith('temp-')) {
      console.log('🔄 This is a temporary post, adding comment to local state only');
      const newComment = {
        id: `comment-${Date.now()}`,
        username: userData.username,
        avatar: userData.profilePicture || '',
        content: comment,
        date: new Date().toISOString()
      };
      
      setCommunityEntries(prev => prev.map(entry => {
        if (entry.id === entryId) {
          return {
            ...entry,
            comments: [...(entry.comments || []), newComment]
          };
        }
        return entry;
      }));
      console.log('✅ Comment added to local state for temporary post');
      return;
    }
    
    try {
      console.log('💬 Adding comment to database...');
      const result = await communityService.addComment(
        entryId,
        currentUser.id,
        userData.username,
        userData.profilePicture || '',
        comment
      );
      console.log('✅ Comment added successfully:', result);
      
      // Update local state to reflect the new comment
      const newComment = {
        id: result.id,
        username: userData.username,
        avatar: userData.profilePicture || '',
        content: comment,
        date: result.created_at
      };
      
      setCommunityEntries(prev => prev.map(entry => {
        if (entry.id === entryId) {
          return {
            ...entry,
            comments: [...(entry.comments || []), newComment]
          };
        }
        return entry;
      }));
    } catch (error) {
      console.error('💥 Error adding comment:', error);
    }
  };

  const handleLikeEntry = async (entryId: string) => {
    console.log('❤️ handleLikeEntry called with entryId:', entryId);
    
    if (!currentUser) {
      console.error('❌ No current user for like');
      return;
    }
    
    console.log('❤️ Current user:', currentUser);
    
    // Check if this is a temporary post (fallback post)
    if (entryId.startsWith('temp-')) {
      console.log('🔄 This is a temporary post, updating local state only');
      setCommunityEntries(prev => prev.map(entry => {
        if (entry.id === entryId) {
          const isLiked = entry.likedBy?.includes(currentUser.id) || false;
          const newLikedBy = isLiked 
            ? entry.likedBy?.filter(id => id !== currentUser.id) || []
            : [...(entry.likedBy || []), currentUser.id];
          
          return {
            ...entry,
            likedBy: newLikedBy,
            likes: newLikedBy.length
          };
        }
        return entry;
      }));
      console.log('✅ Like toggled in local state for temporary post');
      return;
    }
    
    try {
      console.log('❤️ Toggling like in database...');
      const result = await communityService.togglePostLike(entryId, currentUser.id);
      console.log('✅ Like toggled successfully:', result);
      
      // Update local state to reflect the change
      setCommunityEntries(prev => prev.map(entry => {
        if (entry.id === entryId) {
          const isLiked = entry.likedBy?.includes(currentUser.id) || false;
          const newLikedBy = result.liked 
            ? [...(entry.likedBy || []), currentUser.id]
            : entry.likedBy?.filter(id => id !== currentUser.id) || [];
          
          return {
            ...entry,
            likedBy: newLikedBy,
            likes: newLikedBy.length
          };
        }
        return entry;
      }));
    } catch (error) {
      console.error('💥 Error toggling like:', error);
    }
  };

  const handleAddPrayerRequest = async (prayerRequest: { title: string; content: string; isAnonymous: boolean }) => {
    console.log('🙏 handleAddPrayerRequest called with:', prayerRequest);
    
    if (!currentUser) {
      console.error('❌ No current user for prayer request');
      return;
    }
    
    console.log('🙏 Current user:', currentUser);
    console.log('🙏 User data:', userData);
    
    try {
      console.log('🙏 Creating prayer request...');
      console.log('🙏 Prayer request data:', prayerRequest);
      console.log('🙏 User data:', {
        id: currentUser.id,
        username: userData.username,
        profilePicture: userData.profilePicture
      });
      const communityPost = await communityService.createCommunityPost({
        user_id: currentUser.id,
        username: prayerRequest.isAnonymous ? 'Anonymous' : userData.username,
        avatar: prayerRequest.isAnonymous ? null : userData.profilePicture,
        day: 1, // Use 1 instead of 0 for prayer requests
        content: `${prayerRequest.title}\n\n${prayerRequest.content}`,
        post_type: 'prayer'
      });
      
      // Add to local state immediately
      const mappedPost = {
        ...communityPost,
        type: communityPost.post_type,
        is_facilitator: false
      };
      setCommunityEntries(prev => [mappedPost, ...prev]);
      console.log('✅ Prayer request added to local state');
    } catch (error) {
      console.error('💥 Error adding prayer request:', error);
      // Fallback: add to local state even if database fails
      const fallbackPost = {
        id: `temp-${Date.now()}`,
        user_id: currentUser.id,
        username: prayerRequest.isAnonymous ? 'Anonymous' : userData.username,
        avatar: prayerRequest.isAnonymous ? null : userData.profilePicture,
        day: 1,
        content: `${prayerRequest.title}\n\n${prayerRequest.content}`,
        post_type: 'prayer',
        type: 'prayer',
        created_at: new Date().toISOString(),
        is_facilitator: false,
        likes: 0,
        likedBy: [],
        comments: []
      };
      setCommunityEntries(prev => [fallbackPost, ...prev]);
      console.log('✅ Prayer request added as fallback');
    }
  };

  const handleAddTestimony = async (testimony: { title: string; content: string; isAnonymous: boolean }) => {
    console.log('✨ handleAddTestimony called with:', testimony);
    
    if (!currentUser) {
      console.error('❌ No current user for testimony');
      return;
    }
    
    console.log('✨ Current user:', currentUser);
    console.log('✨ User data:', userData);
    
    try {
      console.log('✨ Creating testimony...');
      console.log('✨ Testimony data:', testimony);
      console.log('✨ User data:', {
        id: currentUser.id,
        username: userData.username,
        profilePicture: userData.profilePicture
      });
      const communityPost = await communityService.createCommunityPost({
        user_id: currentUser.id,
        username: testimony.isAnonymous ? 'Anonymous' : userData.username,
        avatar: testimony.isAnonymous ? null : userData.profilePicture,
        day: 1, // Use 1 instead of 0 for testimonies
        content: `${testimony.title}\n\n${testimony.content}`,
        post_type: 'testimony'
      });
      
      // Add to local state immediately
      const mappedPost = {
        ...communityPost,
        type: communityPost.post_type,
        is_facilitator: false
      };
      setCommunityEntries(prev => [mappedPost, ...prev]);
      console.log('✅ Testimony added to local state');
    } catch (error) {
      console.error('💥 Error adding testimony:', error);
      // Fallback: add to local state even if database fails
      const fallbackPost = {
        id: `temp-${Date.now()}`,
        user_id: currentUser.id,
        username: testimony.isAnonymous ? 'Anonymous' : userData.username,
        avatar: testimony.isAnonymous ? null : userData.profilePicture,
        day: 1,
        content: `${testimony.title}\n\n${testimony.content}`,
        post_type: 'testimony',
        type: 'testimony',
        created_at: new Date().toISOString(),
        is_facilitator: false,
        likes: 0,
        likedBy: [],
        comments: []
      };
      setCommunityEntries(prev => [fallbackPost, ...prev]);
      console.log('✅ Testimony added as fallback');
    }
  };

  if (appState === 'splash') {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  if (appState === 'auth') {
    return <AuthScreen onAuthComplete={handleAuthComplete} />;
  }

  // Facilitator login removed; use normal auth screen

  if (appState === 'onboarding') {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />;
  }


  const renderActiveTab = () => {
        switch (activeTab) {
          case 'home':
            {
              const currentDay = (() => {
                if (!userData.readingStartDate) return 1;
                const start = new Date(userData.readingStartDate);
                const today = new Date();
                const msPerDay = 24 * 60 * 60 * 1000;
                const diff = Math.floor((today.setHours(0,0,0,0) as any - start.setHours(0,0,0,0) as any) / msPerDay);
                return Math.max(1, diff + 1);
              })();
            return (
              <HomePage
                streaks={userData.streaks}
                totalVisits={userData.totalVisits}
                readingPlan={userData.readingPlan}
                  currentDay={currentDay}
              />
            );
            }
          case 'journal':
            {
              const currentDay = (() => {
                if (!userData.readingStartDate) return 1;
                const start = new Date(userData.readingStartDate);
                const today = new Date();
                const msPerDay = 24 * 60 * 60 * 1000;
                const diff = Math.floor((today.setHours(0,0,0,0) as any - start.setHours(0,0,0,0) as any) / msPerDay);
                return Math.max(1, diff + 1);
              })();
            return (
              <JournalPage
                  currentDay={currentDay}
                onSaveEntry={handleSaveJournalEntry}
              />
            );
            }
          case 'leaderboard':
            return <LeaderboardPage users={leaderboardUsers} onRefresh={refreshLeaderboardData} />;
          case 'community':
            return (
              <CommunityPage
                entries={communityEntries}
                onAddComment={handleAddComment}
                onLikeEntry={handleLikeEntry}
                onAddPrayerRequest={handleAddPrayerRequest}
                onAddTestimony={handleAddTestimony}
                currentUserId={currentUser?.id || 'local-user'}
                currentUserProfilePicture={userData.profilePicture || ''}
                debugInfo={debugInfo}
                showDebug={showDebug}
                onToggleDebug={() => setShowDebug(!showDebug)}
              />
            );
          case 'announce':
            return (
              <div className="p-4 pb-28 max-w-xl mx-auto">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Announcements</h2>
                <p className="text-gray-600">Announcement feature removed for now.</p>
              </div>
            );
          default:
            {
              const currentDay = (() => {
                if (!userData.readingStartDate) return 1;
                const start = new Date(userData.readingStartDate);
                const today = new Date();
                const msPerDay = 24 * 60 * 60 * 1000;
                const diff = Math.floor((today.setHours(0,0,0,0) as any - start.setHours(0,0,0,0) as any) / msPerDay);
                return Math.max(1, diff + 1);
              })();
              return <HomePage streaks={userData.streaks} totalVisits={userData.totalVisits} readingPlan={userData.readingPlan} currentDay={currentDay} />;
            }
        }
      };

  return (
    <div className={`min-h-screen h-screen overflow-hidden ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <div className="flex flex-col h-full">
        <TopHeader 
          username={userData.username}
          profilePicture={userData.profilePicture}
          onProfileClick={() => setShowProfileModal(true)}
          isDarkMode={isDarkMode}
          onThemeToggle={() => setIsDarkMode(!isDarkMode)}
        />
        
        <div className="flex-1 overflow-y-auto">
          {renderActiveTab()}
        </div>
        
        <BottomNavigation 
          activeTab={activeTab}
          onTabChange={setActiveTab}
          showAnnouncements={false}
        />
      </div>

      <ProfileModal 
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        username={userData.username}
        readingPlan={userData.readingPlan}
        profilePicture={userData.profilePicture}
        onUpdateReadingPlan={(plan) => setUserData(prev => ({ ...prev, readingPlan: plan }))}
        onUpdateProfilePicture={(picture) => setUserData(prev => ({ ...prev, profilePicture: picture }))}
        isDarkMode={isDarkMode}
        onThemeToggle={() => setIsDarkMode(!isDarkMode)}
        isFacilitator={false}
        onToggleFacilitator={() => {}}
        journalEntries={journalEntries.length}
        communityPosts={communityEntries.filter(entry => entry.username === userData.username).length}
        totalLikes={communityEntries.reduce((total, entry) => total + entry.likes, 0)}
        currentStreak={userData.streaks}
        totalVisits={userData.totalVisits}
      />
    </div>
  );
};

export default AppLayout;