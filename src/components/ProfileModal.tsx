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
  onThemeToggle 
}) => {
  const [selectedPlan, setSelectedPlan] = useState(readingPlan);
  const [showPlanSelector, setShowPlanSelector] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[100]">
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

                <button className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <span className="text-2xl">📊</span>
                  <div className="text-left">
                    <h4 className="font-medium text-gray-800">Statistics</h4>
                    <p className="text-sm text-gray-600">View your progress data</p>
                  </div>
                </button>

                <button className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <span className="text-2xl">❓</span>
                  <div className="text-left">
                    <h4 className="font-medium text-gray-800">Help & Support</h4>
                    <p className="text-sm text-gray-600">Get help with the app</p>
                  </div>
                </button>
              </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;