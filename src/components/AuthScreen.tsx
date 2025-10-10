import React, { useState } from 'react';
import { authService } from '@/services/database';

interface AuthScreenProps {
  onAuthComplete: (isNewUser?: boolean) => void;
  onFacilitatorLogin: () => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthComplete, onFacilitatorLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        // Login attempt
        await authService.signIn(email, password);
        onAuthComplete(false); // Existing user - goes to main
      } else {
        // Signup attempt
        await authService.signUp(email, password, email.split('@')[0]);
        onAuthComplete(true); // New user - goes to onboarding
      }
    } catch (error: any) {
      if (error.message.includes('Invalid login credentials')) {
        setError('Invalid credentials. Please check your email and password.');
      } else if (error.message.includes('User already registered')) {
        setError('An account with this email already exists. Please sign in instead.');
      } else {
        setError('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
    // Simulate sending reset email
    setTimeout(() => {
      setShowForgotPassword(false);
      alert('Password reset link sent to your email!');
    }, 2000);
  };

  const handleGoogleAuth = () => {
    setLoading(true);
    // Redirect to facilitator login instead of Google OAuth
    setTimeout(() => {
      setLoading(false);
      onFacilitatorLogin();
    }, 500);
  };

  if (showForgotPassword) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-amber-600 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <img 
                src="/FaithFlow logo.jpg" 
                alt="FaithFlow Logo" 
                className="w-24 h-24 mx-auto mb-4 rounded-full"
              />
              <h2 className="text-3xl font-bold text-gray-800 mb-2">FaithFlow</h2>
              <p className="text-lg text-gray-600 mb-1">Flowing Daily in the word</p>
              <p className="text-sm text-gray-500">By Ahava Ministry International</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📧</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Reset Password</h3>
              <p className="text-gray-600 mb-6">We're sending a password reset link to your email...</p>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-800 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-amber-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <img 
              src="/FaithFlow logo.jpg" 
              alt="FaithFlow Logo" 
              className="w-24 h-24 mx-auto mb-4 rounded-full"
            />
            <h2 className="text-3xl font-bold text-gray-800 mb-2">FaithFlow</h2>
            <p className="text-lg text-gray-600 mb-1">Flowing Daily in the word</p>
            <p className="text-sm text-gray-500">By Ahava Ministry International</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            <div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600"
                required
              />
            </div>
            {!isLogin && (
              <div>
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600"
                  required
                />
              </div>
            )}
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600"
                required
              />
            </div>
            {isLogin && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-red-700 hover:text-red-800 font-medium"
                >
                  Forgot Password?
                </button>
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-700 text-white py-3 rounded-xl font-semibold hover:bg-red-800 transition-colors disabled:opacity-50"
            >
              {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Sign Up')}
            </button>
          </form>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or</span>
            </div>
          </div>

          <button
            onClick={handleGoogleAuth}
            disabled={loading}
            className="w-full bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition-colors flex items-center justify-center disabled:opacity-50"
          >
            <span>Sign-in as an Administrator</span>
          </button>

          <div className="text-center mt-6">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-red-700 hover:text-red-800 font-medium"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;