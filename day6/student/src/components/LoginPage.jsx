import { useState } from "react";
import { FaUniversity } from "react-icons/fa";

function LoginPage({ onLogin, collegeName }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === "admin" && password === "admin") {
      onLogin();
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <div className="logo-emoji" style={{ color: "var(--accent-blue)" }}>
            <FaUniversity />
          </div>
          <h1>{collegeName}</h1>
          <p>Student ERP System</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {error && <div className="login-error">{error}</div>}

          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              placeholder="Enter admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter admin"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group-radio" style={{ marginTop: '-4px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'rgba(255,255,255,0.7)', fontSize: '14px', textTransform: 'none' }}>
              <input 
                type="checkbox" 
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: 'var(--accent-blue)' }} 
              />
              Remember Me
            </label>
          </div>

          <button type="submit" className="login-btn">
            Login to Dashboard
          </button>
        </form>

        <div className="login-hint">
          Demo Credentials: admin / admin
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
