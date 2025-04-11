import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";
import "../styles/beneficiaryLogin.css";
import logo from "../assets/logo.png";
import axios from "axios";

const BeneficiaryLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { email, password } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!email.trim()) newErrors.email = "Email is required";
    if (!password.trim()) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      const response = await axios.post(
        "/disbursify/beneficairy/login",
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("Response:", response);
      const { token } = response.data;
      localStorage.setItem("token", token);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      alert(error?.response?.data?.error || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="beneficiary-login-container">
      <div className="beneficiary-login-box">
        <img
          src={logo}
          alt="Disbursify Logo"
          className="beneficiary-login-logo"
        />
        <h2 className="beneficiary-login-title">Beneficiary Login</h2>

        <form onSubmit={handleSubmit} className="beneficiary-login-form">
          <div className="beneficiary-input-group">
            <label className="beneficiary-input-label">Email</label>
            <div className="beneficiary-input-wrapper">
              <FaEnvelope className="beneficiary-input-icon" />
              <input
                type="email"
                name="email"
                value={email}
                onChange={handleChange}
                className="beneficiary-input-field"
                placeholder="Enter your email"
                required
              />
            </div>
            {errors.email && (
              <p className="beneficiary-error-text">{errors.email}</p>
            )}
          </div>

          <div className="beneficiary-input-group">
            <label className="beneficiary-input-label">Password</label>
            <div className="beneficiary-input-wrapper">
              <FaLock className="beneficiary-input-icon" />
              <input
                type="password"
                name="password"
                value={password}
                onChange={handleChange}
                className="beneficiary-input-field"
                placeholder="Enter your password"
                required
              />
            </div>
            {errors.password && (
              <p className="beneficiary-error-text">{errors.password}</p>
            )}
          </div>

          <div className="beneficiary-forgot-password">
            <Link
              to="/forgotpassword"
              className="beneficiary-forgot-password-link"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            className="beneficiary-login-btn"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="beneficiary-signup-text">
          Don't have an account?{" "}
          <Link to="/beneficiarysignup" className="beneficiary-signup-link">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default BeneficiaryLogin;
