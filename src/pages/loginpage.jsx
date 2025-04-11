import { useState } from "react";
import { Link } from "react-router-dom";
import { FaGoogle, FaEnvelope, FaLock } from "react-icons/fa";
import "../styles/loginpage.css";
import axios from "axios";

// If the logo is inside src/assets/images/, import it:
import logo from "../assets/logo.png";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.email) {
      newErrors.email = "Email is required";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form Submitted", formData);
    }

    try {
      const response = await axios.post("/login", {
        formData,
      });
      if (response.status === 200) {
        alert("Login successfully");
      } else {
        alert("Login failed");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        {/* Logo Image */}
        <img src={logo} alt="Disbursify Logo" className="login-logo" />

        <h2 className="login-title">Login to Disbursify</h2>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label className="input-label">Email</label>
            <div className="input-wrapper">
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter your email"
              />
            </div>
            {errors.email && <p className="error-text">{errors.email}</p>}
          </div>

          <div className="input-group">
            <label className="input-label">Password</label>
            <div className="input-wrapper">
              <FaLock className="input-icon" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter your password"
              />
            </div>
            {errors.password && <p className="error-text">{errors.password}</p>}
          </div>

          <div className="forgot-password">
            <Link to="/forgotpassword" className="forgot-password-link">
              Forgot Password?
            </Link>
          </div>

          <button type="submit" className="login-btn">
            Login
          </button>
        </form>

        <p className="signup-text">
          Don't have an account?{" "}
          <Link to="/signup" className="signup-link">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
