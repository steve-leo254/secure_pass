import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Shield, User, Lock, LogIn, Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    if (login(username, password)) {
      navigate("/dashboard");
    } else {
      setError("Invalid username or password");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/3" />
      <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-indigo-400/10 rounded-full blur-[80px] -translate-x-1/2 -translate-y-1/2" />

      <div className="relative w-full max-w-md animate-scale-in">
        <div className="glass rounded-3xl p-8 sm:p-10 shadow-2xl">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-5 border border-white/20 shadow-xl">
              <Shield className="w-11 h-11 text-white" />
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              SECUREPASS
            </h1>
            <p className="text-blue-200/80 mt-1 text-sm font-medium">
              Visitor & Access Management System
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-500/15 border border-red-400/25 text-red-200 px-4 py-3 rounded-xl text-sm animate-fade-in flex items-center gap-2">
                <div className="w-2 h-2 bg-red-400 rounded-full flex-shrink-0" />
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-blue-100/90 mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-white/10 border border-white/15 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all"
                  placeholder="Enter your username"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-100/90 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/10 border border-white/15 rounded-xl py-3.5 pl-12 pr-12 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition"
                >
                  {showPw ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-indigo-700 font-bold py-3.5 rounded-xl hover:bg-white/90 active:scale-[0.98] transition-all duration-200 disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Demo creds */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-center text-xs text-blue-200/60 mb-3 font-medium uppercase tracking-wider">
              Demo Credentials
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setUsername("admin");
                  setPassword("admin123");
                }}
                className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-3 text-left transition cursor-pointer"
              >
                <p className="text-blue-200 font-semibold text-xs">Admin</p>
                <p className="text-white/50 text-[11px] mt-0.5">admin / admin123</p>
              </button>
              <button
                type="button"
                onClick={() => {
                  setUsername("security");
                  setPassword("security123");
                }}
                className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-3 text-left transition cursor-pointer"
              >
                <p className="text-blue-200 font-semibold text-xs">Security</p>
                <p className="text-white/50 text-[11px] mt-0.5">
                  security / security123
                </p>
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-white/30 text-xs mt-6">
          © {new Date().getFullYear()} SecurePass. All rights reserved.
        </p>
      </div>
    </div>
  );
}