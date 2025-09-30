import React, { useState } from 'react';

interface OnboardingScreenProps {
  onComplete: (userData: { username: string; readingPlan: string }) => void;
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState('');
  const [readingPlan, setReadingPlan] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const readingPlans = [
    { id: '40-days', name: '40 Days', description: 'Essential spiritual journey' },
    { id: '90-days-non-chrono', name: '90 Days Non-Chronological', description: 'Thematic Bible reading' },
    { id: '90-days-chrono', name: '90 Days Chronological', description: 'Biblical timeline order' }
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      onComplete({ username, readingPlan });
    }
  };

  const canProceed = () => {
    if (step === 2) return username.trim().length >= 3;
    if (step === 3) return readingPlan !== '';
    return true;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-amber-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>Step {step} of 3</span>
              <span>{Math.round((step / 3) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-red-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(step / 3) * 100}%` }}
              ></div>
            </div>
          </div>

          {step === 1 && (
            <div className="text-center">
              <div className="mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <span className="text-4xl">✨</span>
                </div>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent mb-4">
                  Welcome to FaithFlow!
                </h2>
                <p className="text-xl text-gray-700 font-medium mb-3">
                  Faith isn't static, flow with it
                </p>
                <p className="text-sm text-gray-500 italic">
                  "2 Peter 3:18"
                </p>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">👤</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Set Up Your Profile</h2>
                <p className="text-gray-600">Add a profile picture and choose your username</p>
              </div>
              
              {/* Profile Image Upload */}
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-red-200 mx-auto mb-4">
                    {profileImage ? (
                      <img 
                        src={profileImage} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-red-100 flex items-center justify-center">
                        <span className="text-2xl">👤</span>
                      </div>
                    )}
                  </div>
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <div className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
                      {profileImage ? 'Change Photo' : 'Add Photo'}
                    </div>
                  </label>
                </div>
              </div>

              {/* Username Input */}
              <div>
                <input
                  type="text"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                  maxLength={20}
                />
                <p className="text-sm text-gray-500 mt-2">At least 3 characters</p>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">📖</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Select Reading Plan</h2>
                <p className="text-gray-600">Choose the plan that fits your spiritual goals.</p>
              </div>
              <div className="space-y-3">
                {readingPlans.map((plan) => (
                  <button
                    key={plan.id}
                    onClick={() => setReadingPlan(plan.id)}
                    className={`w-full p-4 border-2 rounded-xl text-left transition-colors ${
                      readingPlan === plan.id 
                        ? 'border-red-500 bg-red-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <h3 className="font-semibold text-gray-800">{plan.name}</h3>
                    <p className="text-sm text-gray-600">{plan.description}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 flex justify-between">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className={`px-6 py-3 rounded-xl font-medium transition-colors ${
                step === 1 ? 'ml-auto' : ''
              }               ${
                canProceed() 
                  ? 'bg-red-600 text-white hover:bg-red-700' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {step === 3 ? 'Complete Setup' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingScreen;