import React, { useState, useEffect } from 'react';
import SplashScreen from './SplashScreen';
import AuthScreen from './AuthScreen';
import FacilitatorLogin from './FacilitatorLogin';
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
  const [appState, setAppState] = useState<'splash' | 'auth' | 'facilitator-login' | 'onboarding' | 'main'>('splash');
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

  // Mock leaderboard data
  const leaderboardUsers = [
    {
      id: '1',
      username: 'Ella M.',
      avatar: '/ella profile picture (1).png',
      streaks: 45,
      entries: 42,
      position: 1
    },
    {
      id: '2',
      username: 'Elbuba K.',
      avatar: '/El bub profile.png',
      streaks: 38,
      entries: 35,
      position: 2
    },
    {
      id: '3',
      username: 'James Bata',
      avatar: '/James Bata profile.jpg',
      streaks: 32,
      entries: 30,
      position: 3
    },
    {
      id: '4',
      username: 'Ahava Ministry',
      avatar: '/Ahava Logo.png',
      streaks: 28,
      entries: 25,
      position: 4
    },
    {
      id: '5',
      username: 'FaithFlow Team',
      avatar: '/FaithFlow logo.jpg',
      streaks: 24,
      entries: 22,
      position: 5
    }
  ];

  useEffect(() => {
    // Simulate user visits tracking
    if (appState === 'main') {
      setUserData(prev => ({ ...prev, totalVisits: prev.totalVisits + 1, streaks: 15 }));
    }
  }, [appState]);

  const handleSplashComplete = () => {
    // After splash, decide where to go based on persisted session
    const hasSession = (() => {
      try { return localStorage.getItem('ff_user_session') === '1'; } catch { return false; }
    })();
    setAppState(hasSession ? 'main' : 'auth');
  };

  const handleAuthComplete = async (isNewUser?: boolean) => {
    try {
      // Ensure regular user sessions never have facilitator privileges
      setIsFacilitator(false);
      try { localStorage.setItem('ff_is_facilitator', '0'); } catch {}
      
      // Create user profile in database
      if (currentUser) {
        await userService.upsertUserProfile({
          id: currentUser.id,
          email: currentUser.email,
          username: userData.username,
          profile_picture: userData.profilePicture,
          reading_plan: userData.readingPlan,
          is_facilitator: false
        });
      }
      
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
        // Check for local session
        const hasLocalSession = localStorage.getItem('ff_user_session') === '1';
        if (hasLocalSession) {
          setAppState('main');
        } else {
          setAppState('auth');
        }
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
        await userService.upsertUserProfile({
          id: user.id,
          email: user.email,
          username: fallbackUsername,
          reading_plan: '40-days',
          reading_start_date: today,
          is_facilitator: false
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
        setIsFacilitator(false);
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
        await userService.upsertUserProfile({
          id: currentUser.id,
          email: currentUser.email,
          username: data.username,
          profile_picture: data.profilePicture,
          reading_plan: data.readingPlan,
          is_facilitator: isFacilitator
        });
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
    return <AuthScreen onAuthComplete={handleAuthComplete} onFacilitatorLogin={() => setAppState('facilitator-login')} />;
  }

  if (appState === 'facilitator-login') {
    return (
      <FacilitatorLogin 
        onLoginSuccess={(isNewFacilitator) => {
          setIsFacilitator(true);
          try { localStorage.setItem('ff_is_facilitator', '1'); } catch {}
          try { localStorage.setItem('ff_user_session', '1'); } catch {}
          if (isNewFacilitator) {
            setAppState('onboarding');
          } else {
            setAppState('main');
          }
        }} 
        onBack={() => {
          // Leaving facilitator flow: drop facilitator privileges
          setIsFacilitator(false);
          try { localStorage.setItem('ff_is_facilitator', '0'); } catch {}
          setAppState('auth');
        }} 
      />
    );
  }

  if (appState === 'onboarding') {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />;
  }


  const renderActiveTab = () => {
        switch (activeTab) {
          case 'home':
            return (
              <HomePage
                streaks={userData.streaks}
                totalVisits={userData.totalVisits}
                readingPlan={userData.readingPlan}
              />
            );
          case 'journal':
            return (
              <JournalPage
                currentDay={15}
                onSaveEntry={handleSaveJournalEntry}
              />
            );
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
            return <HomePage streaks={userData.streaks} totalVisits={userData.totalVisits} readingPlan={userData.readingPlan} />;
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