import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const EyeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const EyeOffIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

const ShieldIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      const success = await login(username, password);
      if (success) {
        // Redirect based on user role
        if (user?.role === 'superadmin') {
          navigate("/admin");
        } else if (user?.role === 'admin') {
          navigate("/dashboard");
        } else if (user?.role === 'security') {
          navigate("/dashboard");
        } else {
          navigate("/dashboard");
        }
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } catch (error) {
      setError("Login failed. Please try again.");
    }
    
    setLoading(false);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=EB+Garamond:ital,wght@0,400;0,500;1,400&family=DM+Sans:wght@300;400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .root {
          min-height: 100vh;
          background: linear-gradient(135deg, #0f172a 0%, #064e3b 45%, #065f46 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          position: relative;
          overflow: hidden;
          font-family: 'DM Sans', sans-serif;
        }

        .root::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 30% 20%, rgba(255,255,255,0.15), transparent 40%);
          pointer-events: none;
        }
        .root::after {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 70% 80%, rgba(255,255,255,0.08), transparent 40%);
          pointer-events: none;
        }

        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.18;
          pointer-events: none;
        }
        .orb-1 { width: 320px; height: 320px; background: #a5b4fc; top: -80px; right: -60px; }
        .orb-2 { width: 280px; height: 280px; background: #c4b5fd; bottom: -60px; left: -60px; }

        .wrapper {
          position: relative;
          width: 100%;
          max-width: 420px;
          animation: slideUp 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .card {
          background: #fefcf8;
          border: 1px solid #e8e0d0;
          border-radius: 6px;
          box-shadow:
            0 2px 4px rgba(0,0,0,0.04),
            0 8px 24px rgba(0,0,0,0.10),
            0 32px 64px rgba(0,0,0,0.12),
            inset 0 1px 0 rgba(255,255,255,0.9);
          overflow: hidden;
        }

        .card-header {
          background: #1e3a6e;
          padding: 28px 36px 26px;
          text-align: center;
          position: relative;
          border-bottom: 3px solid #c9a84c;
        }

        .card-header::after {
          content: '';
          position: absolute;
          bottom: -6px;
          left: 50%;
          transform: translateX(-50%);
          width: 60px;
          height: 3px;
          background: #f5d78e;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          background: transparent;
          border: 1.5px solid rgba(201,168,76,0.6);
          border-radius: 50%;
          margin-bottom: 14px;
          color: #c9a84c;
        }

        .brand-name {
          font-family: 'Playfair Display', serif;
          font-size: 22px;
          font-weight: 600;
          color: #f0e9d8;
          letter-spacing: 0.04em;
          line-height: 1;
        }

        .brand-sub {
          font-family: 'EB Garamond', serif;
          font-style: italic;
          font-size: 12.5px;
          color: rgba(201,168,76,0.85);
          margin-top: 5px;
          letter-spacing: 0.06em;
        }

        .ornament {
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 16px auto 0;
          width: fit-content;
        }
        .ornament-line {
          width: 32px;
          height: 1px;
          background: rgba(201,168,76,0.4);
        }
        .ornament-diamond {
          width: 5px;
          height: 5px;
          background: rgba(201,168,76,0.7);
          transform: rotate(45deg);
        }

        .card-body {
          padding: 32px 36px 36px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-label {
          display: block;
          font-size: 10.5px;
          font-weight: 500;
          color: #5a4f3f;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin-bottom: 7px;
          font-family: 'DM Sans', sans-serif;
        }

        .input-wrap {
          position: relative;
        }

        .input-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #9e8f7a;
          pointer-events: none;
        }

        .input-field {
          width: 100%;
          background: #faf7f2;
          border: 1px solid #d4c9b8;
          border-radius: 3px;
          padding: 11px 12px 11px 36px;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          color: #2a1f0e;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
          outline: none;
          letter-spacing: 0.01em;
        }

        .input-field::placeholder {
          color: #b8ad9e;
          font-style: italic;
          font-family: 'EB Garamond', serif;
          font-size: 13.5px;
        }

        .input-field:focus {
          border-color: #1e3a6e;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(30,58,110,0.08), inset 0 1px 2px rgba(0,0,0,0.04);
        }

        .pw-toggle {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #9e8f7a;
          padding: 2px;
          line-height: 0;
          transition: color 0.15s;
        }
        .pw-toggle:hover { color: #1e3a6e; }

        .error-box {
          background: #fef2f2;
          border: 1px solid #fca5a5;
          border-left: 3px solid #dc2626;
          color: #991b1b;
          padding: 10px 14px;
          border-radius: 3px;
          font-size: 13px;
          margin-bottom: 20px;
          font-family: 'EB Garamond', serif;
          font-style: italic;
        }

        .divider {
          border: none;
          border-top: 1px solid #e4ddd0;
          margin: 24px 0;
        }

        .submit-btn {
          width: 100%;
          background: #1e3a6e;
          color: #f0e9d8;
          border: none;
          border-radius: 3px;
          padding: 13px;
          font-family: 'Playfair Display', serif;
          font-size: 14.5px;
          font-weight: 500;
          letter-spacing: 0.08em;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: background 0.2s, transform 0.1s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border-bottom: 2px solid rgba(201,168,76,0.4);
        }

        .submit-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(255,255,255,0.06) 0%, transparent 100%);
        }

        .submit-btn:hover:not(:disabled) {
          background: #243f7a;
        }

        .submit-btn:active:not(:disabled) {
          transform: translateY(1px);
        }

        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(240,233,216,0.4);
          border-top-color: #f0e9d8;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        .arrow-icon {
          font-size: 16px;
          line-height: 1;
        }

        .footer {
          text-align: center;
          font-size: 11px;
          color: rgba(255,255,255,0.35);
          margin-top: 20px;
          font-family: 'EB Garamond', serif;
          font-style: italic;
          letter-spacing: 0.04em;
        }
      `}</style>

      <div className="root">
        <div className="orb orb-1" />
        <div className="orb orb-2" />

        <div className="wrapper">
          <div className="card">

            {/* Classic header */}
            <div className="card-header">
              <div className="badge">
                <ShieldIcon />
              </div>
              <div className="brand-name">SecurePass</div>
              <div className="brand-sub">Visitor &amp; Access Control</div>
              <div className="ornament">
                <div className="ornament-line" />
                <div className="ornament-diamond" />
                <div className="ornament-line" />
              </div>
            </div>

            {/* Form body */}
            <div className="card-body">

              {error && <div className="error-box">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Username</label>
                  <div className="input-wrap">
                    <span className="input-icon">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                      </svg>
                    </span>
                    <input
                      type="text"
                      className="input-field"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter your username"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Password</label>
                  <div className="input-wrap">
                    <span className="input-icon">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                      </svg>
                    </span>
                    <input
                      type={showPw ? "text" : "password"}
                      className="input-field"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                      style={{ paddingRight: "40px" }}
                    />
                    <button type="button" className="pw-toggle" onClick={() => setShowPw(p => !p)}>
                      {showPw ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                </div>

                <hr className="divider" />

                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? (
                    <div className="spinner" />
                  ) : (
                    <>
                      Sign In
                      <span className="arrow-icon">→</span>
                    </>
                  )}
                </button>
              </form>
            </div>

          </div>

          <p className="footer"> {new Date().getFullYear()} SecurePass — All rights reserved</p>
        </div>
      </div>
    </>
  );
}