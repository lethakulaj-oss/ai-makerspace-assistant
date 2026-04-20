import { useState } from "react";
import ualbanyLogo from "./AI_Plus___UAlbany_RGB.png";

// Role is determined by email prefix — any @albany.edu address is accepted
// Emails containing "admin" get Admin role, everything else gets Student
const getRoleFromEmail = (email) => {
  const local = email.split("@")[0].toLowerCase();
  return local.includes("admin") ? "Admin" : "Student";
};

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!email.toLowerCase().endsWith("@albany.edu")) {
      setError("Please use your UAlbany email address (@albany.edu).");
      return;
    }

    if (password.length < 4) {
      setError("Password must be at least 4 characters.");
      return;
    }

    const role = getRoleFromEmail(email);
    const name = email.split("@")[0];
    onLogin({ email, role, name });
  };

  return (
    <div className="login-shell">
      <div className="login-card">
        <img src={ualbanyLogo} alt="UAlbany" className="login-logo" />
        <h2>AI Makerspace Portal</h2>
        <p className="login-sub">Sign in with your UAlbany account</p>

        <form onSubmit={handleSubmit} className="login-form">
          <label>
            <span>University Email</span>
            <input
              type="email"
              placeholder="yourname@albany.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label>
            <span>Password</span>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          {error && <p className="login-error">{error}</p>}

          <button type="submit" className="primary-button" style={{ width: "100%", justifyContent: "center" }}>
            Sign In
          </button>
        </form>

        <p className="login-hint">
          Sign in with your UAlbany email. Emails with "admin" in the username get Admin access, all others get Student access.
        </p>
      </div>
    </div>
  );
}
