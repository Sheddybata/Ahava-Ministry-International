import React, { useState, useRef, useEffect } from 'react';
import { authService } from '@/services/database';

interface TopHeaderProps {
  username: string;
  profilePicture?: string | null;
  onProfileClick: () => void;
  isDarkMode: boolean;
  onThemeToggle: () => void;
}

const TopHeader: React.FC<TopHeaderProps> = ({ username, profilePicture, onProfileClick, isDarkMode, onThemeToggle }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notifCount, setNotifCount] = useState<number>(() => {
    try { return parseInt(localStorage.getItem('ff_notif_count') || '0', 10) || 0; } catch { return 0; }
  });
  const menuRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.data && event.data.type === 'NEW_NOTIFICATION') {
        setNotifCount((prev) => {
          const next = prev + 1;
          try { localStorage.setItem('ff_notif_count', String(next)); } catch {}
          return next;
        });
      }
    }
    navigator.serviceWorker?.addEventListener?.('message', onMessage as any);
    return () => navigator.serviceWorker?.removeEventListener?.('message', onMessage as any);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    }

    if (showProfileMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileMenu]);

  return (
    <div className="relative z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 px-4 py-4 flex items-center justify-between safe-area-top safe-area-left safe-area-right flex-shrink-0">
      <div className="flex-1 min-w-0 ml-2">
        <h1 className="text-xl sm:text-2xl font-bold text-red-800 truncate">FaithFlow</h1>
        <p className="text-sm sm:text-base text-gray-600 truncate">Welcome back, {username}</p>
      </div>
      
      <div className="relative mr-2 flex items-center space-x-3" ref={menuRef}>
        <button
          onClick={() => {
            alert(notifCount > 0 ? `${notifCount} new notification(s)` : 'No new notifications');
            setNotifCount(0);
            try { localStorage.setItem('ff_notif_count', '0'); } catch {}
          }}
          aria-label="Notifications"
          className="w-11 h-11 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          <span className="text-xl relative">
            🔔
            {notifCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-red-600 text-white text-[10px] leading-none rounded-full px-1.5 py-0.5 min-w-[16px] text-center">
                {notifCount}
              </span>
            )}
          </span>
        </button>
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
          <div className="absolute right-0 top-14 bg-white border border-gray-200 rounded-lg shadow-lg py-3 w-52 z-[9999]">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onProfileClick();
                setShowProfileMenu(false);
              }}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 text-base cursor-pointer"
            >
              <span className="text-lg">⚙️</span>
              <span>Profile Settings</span>
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onThemeToggle();
                setShowProfileMenu(false);
              }}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 text-base cursor-pointer"
            >
              <span className="text-lg">{isDarkMode ? '☀️' : '🌙'}</span>
              <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
            <button
              onClick={async (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('🚪 Logout button clicked');
                try {
                  await authService.signOut();
                  localStorage.removeItem('ff_user_session');
                  localStorage.removeItem('ff_is_facilitator');
                  window.location.reload();
                } catch (error) {
                  console.error('Error signing out:', error);
                  // Fallback to local logout
                  localStorage.removeItem('ff_user_session');
                  localStorage.removeItem('ff_is_facilitator');
                  window.location.reload();
                }
              }}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 text-base text-red-700 cursor-pointer"
            >
              <span className="text-lg">🚪</span>
              <span>Log out</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopHeader;