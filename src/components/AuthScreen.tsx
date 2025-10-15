import React, { useState } from 'react';
import { authService } from '@/services/database';

interface AuthScreenProps {
  onAuthComplete: (isNewUser?: boolean) => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthComplete }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showCheckEmail, setShowCheckEmail] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitting, setForgotSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const timeout = setTimeout(() => {
      setError('Taking longer than expected. Please check your connection and try again.');
    }, 10000);

    try {
      if (isLogin) {
        await authService.signIn(email, password);
        onAuthComplete(false);
      } else {
        await authService.signUp(email, password, email.split('@')[0], phone);
        try { localStorage.setItem('ff_signup_phone', phone); } catch {}
        onAuthComplete(true);
      }
    } catch (error: any) {
      if (error?.message?.includes('Invalid login credentials')) {
        setError('Invalid credentials. Please check your email and password.');
      } else if (error?.message?.includes('User already registered')) {
        setError('An account with this email already exists. Please sign in instead.');
      } else {
        setError(error?.message || 'An error occurred. Please try again.');
      }
    } finally {
      clearTimeout(timeout);
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
    setForgotEmail(email || '');
    setError('');
  };

  const submitForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!forgotEmail) {
      setError('Please enter your email.');
      return;
    }
    setForgotSubmitting(true);
    try {
      await authService.requestPasswordReset(forgotEmail);
      alert('Password reset link sent. Please check your email.');
      setShowForgotPassword(false);
    } catch (err: any) {
      setError(err?.message || 'Failed to send reset email.');
    } finally {
      setForgotSubmitting(false);
    }
  };

  // Removed facilitator button flow

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
              <p className="text-gray-600 mb-6">Enter your email to receive a reset link.</p>
            </div>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">{error}</div>
            )}
            <form onSubmit={submitForgotPassword} className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600"
                required
              />
              <button
                type="submit"
                disabled={forgotSubmitting}
                className="w-full bg-red-700 text-white py-3 rounded-xl font-semibold hover:bg-red-800 transition-colors disabled:opacity-50"
              >
                {forgotSubmitting ? 'Sending...' : 'Send reset link'}
              </button>
              <button
                type="button"
                onClick={() => setShowForgotPassword(false)}
                className="w-full bg-gray-100 text-gray-800 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                Back
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  if (showCheckEmail) {
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
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Check your email</h2>
              <p className="text-gray-600">We sent a confirmation link to <span className="font-medium">{email}</span>.</p>
              <p className="text-gray-500 text-sm mt-2">Click the link to activate your account.</p>
            </div>
            <button
              type="button"
              onClick={() => setShowCheckEmail(false)}
              className="w-full bg-red-700 text-white py-3 rounded-xl font-semibold hover:bg-red-800 transition-colors"
            >
              Back to sign in
            </button>
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

          {/* Single sign-in only; facilitator login removed */}

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