import React, { useState } from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import "../styles/ForgotPassword.css"; // Import CSS

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle password reset logic here
    console.log("Password reset link sent to:", email);
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-box">
        <h2 className="forgot-password-title">Forgot Your Password?</h2>
        <p className="forgot-password-subtitle">
          Enter your email address to reset your password.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email" className="input-label">Email Address</label>
            <input
              type="email"
              id="email"
              className="input-field"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="reset-btn">Send Reset Link</button>
        </form>

        <p className="back-to-login">
          <Link to="/login">Back to Login</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
