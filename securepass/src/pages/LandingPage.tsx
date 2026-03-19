import React from "react";
import { Link } from "react-router-dom";
import {
  Shield,
  ArrowRight,
  Building,
  Clock,
  CheckCircle2,
  Fingerprint,
} from "lucide-react";
import VisitorLayout from "../components/VisitorLayout";

const LandingPage: React.FC = () => {
  return (
    <VisitorLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/40 flex flex-col">
        {/* Main Content */}
        <main className="flex-1 flex flex-col justify-center items-center px-6 sm:px-8 lg:px-12 py-16">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6 leading-tight">
              SecurePass Visitor Management System
            </h1>
            <div className="flex flex-col items-center gap-2 mb-8 text-center">
              <p className="text-2xl text-slate-600 font-medium mx-auto leading-relaxed text-center">
                Professional visitor management solution for secure access control and real-time monitoring.
              </p>
            </div>
            
            <h2 className="text-3xl font-bold text-slate-700 mb-2">Choose Your Access Type</h2>
          </div>

          {/* Access Options */}
          <div className="flex justify-center items-center min-h-[300px] w-full">
            <div className="max-w-xl w-full mx-auto text-center">
            {/* Staff/Admin Access */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-10 hover:shadow-xl transition-shadow duration-300">
              <div className="flex flex-col items-center gap-4 mb-8 text-center">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-800 text-center">
                    Staff Access
                  </h3>
                  <p className="text-sm text-slate-500 text-center">
                    For Managers and Security
                  </p>
                </div>
              </div>

              <p className="text-slate-600 mb-8 font-semibold text-base leading-relaxed">
                Manage visitors, view records, generate reports, and control
                access to the premises.
              </p>

              <div className="grid grid-cols-3 gap-8 mb-8 max-w-4xl mx-auto">
                <div className="flex items-start gap-2 text-sm text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span className="leading-tight">Visitor Registration & Management</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span className="leading-tight">Real-time visitor tracking</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span className="leading-tight">Analytics & Reporting</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/login"
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 hover:scale-[1.02] transition-all duration-200"
                >
                  <Shield className="w-5 h-5" />
                  Staff Login
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/system-admin-login"
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-6 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-emerald-500/25 hover:scale-[1.02] transition-all duration-200"
                >
                  <Shield className="w-5 h-5" />
                  Admin Portal
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="mt-4 p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500 font-medium mb-2">
                  {/* Demo Credentials: */}
                </p>
                {/* <div className="space-y-1 text-xs">
                <p><span className="font-medium">Administrator:</span> admin / admin123</p>
                <p><span className="font-medium">Security:</span> security / security123</p>
              </div> */}
              </div>
            </div>
            </div>
          </div>

              {/* Features Section */}
          <div className="mt-16 mb-12 text-center max-w-6xl mx-4">
            <h3 className="text-3xl md:text-3xl font-bold text-slate-800 mb-8">
              Key Features
            </h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
                <div className="w-16 h-16 rounded-lg bg-indigo-100 flex items-center justify-center mx-auto mb-6">
                  <Fingerprint className="w-8 h-8 text-indigo-600" />
                </div>
                <h4 className="font-semibold text-slate-800 mb-3 text-center text-lg">
                  Secure Access
                </h4>
                <p className="text-sm text-slate-600 text-center leading-relaxed">
                  Advanced security with role-based access control and visitor
                  verification.
                </p>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
                <div className="w-16 h-16 rounded-lg bg-emerald-100 flex items-center justify-center mx-auto mb-6">
                  <Building className="w-8 h-8 text-emerald-600" />
                </div>
                <h4 className="font-semibold text-slate-800 mb-3 text-center text-lg">
                  Smart Management
                </h4>
                <p className="text-sm text-slate-600 text-center leading-relaxed">
                  Efficient visitor flow management with digital passes and
                  real-time tracking.
                </p>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
                <div className="w-16 h-16 rounded-lg bg-purple-100 flex items-center justify-center mx-auto mb-6">
                  <Clock className="w-8 h-8 text-purple-600" />
                </div>
                <h4 className="font-semibold text-slate-800 mb-3 text-center text-lg">
                  24/7 Availability
                </h4>
                <p className="text-sm text-slate-600 text-center leading-relaxed">
                  Round-the-clock access for visitors and staff with automated
                  check-In or Out.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </VisitorLayout>
  );
};

export default LandingPage;
