import React, { useState } from 'react';
import { Shield, Building2, Eye, EyeOff, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const SuperAdminLogin: React.FC = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const { login, isAuthenticated, user } = useAuth();

  // Redirect to admin dashboard if already authenticated as superadmin
  if (isAuthenticated && user?.role === 'superadmin') {
    return <Navigate to="/admin" replace />;
  }

  // Redirect after successful login
  if (loginSuccess) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(credentials.username, credentials.password);
      // Check if user is superadmin and redirect accordingly
      if (user?.role === 'superadmin') {
        setLoginSuccess(true);
      } else {
        throw new Error('Not authorized as super admin');
      }
    } catch (error) {
      console.error('Login failed:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/20"></div>
      
      <div className="relative z-10 w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">System Admin</h1>
          <p className="text-emerald-100">Super Admin Portal</p>
        </div>

        {/* Login Form */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-emerald-100 mb-2">
                Username
              </label>
              <input
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Enter your username"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-emerald-100 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent pr-12"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-emerald-200 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 rounded-lg font-semibold hover:from-emerald-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Signing in...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <LogIn className="w-5 h-5" />
                  Sign In
                </div>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-emerald-100 text-sm">
              Access restricted to Super Administrators
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Building2 className="w-6 h-6 text-emerald-300" />
            </div>
            <p className="text-emerald-100  text-xs">Multi-Tenant</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Shield className="w-6 h-6 text-emerald-300" />
            </div>
            <p className="text-emerald-100 text-xs">Secure</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg flex items-center justify-center mx-auto mb-2">
              <LogIn className="w-6 h-6 text-emerald-300" />
            </div>
            <p className="text-emerald-100 text-xs">Admin</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminLogin;
