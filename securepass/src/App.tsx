import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { VisitorProvider } from "./context/VistorContext";
import { DataProvider } from "./context/DataContext";
import { BillingProvider } from "./context/BillingContext";
import { SystemAdminProvider } from "./context/SystemAdminContext";
import Layout from "./components/Layout";
import VisitorLayout from "./components/VisitorLayout";
import LandingPage from "./pages/LandingPage";
import VisitorsLandingPage from "./pages/VisitorsLandingPage";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import RegisterVisitor from "./pages/RegisterVisitor";
import ActiveVisitors from "./pages/ActiveVisitors";
import AllRecords from "./pages/AllRecords";
import Settings from "./pages/Settings";
import AdminAnalytics from "./pages/AdminAnalytics";
import MemberRegister from "./pages/MemberRegister";
import Members from "./pages/Members";
import TermsAndConditions from "./pages/TermsAndConditions";
import ProfilePage from "./pages/ProfilePage";
import Management from "./pages/Management";
import CheckoutPage from "./pages/CheckoutPage";
import SystemAdmin from './pages/SystemAdmin';
import SystemAdminLogin from './pages/SystemAdminLogin';
import VisitorSmartCheckout from './pages/VisitorSmartCheckout';
import VisitorRegistrationPage from './pages/VisitorRegistrationPage';
import ResetPassword from './pages/ResetPassword';
import type { ReactNode } from "react";

const Protected = ({
  children,
  roles,
}: {
  children: ReactNode;
  roles?: string[];
}) => {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/" replace />;

  // Temporarily allow all authenticated users for testing
  console.log('Protected route - User:', user, 'Required roles:', roles);

  if (roles && user && !roles.includes(user.role)) {
    console.log('User role mismatch, but allowing for testing');
    // return <Navigate to="/dashboard" replace />;
  }

  return <Layout>{children}</Layout>;
};

const LoginGuard = () => {
  const { isAuthenticated, user } = useAuth();
  if (isAuthenticated) {
    // Redirect based on role
    if (user?.role === 'system_admin') {
      return <Navigate to="/system-admin" replace />;
    } else {
      return <Navigate to="/active" replace />;
    }
  }
  return <Login />;
};

const PublicVisitorLayout = ({ children }: { children: ReactNode }) => {
  return <VisitorLayout>{children}</VisitorLayout>;
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SystemAdminProvider>
          <BillingProvider>
            <VisitorProvider>
              <DataProvider>
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/visitors" element={<VisitorsLandingPage />} />
                  <Route path="/login" element={<LoginGuard />} />
                  <Route path="/system-admin-login" element={<SystemAdminLogin />} />
                  <Route path="/profile" element={<Layout><ProfilePage /></Layout>} />
                  <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
                  <Route path="/system-admin" element={<Protected roles={["system_admin"]}><SystemAdmin /></Protected>} />
                  <Route path="/system-admin/users" element={<Protected roles={["system_admin"]}><SystemAdmin /></Protected>} />
                  <Route path="/system-admin/subscriptions" element={<Protected roles={["system_admin"]}><SystemAdmin /></Protected>} />
                  <Route path="/system-admin/packages" element={<Protected roles={["system_admin"]}><SystemAdmin /></Protected>} />
                  <Route path="/system-admin/property-managers" element={<Protected roles={["system_admin"]}><SystemAdmin /></Protected>} />
                  <Route path="/system-admin/reminders" element={<Protected roles={["system_admin"]}><SystemAdmin /></Protected>} />

                  <Route path="/visitor-registration" element={<VisitorRegistrationPage />} />
                  <Route path="/visitor-profile" element={<PublicVisitorLayout><ProfilePage /></PublicVisitorLayout>} />

                  <Route path="/reset-password" element={<ResetPassword />} />

                  <Route
                    path="/dashboard"
                    element={
                      <Protected>
                        <Dashboard />
                      </Protected>
                    }
                  />
                  <Route
                    path="/register"
                    element={
                      <Protected roles={["property_manager", "security"]}>
                        <RegisterVisitor />
                      </Protected>
                    }
                  />
                  <Route
                    path="/active"
                    element={
                      <Protected roles={["property_manager", "security"]}>
                        <ActiveVisitors />
                      </Protected>
                    }
                  />
                  <Route
                    path="/records"
                    element={
                      <Protected roles={["property_manager"]}>
                        <AllRecords />
                      </Protected>
                    }
                  />
                  <Route
                    path="/analytics"
                    element={
                      <Protected roles={["property_manager"]}>
                        <AdminAnalytics />
                      </Protected>
                    }
                  />
                  <Route
                    path="/checkout"
                    element={
                      // Simple test without Layout or Protected
                      <div style={{ padding: '20px' }}>
                        <CheckoutPage />
                      </div>
                    }
                  />
                  <Route
                    path="/tools"
                    element={
                      <Protected roles={["property_manager"]}>
                        <Management />
                      </Protected>
                    }
                  />
                  <Route
                    path="/management"
                    element={
                      <Protected roles={["property_manager"]}>
                        <Management />
                      </Protected>
                    }
                  />
                  <Route
                    path="/security-staff"
                    element={
                      <Protected roles={["property_manager"]}>
                        <Management />
                      </Protected>
                    }
                  />
                  <Route
                    path="/settings"
                    element={
                      <Protected roles={["property_manager"]}>
                        <Settings />
                      </Protected>
                    }
                  />
                  <Route
                    path="/smart-checkout"
                    element={
                      <Protected roles={["property_manager", "security"]}>
                        <VisitorSmartCheckout />
                      </Protected>
                    }
                  />
                  <Route
                    path="/member-register"
                    element={
                      <Protected>
                        <MemberRegister />
                      </Protected>
                    }
                  />
                  <Route
                    path="/members"
                    element={
                      <Protected roles={["property_manager", "security"]}>
                        <Members />
                      </Protected>
                    }
                  />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </DataProvider>
            </VisitorProvider>
          </BillingProvider>
        </SystemAdminProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}