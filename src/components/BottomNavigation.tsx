import React from 'react';

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  showAnnouncements?: boolean;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeTab, onTabChange, showAnnouncements }) => {
  const tabs = [
    { id: 'home', label: 'Home', icon: '🏠', activeIcon: '🏠' },
    { id: 'journal', label: 'Journal', icon: '📖', activeIcon: '📖' },
    { id: 'leaderboard', label: 'Leaderboard', icon: '🏆', activeIcon: '🏆' },
    { id: 'community', label: 'Community', icon: '👥', activeIcon: '👥' },
    ...(showAnnouncements ? [{ id: 'announce', label: 'Announce', icon: '📣', activeIcon: '📣' }] : [])
  ];

  return (
    <div className="bg-white/95 backdrop-blur-md border-t border-gray-200 px-4 py-2 safe-area-bottom safe-area-left safe-area-right flex-shrink-0">
      <div className="flex justify-around">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center py-3 px-4 rounded-lg transition-all duration-200 mobile-touch-target touch-manipulation ${
              activeTab === tab.id 
                ? 'text-red-800 bg-red-50 scale-105' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <span className="text-xl mb-1">
              {activeTab === tab.id ? tab.activeIcon : tab.icon}
            </span>
            <span className="text-xs font-medium">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BottomNavigation;