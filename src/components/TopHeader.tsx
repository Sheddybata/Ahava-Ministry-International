import React, { useState } from 'react';

interface TopHeaderProps {
  username: string;
  profilePicture?: string | null;
  onProfileClick: () => void;
  isDarkMode: boolean;
  onThemeToggle: () => void;
}

const TopHeader: React.FC<TopHeaderProps> = ({ username, profilePicture, onProfileClick, isDarkMode, onThemeToggle }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <div className="bg-white/95 backdrop-blur-md border-b border-gray-200 px-4 py-4 flex items-center justify-between safe-area-top safe-area-left safe-area-right">
      <div>
        <h1 className="text-2xl font-bold text-red-800">FaithFlow</h1>
        <p className="text-base text-gray-600">Welcome back, {username}</p>
      </div>
      
      <div className="relative">
        <button
          onClick={() => setShowProfileMenu(!showProfileMenu)}
          className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center overflow-hidden hover:bg-red-200 transition-colors"
        >
          {profilePicture ? (
            <img 
              src={profilePicture} 
              alt="Profile" 
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-2xl text-gray-400">👤</span>
            </div>
          )}
        </button>
        
        {showProfileMenu && (
          <div className="absolute right-0 top-14 bg-white border border-gray-200 rounded-lg shadow-lg py-3 w-52 z-50">
            <button
              onClick={() => {
                onProfileClick();
                setShowProfileMenu(false);
              }}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 text-base"
            >
              <span className="text-lg">⚙️</span>
              <span>Profile Settings</span>
            </button>
            <button
              onClick={() => {
                onThemeToggle();
                setShowProfileMenu(false);
              }}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 text-base"
            >
              <span className="text-lg">{isDarkMode ? '☀️' : '🌙'}</span>
              <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopHeader;