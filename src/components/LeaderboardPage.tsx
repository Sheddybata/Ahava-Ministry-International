import React from 'react';

interface LeaderboardUser {
  id: string;
  username: string;
  avatar: string | null;
  streaks: number;
  entries: number;
  position: number;
}

interface LeaderboardPageProps {
  users: LeaderboardUser[];
  onRefresh?: () => void;
}

const LeaderboardPage: React.FC<LeaderboardPageProps> = ({ users, onRefresh }) => {
  const getTrophyIcon = (position: number) => {
    switch (position) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `#${position}`;
    }
  };

  const getTrophyColor = (position: number) => {
    switch (position) {
      case 1: return 'text-yellow-500';
      case 2: return 'text-gray-400';
      case 3: return 'text-amber-600';
      default: return 'text-gray-600';
    }
  };

  // Handle empty state
  if (users.length === 0) {
    return (
      <div className="p-4 pb-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Leaderboard</h1>
          <p className="text-gray-600">Top performers in our faith community</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
          <div className="text-6xl mb-4">🏆</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Data Yet</h3>
          <p className="text-gray-600">Start journaling and building streaks to see the leaderboard!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 pb-4">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-2xl font-bold text-gray-800">Leaderboard</h1>
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="px-3 py-1 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              🔄 Refresh
            </button>
          )}
        </div>
        <p className="text-gray-600">Top performers in our faith community</p>
      </div>

      {/* Top 3 Podium */}
      <div className="bg-gradient-to-r from-red-800 to-yellow-600 rounded-2xl p-6 mb-6">
        <div className="flex justify-center items-end space-x-4">
          {users.slice(0, 3).map((user, index) => {
            // Display users in order: 1st, 2nd, 3rd (left to right)
            const actualUser = users[index];
            // Heights: 1st place tallest, 2nd place medium, 3rd place shortest
            const heights = ['h-28', 'h-22', 'h-18'];
            
            return (
              <div key={actualUser.id} className="text-center">
                {actualUser.avatar ? (
                  <img 
                    src={actualUser.avatar} 
                    alt={actualUser.username}
                    className="w-12 h-12 rounded-full mx-auto mb-2 border-2 border-white"
                  />
                ) : (
                  <div className="w-12 h-12 bg-white/20 rounded-full mx-auto mb-2 border-2 border-white flex items-center justify-center">
                    <span className="text-white text-lg">👤</span>
                  </div>
                )}
                <div className={`bg-white/20 rounded-lg p-2 ${heights[index]} flex flex-col justify-center`}>
                  <div className="text-2xl mb-1">{getTrophyIcon(index + 1)}</div>
                  <p className="text-white text-sm font-medium">{actualUser.username}</p>
                  <p className="text-white/80 text-xs">{actualUser.streaks} days</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Full Leaderboard */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-800">Full Rankings</h3>
        </div>
        
        <div className="divide-y divide-gray-100">
          {users.map((user) => (
            <div key={user.id} className="p-4 flex items-center space-x-4">
              <div className={`w-8 text-center font-bold text-lg ${getTrophyColor(user.position)}`}>
                {user.position <= 3 ? getTrophyIcon(user.position) : user.position}
              </div>
              
              {user.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={user.username}
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-gray-500 text-sm">👤</span>
                </div>
              )}
              
              <div className="flex-1">
                <h4 className="font-medium text-gray-800">{user.username}</h4>
                <p className="text-sm text-gray-600">{user.entries} journal entries</p>
              </div>
              
              <div className="text-right">
                <div className="flex items-center space-x-1">
                  <span className="text-orange-500">🔥</span>
                  <span className="font-bold text-red-800">{user.streaks}</span>
                </div>
                <p className="text-xs text-gray-500">day streak</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Summary */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="bg-red-50 rounded-xl p-4 text-center">
          <div className="text-2xl mb-1">👥</div>
          <div className="text-lg font-bold text-red-800">{users.length}</div>
          <div className="text-xs text-red-700">Active Users</div>
        </div>
        
        <div className="bg-yellow-50 rounded-xl p-4 text-center">
          <div className="text-2xl mb-1">🔥</div>
          <div className="text-lg font-bold text-yellow-600">{Math.max(...users.map(u => u.streaks))}</div>
          <div className="text-xs text-yellow-700">Longest Streak</div>
        </div>
        
        <div className="bg-red-50 rounded-xl p-4 text-center">
          <div className="text-2xl mb-1">📝</div>
          <div className="text-lg font-bold text-red-800">{users.reduce((sum, u) => sum + u.entries, 0)}</div>
          <div className="text-xs text-red-700">Total Entries</div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;