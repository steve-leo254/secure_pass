import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { VisitorProvider } from "./context/VistorContext";
import { DataProvider } from "./context/DataContext";
import { BillingProvider } from "./context/BillingContext";
import { SystemAdminProvider } from "./context/SystemAdminContext";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import PublicRegister from './pages/PublicRegister';
import Dashboard from "./pages/Dashboard";
import RegisterVisitor from "./pages/RegisterVisitor";
import ActiveVisitors from "./pages/ActiveVisitors";
import AllRecords from "./pages/AllRecords";
import Settings from "./pages/Settings";
import QRPage from "./pages/QRPage";
import AdminAnalytics from "./pages/AdminAnalytics";
import ToolsManagement from "./pages/ToolsManagement";
import MemberRegister from "./pages/MemberRegister";
import Members from "./pages/Members";
import TermsAndConditions from "./pages/TermsAndConditions";
import ProfilePage from "./pages/ProfilePage";
import Management from "./pages/Management";
import PublicCheckout from './pages/PublicCheckout';
import SystemAdmin from './pages/SystemAdmin';
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
  if (roles && user && !roles.includes(user.role))
    return <Navigate to="/dashboard" replace />;
  return <Layout>{children}</Layout>;
};

const LoginGuard = () => {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return <Login />;
};

export default function App() {
  return (
    <BrowserRouter>
      <SystemAdminProvider>
        <AuthProvider>
          <BillingProvider>
            <VisitorProvider>
              <DataProvider>
              <Routes>
            <Route path="/" element={<LoginGuard />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/termsandcondition" element={<TermsAndConditions />} />
            <Route path="/system-admin" element={<Protected roles={["property_manager"]}><SystemAdmin /></Protected>} />
            <Route path="/visitor-register" element={<PublicRegister />} />
            <Route path="/visitor-checkout" element={<PublicCheckout />} />

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
                <Protected>
                  <RegisterVisitor />
                </Protected>
              }
            />
            <Route
              path="/active"
              element={
                <Protected>
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
              path="/tools"
              element={
                <Protected roles={["property_manager"]}>
                  <ToolsManagement />
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
              path="/settings"
              element={
                <Protected roles={["property_manager"]}>
                  <Settings />
                </Protected>
              }
            />
            <Route
              path="/qr"
              element={
                <Protected>
                  <QRPage />
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
    </AuthProvider>
    </SystemAdminProvider>
    </BrowserRouter>
  );
}