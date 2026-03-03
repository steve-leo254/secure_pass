import React, { useState } from 'react';
import { Shield, Building2, Eye, EyeOff, UserPlus, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';

const SuperAdminRegistration: React.FC = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    name: '',
    email: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Redirect to admin dashboard if already authenticated as superadmin
  const { isAuthenticated, isSuperAdmin } = useAuth();
  if (isAuthenticated && isSuperAdmin) {
    navigate('/admin');
    return null;
  }

  // Redirect after successful registration
  if (registrationSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/20"></div>
        
        <div className="relative z-10 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Registration Successful</h1>
            <p className="text-emerald-100">Super Admin has been registered</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8">
            <div className="text-center space-y-4">
              <p className="text-emerald-100">
                Your super admin account has been created successfully.
              </p>
              <p className="text-emerald-100 text-sm">
                You can now login with your credentials at the normal login page.
              </p>
              <button
                onClick={() => navigate('/login')}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 rounded-lg font-semibold hover:from-emerald-600 hover:to-teal-700 transition-colors"
              >
                Go to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const validateForm = () => {
    if (!credentials.username.trim()) {
      setError('Username is required');
      return false;
    }
    if (!credentials.name.trim()) {
      setError('Name is required');
      return false;
    }
    if (!credentials.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (credentials.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (credentials.password !== credentials.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // Try to register the superadmin directly
      await apiService.registerSuperAdmin({
        name: credentials.name,
        email: credentials.email || `${credentials.username}@admin.com`,
        password: credentials.password
      });

      setRegistrationSuccess(true);
    } catch (error: any) {
      console.error('Registration failed:', error);
      if (error.message.includes('Super admin already exists')) {
        setError('A super admin account already exists! Please use the login page with credentials: fresh / admin123');
      } else {
        setError(error.message || 'Registration failed. Please try again.');
      }
    } finally {
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
          <h1 className="text-2xl font-bold text-white mb-2">Super Admin</h1>
          <p className="text-emerald-100">Create System Administrator</p>
        </div>

        {/* Registration Form */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
            <p className="text-blue-700 text-sm">
              💡 <strong>Note:</strong> If a super admin already exists, you'll see an error. 
              Use the existing credentials: <strong>fresh / admin123</strong>
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-emerald-100 mb-2">
                Username
              </label>
              <input
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Choose a username"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-emerald-100 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={credentials.name}
                onChange={(e) => setCredentials({ ...credentials, name: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-emerald-100 mb-2">
                Email
              </label>
              <input
                type="email"
                value={credentials.email}
                onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Enter your email"
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
                  placeholder="Create a strong password"
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

            <div>
              <label className="block text-sm font-medium text-emerald-100 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={credentials.confirmPassword}
                  onChange={(e) => setCredentials({ ...credentials, confirmPassword: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent pr-12"
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-emerald-200 hover:text-white"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
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
                  Creating Account...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <UserPlus className="w-5 h-5" />
                  Create Super Admin
                </div>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-emerald-100 text-sm">
              This account will have full system access
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Building2 className="w-6 h-6 text-emerald-300" />
            </div>
            <p className="text-emerald-100 text-xs">Multi-Tenant</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Shield className="w-6 h-6 text-emerald-300" />
            </div>
            <p className="text-emerald-100 text-xs">Secure</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg flex items-center justify-center mx-auto mb-2">
              <UserPlus className="w-6 h-6 text-emerald-300" />
            </div>
            <p className="text-emerald-100 text-xs">Admin</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminRegistration;
