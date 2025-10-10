import React, { useState } from 'react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
  readingPlan: string;
  profilePicture?: string | null;
  onUpdateReadingPlan: (plan: string) => void;
  onUpdateProfilePicture: (picture: string | null) => void;
  isDarkMode: boolean;
  onThemeToggle: () => void;
  isFacilitator?: boolean;
  onToggleFacilitator?: (value: boolean) => void;
  // User statistics
  journalEntries?: number;
  communityPosts?: number;
  totalLikes?: number;
  currentStreak?: number;
  totalVisits?: number;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ 
  isOpen, 
  onClose, 
  username, 
  readingPlan, 
  profilePicture,
  onUpdateReadingPlan,
  onUpdateProfilePicture,
  isDarkMode,
  onThemeToggle,
  isFacilitator,
  onToggleFacilitator,
  journalEntries = 0,
  communityPosts = 0,
  totalLikes = 0,
  currentStreak = 0,
  totalVisits = 0
}) => {
  const [selectedPlan, setSelectedPlan] = useState(readingPlan);
  const [showPlanSelector, setShowPlanSelector] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const readingPlans = [
    { id: '40-days', name: '40 Days', description: 'Essential spiritual journey' },
    { id: '90-days-non-chrono', name: '90 Days Non-Chronological', description: 'Thematic Bible reading' },
    { id: '90-days-chrono', name: '90 Days Chronological', description: 'Biblical timeline order' }
  ];

  const handleSavePlan = () => {
    onUpdateReadingPlan(selectedPlan);
    setShowPlanSelector(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      const reader = new FileReader();
      reader.onload = (e) => {
        onUpdateProfilePicture(e.target?.result as string);
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeProfilePicture = () => {
    onUpdateProfilePicture(null);
  };

  const handleHelpSupport = () => {
    setShowHelp(true);
  };

  const handleStatistics = () => {
    // Show detailed statistics modal or navigate to stats page
    alert(`Your FaithFlow Statistics:\n\n📖 Journal Entries: ${journalEntries}\n👥 Community Posts: ${communityPosts}\n❤️ Total Likes Received: ${totalLikes}\n🔥 Current Streak: ${currentStreak} days\n📱 Total App Visits: ${totalVisits}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[1000]">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] overflow-y-auto scrollbar-hide">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Profile Settings</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Profile Info */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4 mb-4">
            <div className="relative">
              <input
                type="file"
                id="profile-picture-change"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <label
                htmlFor="profile-picture-change"
                className="relative cursor-pointer group"
              >
                <div className="relative">
                  {profilePicture ? (
                    <img 
                      src={profilePicture} 
                      alt="Profile"
                      className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 group-hover:border-red-300 transition-colors"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center border-2 border-gray-200 group-hover:border-red-300 transition-colors">
                      {isUploading ? (
                        <div className="w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <span className="text-2xl text-gray-400">👤</span>
                      )}
                    </div>
                  )}
                  
                  {/* Pencil Icon */}
                  <div className="absolute -bottom-1 -right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-lg group-hover:bg-red-700 transition-colors">
                    ✏️
                  </div>
                </div>
              </label>
              
              {/* Remove button if profile picture exists */}
              {profilePicture && (
                <button
                  onClick={removeProfilePicture}
                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                >
                  ×
                </button>
              )}
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-800">{username}</h3>
              <p className="text-sm text-gray-600">FaithFlow Member</p>
              <p className="text-xs text-gray-500 mt-1">Tap profile picture to change</p>
            </div>
          </div>
        </div>

        {/* User Statistics */}
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Statistics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-red-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{journalEntries}</div>
              <div className="text-sm text-gray-600">Journal Entries</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{communityPosts}</div>
              <div className="text-sm text-gray-600">Community Posts</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{totalLikes}</div>
              <div className="text-sm text-gray-600">Likes Received</div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">{currentStreak}</div>
              <div className="text-sm text-gray-600">Day Streak</div>
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="p-6 space-y-4">
          {/* Theme Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{isDarkMode ? '🌙' : '☀️'}</span>
              <div>
                <h4 className="font-medium text-gray-800">Theme</h4>
                <p className="text-sm text-gray-600">{isDarkMode ? 'Dark Mode' : 'Light Mode'}</p>
              </div>
            </div>
            <button
              onClick={onThemeToggle}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                isDarkMode ? 'bg-purple-600' : 'bg-gray-300'
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                  isDarkMode ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {/* Reading Plan */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">📖</span>
                <div>
                  <h4 className="font-medium text-gray-800">Reading Plan</h4>
                  <p className="text-sm text-gray-600">
                    {readingPlans.find(p => p.id === readingPlan)?.name}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowPlanSelector(!showPlanSelector)}
                className="px-3 py-1 bg-purple-100 text-purple-600 rounded-lg text-sm font-medium hover:bg-purple-200 transition-colors"
              >
                Change
              </button>
            </div>

            {showPlanSelector && (
              <div className="mt-4 space-y-2">
                {readingPlans.map((plan) => (
                  <button
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`w-full p-3 border-2 rounded-lg text-left transition-colors ${
                      selectedPlan === plan.id 
                        ? 'border-purple-500 bg-purple-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <h5 className="font-medium text-gray-800">{plan.name}</h5>
                    <p className="text-sm text-gray-600">{plan.description}</p>
                  </button>
                ))}
                <div className="flex space-x-2 mt-4">
                  <button
                    onClick={handleSavePlan}
                    className="flex-1 bg-purple-600 text-white py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors"
                  >
                    Save Plan
                  </button>
                  <button
                    onClick={() => {
                      setSelectedPlan(readingPlan);
                      setShowPlanSelector(false);
                    }}
                    className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

              {/* Other Settings */}
              <div className="space-y-3 pt-4 border-t border-gray-200">

                <button className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <span className="text-2xl">🔔</span>
                  <div className="text-left">
                    <h4 className="font-medium text-gray-800">Notifications</h4>
                    <p className="text-sm text-gray-600">Daily reminders and updates</p>
                  </div>
                </button>

                <button 
                  onClick={handleStatistics}
                  className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <span className="text-2xl">📊</span>
                  <div className="text-left">
                    <h4 className="font-medium text-gray-800">Statistics</h4>
                    <p className="text-sm text-gray-600">View your progress data</p>
                  </div>
                </button>

                <button 
                  onClick={handleHelpSupport}
                  className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <span className="text-2xl">❓</span>
                  <div className="text-left">
                    <h4 className="font-medium text-gray-800">Help & Support</h4>
                    <p className="text-sm text-gray-600">Get help with the app</p>
                  </div>
                </button>
              </div>
        </div>
      </div>

      {/* Help & Support Modal */}
      {showHelp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[1001]">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">Help & Support</h2>
              <button
                onClick={() => setShowHelp(false)}
                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Getting Started</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>• Complete your daily Bible reading</p>
                  <p>• Write journal reflections</p>
                  <p>• Share with the community</p>
                  <p>• Track your spiritual journey</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Features</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>• <strong>Journal:</strong> Reflect on your readings</p>
                  <p>• <strong>Community:</strong> Share insights and prayers</p>
                  <p>• <strong>Export:</strong> Save entries as PDF or images</p>
                  <p>• <strong>Statistics:</strong> Track your progress</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Contact Support</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>📧 Email: support@faithflow.app</p>
                  <p>📱 Phone: +234 806 328 0046</p>
                  <p>💬 Live Chat: Available 9AM-6PM EST</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Troubleshooting</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>• <strong>App not loading:</strong> Check your internet connection</p>
                  <p>• <strong>Can't save entries:</strong> Try refreshing the page</p>
                  <p>• <strong>Export issues:</strong> Ensure you have sufficient storage</p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowHelp(false)}
                  className="w-full bg-red-600 text-white py-3 rounded-xl font-medium hover:bg-red-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileModal;