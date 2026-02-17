import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { VisitorProvider } from "./context/VistorContext";
import Layout from "./components/Layout";
import Login from "./pages/Login";
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
      <AuthProvider>
        <VisitorProvider>
          <Routes>
            <Route path="/" element={<LoginGuard />} />
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
                <Protected roles={["admin"]}>
                  <AllRecords />
                </Protected>
              }
            />
            <Route
              path="/analytics"
              element={
                <Protected roles={["admin"]}>
                  <AdminAnalytics />
                </Protected>
              }
            />
            <Route
              path="/tools"
              element={
                <Protected roles={["admin"]}>
                  <ToolsManagement />
                </Protected>
              }
            />
            <Route
              path="/settings"
              element={
                <Protected roles={["admin"]}>
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
                <Protected roles={["admin", "security"]}>
                  <Members />
                </Protected>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </VisitorProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}