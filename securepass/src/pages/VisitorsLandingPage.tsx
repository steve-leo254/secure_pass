import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import VisitorsNavbar from '../components/VisitorsNavbar';
import {
  Shield,
  ArrowRight,
  Clock,
  Fingerprint,
  Users,
  Zap,
  Lock,
  BarChart3,
  Smartphone,
} from 'lucide-react';

const VisitorsLandingPage: React.FC = () => {
  useEffect(() => {
    // Smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <VisitorsNavbar />
      
      {/* Hero Section */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2310b981' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        ></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-6">
              <Shield className="w-4 h-4" />
              Secure Visitor Management System
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">SecurePass</span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-12">
            Experience seamless visitor management with our advanced security features. 
            Register, check in, and manage your visits with cutting-edge technology.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/visitor-registration"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-emerald-500/25 hover:scale-[1.02] transition-all duration-200"
            >
              <Users className="w-5 h-5" />
              Register as Visitor
              <ArrowRight className="w-5 h-5" />
            </Link>
            
            <Link
              to="/visitor-dashboard"
              className="inline-flex items-center gap-3 px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:border-emerald-300 hover:bg-emerald-50 transition-all duration-200"
            >
              <Clock className="w-5 h-5" />
              Check In
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Modern Visitor Management
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to manage visitors efficiently and securely
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-gray-200 hover:border-emerald-300 hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mb-6">
                <Fingerprint className="w-7 h-7 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Secure Registration</h3>
              <p className="text-gray-600">Quick and secure visitor registration with advanced verification systems</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl border border-gray-200 hover:border-emerald-300 hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mb-6">
                <Zap className="w-7 h-7 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Smart Check-in</h3>
              <p className="text-gray-600">Fast and efficient check-in process with QR code technology</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl border border-gray-200 hover:border-emerald-300 hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mb-6">
                <Lock className="w-7 h-7 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Advanced Security</h3>
              <p className="text-gray-600">Multi-layer security features to protect your premises and data</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl border border-gray-200 hover:border-emerald-300 hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mb-6">
                <BarChart3 className="w-7 h-7 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Real-time Analytics</h3>
              <p className="text-gray-600">Track visitor patterns and get insights from detailed analytics</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl border border-gray-200 hover:border-emerald-300 hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mb-6">
                <Smartphone className="w-7 h-7 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Mobile Friendly</h3>
              <p className="text-gray-600">Access the system from any device with our responsive design</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl border border-gray-200 hover:border-emerald-300 hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mb-6">
                <Clock className="w-7 h-7 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">24/7 Access</h3>
              <p className="text-gray-600">Round-the-clock access to visitor management and support</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Simple three-step process to manage your visitors
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-emerald-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Register</h3>
              <p className="text-gray-600">Create your visitor profile with basic information</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-emerald-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Check In</h3>
              <p className="text-gray-600">Scan QR code or use manual check-in at the entrance</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-emerald-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Check Out</h3>
              <p className="text-gray-600">Complete your visit with smart checkout system</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-teal-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Experience Secure Visitor Management?
          </h2>
          <p className="text-xl text-emerald-100 max-w-3xl mx-auto mb-8">
            Join thousands of visitors who trust SecurePass for their access needs
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/visitor-registration"
              className="inline-flex items-center gap-3 px-8 py-4 bg-white text-emerald-600 font-semibold rounded-xl hover:shadow-xl hover:scale-[1.02] transition-all duration-200"
            >
              <Users className="w-5 h-5" />
              Get Started Now
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default VisitorsLandingPage;