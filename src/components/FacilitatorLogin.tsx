import React, { useState } from 'react';
import { authService, userService } from '@/services/database';

interface FacilitatorLoginProps {
  onLoginSuccess: (isNewFacilitator?: boolean) => void;
  onBack: () => void;
}

const FacilitatorLogin: React.FC<FacilitatorLoginProps> = ({ onLoginSuccess, onBack }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        // Login attempt
        const { user } = await authService.signIn(email, password);
        
        // Check if user is a facilitator
        const profile = await userService.getUserProfile(user.id);
        if (!profile.is_facilitator) {
          setError('This account is not authorized as a facilitator.');
          setLoading(false);
          return;
        }
        
        localStorage.setItem('ff_is_facilitator', '1');
        onLoginSuccess(false); // Existing facilitator - goes to main
      } else {
        // Signup attempt - create facilitator account
        const { user } = await authService.signUp(email, password, email.split('@')[0]);
        
        // Create facilitator profile
        await userService.upsertUserProfile({
          id: user.id,
          email: user.email,
          username: email.split('@')[0],
          is_facilitator: true
        });
        
        localStorage.setItem('ff_is_facilitator', '1');
        onLoginSuccess(true); // New facilitator - goes to onboarding
      }
    } catch (error: any) {
      if (error.message.includes('Invalid login credentials')) {
        setError('Invalid facilitator credentials. Please check your email and password.');
      } else if (error.message.includes('User already registered')) {
        setError('A facilitator account with this email already exists. Please sign in instead.');
      } else {
        setError('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden">
            <img 
              src="/faithflow-logo.jpg" 
              alt="FaithFlow Logo" 
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {isLogin ? 'Facilitator Login' : 'Facilitator Sign Up'}
          </h1>
          <p className="text-gray-600">
            {isLogin 
              ? 'Enter your administrator credentials to access announcement features'
              : 'Create a new facilitator account to access announcement features'
            }
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Administrator Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                {isLogin ? 'Signing in...' : 'Creating account...'}
              </div>
            ) : (
              isLogin ? 'Sign in as Administrator' : 'Create Administrator Account'
            )}
          </button>
        </form>

        {/* Toggle and Back Button */}
        <div className="mt-6 text-center space-y-3">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-red-600 hover:text-red-800 font-medium"
          >
            {isLogin ? "Don't have a facilitator account? Sign up" : "Already have a facilitator account? Sign in"}
          </button>
          <div>
            <button
              onClick={onBack}
              className="text-gray-600 hover:text-gray-800 font-medium"
            >
              ← Back to regular sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacilitatorLogin;
