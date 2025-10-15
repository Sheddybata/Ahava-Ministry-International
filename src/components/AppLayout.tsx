import React, { useState, useEffect } from 'react';
import SplashScreen from './SplashScreen';
import AuthScreen from './AuthScreen';
// import FacilitatorLogin from './FacilitatorLogin';
import OnboardingScreen from './OnboardingScreen';
import TopHeader from './TopHeader';
import BottomNavigation from './BottomNavigation';
import HomePage from './HomePage';
import AnnouncementForm from './AnnouncementForm';
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
  authService
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
  const [isFacilitator, setIsFacilitator] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  const [leaderboardUsers, setLeaderboardUsers] = useState<any[]>([]);

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

  const handleAuthComplete = async (isNewUser?: boolean) => {
    try {
      // Do not override facilitator flag here; profile creation handled in loadUserData
      // Persist user session (optional local hint only)
      
      // Persist user session
      try { localStorage.setItem('ff_user_session', '1'); } catch {}
      
      if (isNewUser) {
        // New users go through onboarding
        setAppState('onboarding');
      } else {
        // Existing users go directly to main app
        setAppState('main');
      }
    } catch (error) {
      console.error('Error completing auth:', error);
    }
  };

  // Initialize app with real-time data
  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Check for existing session
      const session = await authService.getSession();
      
      if (session?.user) {
        await loadUserData(session.user);
        setAppState('main');
      } else {
        setAppState('auth');
      }
    } catch (error) {
      console.error('Error initializing app:', error);
      setAppState('auth');
    } finally {
      setLoading(false);
    }
  };

  const loadUserData = async (user: any) => {
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
        setIsFacilitator(makeFacilitator);
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
      setIsFacilitator(profile.is_facilitator);

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
          setIsFacilitator(true);
        } catch (e) {
          console.error('Failed to auto-elevate facilitator:', e);
        }
      }

      const journalData = await journalService.getUserJournalEntries(user.id);
      setJournalEntries(journalData);

      const communityData = await communityService.getCommunityPosts();
      const mappedCommunity = (communityData || []).map((row: any) => ({
        ...row,
        is_facilitator: row?.users?.is_facilitator ?? false,
      }));
      setCommunityEntries(mappedCommunity);

      setupRealtimeSubscriptions();
      
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const setupRealtimeSubscriptions = () => {
    // Subscribe to community posts changes
    realtimeService.subscribeToCommunityPosts((payload) => {
      if (payload.eventType === 'INSERT') {
        setCommunityEntries(prev => [payload.new, ...prev]);
      } else if (payload.eventType === 'UPDATE') {
        setCommunityEntries(prev => 
          prev.map(entry => entry.id === payload.new.id ? payload.new : entry)
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
      if (event === 'SIGNED_IN' && session?.user) {
        await loadUserData(session.user);
        setAppState('main');
      } else if (event === 'SIGNED_OUT') {
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
        setIsFacilitator(false);
        setAppState('auth');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

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
          is_facilitator: isFacilitator
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

  const handleToggleFacilitator = (value: boolean) => {
    setIsFacilitator(value);
    try {
      localStorage.setItem('ff_is_facilitator', value ? '1' : '0');
    } catch {}
  };

  const handleSaveJournalEntry = async (entry: any) => {
    if (!currentUser) return;
    
    try {
      // Save to database
      const savedEntry = await journalService.createJournalEntry({
        user_id: currentUser.id,
        day: entry.day,
        title: entry.title,
        content: entry.content,
        insight: entry.insight,
        attention: entry.attention,
        commitment: entry.commitment,
        task: entry.task,
        system: entry.system,
        prayer: entry.prayer
      });
      
      // Update local state
      setJournalEntries(prev => [savedEntry, ...prev]);
      
      // Create community post if sharing
      if (entry.shareToCommunity) {
        await communityService.createCommunityPost({
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
      }
    } catch (error) {
      console.error('Error saving journal entry:', error);
    }
  };

  const handleAddComment = async (entryId: string, comment: string) => {
    if (!currentUser) return;
    
    try {
      await communityService.addComment(
        entryId,
        currentUser.id,
        userData.username,
        userData.profilePicture || '',
        comment
      );
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleLikeEntry = async (entryId: string) => {
    if (!currentUser) return;
    
    try {
      await communityService.togglePostLike(entryId, currentUser.id);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleAddPrayerRequest = async (prayerRequest: { title: string; content: string; isAnonymous: boolean }) => {
    if (!currentUser) return;
    
    try {
      await communityService.createCommunityPost({
        user_id: currentUser.id,
        username: prayerRequest.isAnonymous ? 'Anonymous' : userData.username,
        avatar: prayerRequest.isAnonymous ? null : userData.profilePicture,
        day: 0,
        content: `${prayerRequest.title}\n\n${prayerRequest.content}`,
        post_type: 'prayer'
      });
    } catch (error) {
      console.error('Error adding prayer request:', error);
    }
  };

  const handleAddTestimony = async (testimony: { title: string; content: string; isAnonymous: boolean }) => {
    if (!currentUser) return;
    
    try {
      await communityService.createCommunityPost({
        user_id: currentUser.id,
        username: testimony.isAnonymous ? 'Anonymous' : userData.username,
        avatar: testimony.isAnonymous ? null : userData.profilePicture,
        day: 0,
        content: `${testimony.title}\n\n${testimony.content}`,
        post_type: 'testimony'
      });
    } catch (error) {
      console.error('Error adding testimony:', error);
    }
  };

  if (appState === 'splash') {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  if (appState === 'auth') {
    return <AuthScreen onAuthComplete={handleAuthComplete} onFacilitatorLogin={() => setAppState('auth')} />;
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
            return <LeaderboardPage users={leaderboardUsers} />;
          case 'community':
            return (
              <CommunityPage
                entries={communityEntries}
                onAddComment={handleAddComment}
                onLikeEntry={handleLikeEntry}
                onAddPrayerRequest={handleAddPrayerRequest}
                onAddTestimony={handleAddTestimony}
                currentUserId="current-user"
              />
            );
          case 'announce':
            return (
              <div className="p-4 pb-28 max-w-xl mx-auto">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">New Announcement</h2>
                <AnnouncementForm />
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
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <TopHeader 
        username={userData.username}
        profilePicture={userData.profilePicture}
        onProfileClick={() => setShowProfileModal(true)}
        isDarkMode={isDarkMode}
        onThemeToggle={() => setIsDarkMode(!isDarkMode)}
      />
      
      {renderActiveTab()}
      
      <BottomNavigation 
        activeTab={activeTab}
        onTabChange={setActiveTab}
        showAnnouncements={isFacilitator}
      />

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
        isFacilitator={isFacilitator}
        onToggleFacilitator={handleToggleFacilitator}
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