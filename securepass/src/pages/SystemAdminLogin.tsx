import React, { useState } from 'react';
import { Shield, Building2, Eye, EyeOff, LogIn, UserPlus, Camera, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const SystemAdminLogin: React.FC = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showImageCapture, setShowImageCapture] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    property: ''
  });
  const { login, systemLogin, isAuthenticated, user } = useAuth();

  // Redirect to main dashboard if already authenticated as system admin
  if (isAuthenticated && user?.role === 'system_admin') {
    return <Navigate to="/dashboard" replace />;
  }

  // Redirect after successful login
  if (loginSuccess) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // TODO: Implement registration API call
      console.log('Registration data:', registerData);
      // For now, just show success message
      alert('Registration successful! Please login with your credentials.');
      setShowRegister(false);
      setRegisterData({ name: '', email: '', phone: '', company: '', property: '' });
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageCapture = () => {
    // Access camera and capture image
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        const video = document.createElement('video');
        video.srcObject = stream;
        video.play();
        
        setTimeout(() => {
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(video, 0, 0);
          
          const imageData = canvas.toDataURL('image/jpeg');
          setCapturedImage(imageData);
          stream.getTracks().forEach(track => track.stop());
        }, 1000);
      })
      .catch(err => {
        console.error('Camera access denied:', err);
        alert('Camera access denied. Please allow camera access to use this feature.');
      });
  };

  const removeImage = () => {
    setCapturedImage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Try system login first (for users created through system admin)
      const result = await systemLogin(credentials.username, credentials.password);
      
      if (result.success) {
        // Check if user is system admin or has appropriate role
        if (result.user?.role === 'system_admin' || result.user?.role === 'superadmin' || 
            result.user?.role === 'security' || result.user?.role === 'property_manager') {
          setLoginSuccess(true);
        } else {
          throw new Error('Not authorized for system admin access');
        }
      } else {
        // Fallback to regular login for default users
        await login(credentials.username, credentials.password);
        if (user?.role === 'system_admin') {
          setLoginSuccess(true);
        } else {
          throw new Error('Not authorized as system admin');
        }
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
          <p className="text-emerald-100">Administrator Portal</p>
        </div>

        {/* Toggle between Login and Register */}
        <div className="text-center mb-6">
          <button
            type="button"
            onClick={() => setShowRegister(!showRegister)}
            className="text-emerald-300 hover:text-white text-sm font-medium transition-colors"
          >
            {showRegister ? 'Already have an account? Sign In' : 'Need an account? Register'}
          </button>
        </div>

        {/* Login/Register Form */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8">
          {!showRegister ? (
            /* Login Form */
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-emerald-100 mb-2">
                  Username or Email
                </label>
                <input
                  type="text"
                  value={credentials.username}
                  onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Enter username (for default users) or email (for system users)"
                  required
                />
                <p className="text-xs text-emerald-200 mt-1">
                  System users: use your registered email<br/>
                  Default users: use your username (admin, security)
                </p>
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
                <p className="text-xs text-emerald-200 mt-1">
                  System users: default password is "admin123"<br/>
                  Default users: use your assigned password
                </p>
              </div>

              {/* Optional Image Capture Section */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-emerald-100">
                    Optional: Face Recognition
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowImageCapture(!showImageCapture)}
                    className="text-xs text-emerald-300 hover:text-white transition-colors"
                  >
                    {showImageCapture ? 'Hide' : 'Show'} Camera
                  </button>
                </div>
                
                {showImageCapture && (
                  <div className="space-y-3">
                    {capturedImage ? (
                      <div className="relative">
                        <img 
                          src={capturedImage} 
                          alt="Captured" 
                          className="w-full h-32 object-cover rounded-lg border border-white/20"
                        />
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={handleImageCapture}
                        className="w-full py-3 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
                      >
                        <Camera className="w-5 h-5" />
                        <span>Capture Photo</span>
                      </button>
                    )}
                    <p className="text-xs text-emerald-200">
                      Optional: Add face recognition for enhanced security
                    </p>
                  </div>
                )}
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
          ) : (
            /* Registration Form */
            <form onSubmit={handleRegister} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-emerald-100 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={registerData.name}
                  onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
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
                  value={registerData.email}
                  onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-emerald-100 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={registerData.phone}
                  onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Enter your phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-emerald-100 mb-2">
                  Company
                </label>
                <input
                  type="text"
                  value={registerData.company}
                  onChange={(e) => setRegisterData({ ...registerData, company: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Enter your company name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-emerald-100 mb-2">
                  Property
                </label>
                <input
                  type="text"
                  value={registerData.property}
                  onChange={(e) => setRegisterData({ ...registerData, property: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Enter your property name"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 rounded-lg font-semibold hover:from-emerald-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Registering...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <UserPlus className="w-5 h-5" />
                    Register
                  </div>
                )}
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <p className="text-emerald-100 text-sm">
              Access restricted to System Administrators
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
              <LogIn className="w-6 h-6 text-emerald-300" />
            </div>
            <p className="text-emerald-100 text-xs">Admin</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemAdminLogin;
