import React, { useState, useEffect } from 'react';
import SplashScreen from './SplashScreen';
import AuthScreen from './AuthScreen';
import OnboardingScreen from './OnboardingScreen';
import TopHeader from './TopHeader';
import BottomNavigation from './BottomNavigation';
import HomePage from './HomePage';
import JournalPage from './JournalPage';
import LeaderboardPage from './LeaderboardPage';
import CommunityPage from './CommunityPage';
import ProfileModal from './ProfileModal';

const AppLayout: React.FC = () => {
  const [appState, setAppState] = useState<'splash' | 'auth' | 'onboarding' | 'main'>('splash');
  const [activeTab, setActiveTab] = useState('home');
  const [userData, setUserData] = useState({
    username: '',
    readingPlan: '',
    profilePicture: null as string | null,
    streaks: 0,
    totalVisits: 0
  });
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [journalEntries, setJournalEntries] = useState<any[]>([]);
  const [communityEntries, setCommunityEntries] = useState<any[]>([]);

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
    setAppState('auth');
  };

  const handleAuthComplete = () => {
    setAppState('onboarding');
  };

  const handleOnboardingComplete = (data: { username: string; readingPlan: string; profilePicture?: string | null }) => {
    setUserData(prev => ({ ...prev, ...data }));
    setAppState('main');
  };

  const handleSaveJournalEntry = (entry: any) => {
    setJournalEntries(prev => [...prev, entry]);
    
    // Add to community entries with all journal fields
    const communityEntry = {
      id: entry.id,
      username: userData.username,
      avatar: 'https://d64gsuwffb70l.cloudfront.net/68d665f993df5d926ecdf2eb_1758881326684_87206609.webp',
      day: entry.day,
      date: entry.date,
      content: entry.insight + ' ' + entry.prayer, // Keep for backward compatibility
      type: 'insight' as const,
      likes: 0,
      comments: [],
      // Include all journal fields
      insight: entry.insight,
      attention: entry.attention,
      commitment: entry.commitment,
      task: entry.task,
      system: entry.system,
      prayer: entry.prayer
    };
    setCommunityEntries(prev => [...prev, communityEntry]);
  };

  const handleAddComment = (entryId: string, comment: string) => {
    setCommunityEntries(prev => 
      prev.map(entry => 
        entry.id === entryId 
          ? {
              ...entry,
              comments: [
                ...entry.comments,
                {
                  id: Date.now().toString(),
                  username: userData.username,
                  avatar: 'https://d64gsuwffb70l.cloudfront.net/68d665f993df5d926ecdf2eb_1758881326684_87206609.webp',
                  content: comment,
                  date: new Date().toISOString()
                }
              ]
            }
          : entry
      )
    );
  };

  const handleLikeEntry = (entryId: string) => {
    setCommunityEntries(prev => 
      prev.map(entry => 
        entry.id === entryId 
          ? { ...entry, likes: entry.likes + 1 }
          : entry
      )
    );
  };

  const handleAddPrayerRequest = (prayerRequest: { title: string; content: string; isAnonymous: boolean }) => {
    const newEntry = {
      id: Date.now().toString(),
      username: prayerRequest.isAnonymous ? 'Anonymous' : userData.username,
      avatar: prayerRequest.isAnonymous ? 'https://d64gsuwffb70l.cloudfront.net/68d665f993df5d926ecdf2eb_1758881326684_87206609.webp' : 'https://d64gsuwffb70l.cloudfront.net/68d665f993df5d926ecdf2eb_1758881326684_87206609.webp',
      day: 0,
      date: new Date().toISOString(),
      content: `${prayerRequest.title}\n\n${prayerRequest.content}`,
      type: 'prayer' as const,
      likes: 0,
      comments: []
    };
    setCommunityEntries(prev => [...prev, newEntry]);
  };

  const handleAddTestimony = (testimony: { title: string; content: string; isAnonymous: boolean }) => {
    const newEntry = {
      id: Date.now().toString(),
      username: testimony.isAnonymous ? 'Anonymous' : userData.username,
      avatar: testimony.isAnonymous ? 'https://d64gsuwffb70l.cloudfront.net/68d665f993df5d926ecdf2eb_1758881326684_87206609.webp' : 'https://d64gsuwffb70l.cloudfront.net/68d665f993df5d926ecdf2eb_1758881326684_87206609.webp',
      day: 0,
      date: new Date().toISOString(),
      content: `${testimony.title}\n\n${testimony.content}`,
      type: 'testimony' as const,
      likes: 0,
      comments: []
    };
    setCommunityEntries(prev => [...prev, newEntry]);
  };

  if (appState === 'splash') {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  if (appState === 'auth') {
    return <AuthScreen onAuthComplete={handleAuthComplete} />;
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
              />
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
      />
    </div>
  );
};

export default AppLayout;