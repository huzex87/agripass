import { useState } from "react";
import {
  FaBuilding,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaIdCard,
} from "react-icons/fa";
import "../styles/signuppage.css"; // Import signup styles
import logo from "../assets/logo.png"; // Import Disbursify logo

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.organizationName)
      newErrors.organizationName = "Organization Name is required";
    if (!formData.organizationType)
      newErrors.organizationType = "Organization Type is required";
    if (!formData.registrationNumber)
      newErrors.registrationNumber = "Registration Number is required";
    if (!formData.contactPerson)
      newErrors.contactPerson = "Contact Person Name is required";
    if (!formData.phone) newErrors.phone = "Phone Number is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    if (!formData.agreeToTerms)
      newErrors.agreeToTerms = "You must agree to the terms";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Signup Successful", formData);
    }

    try {
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        {/* Logo */}
        <div className="logo-container">
          <img src={logo} alt="Disbursify Logo" className="signup-logo" />
        </div>

        <h2 className="signup-title">Create New Deployment</h2>
        <form onSubmit={handleSubmit} className="signup-form">
          {/* Organization Name */}
          <div className="input-group">
            <label className="input-label"> Deployment Name</label>
            <div className="input-wrapper">
              <FaBuilding className="input-icon" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input-field"
                placeholder="Deployment Name"
              />
            </div>
            {errors.organizationName && (
              <p className="error-text">{errors.organizationName}</p>
            )}
          </div>

          {/* Registration Number
          <div className="input-group">
            <label className="input-label">Registration Number</label>
            <div className="input-wrapper">
              <FaIdCard className="input-icon" />
              <input
                type="text"
                name="registrationNumber"
                value={formData.registrationNumber}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter CAC"
              />
            </div>
            {errors.registrationNumber && (
              <p className="error-text">{errors.registrationNumber}</p>
            )}
          </div> */}

          {/* Email */}
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
                placeholder="Enter email"
              />
            </div>
            {errors.email && <p className="error-text">{errors.email}</p>}
          </div>

          {/* Phone Number */}
          <div className="input-group">
            <label className="input-label">Phone Number</label>
            <div className="input-wrapper">
              <FaPhone className="input-icon" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter phone number"
              />
            </div>
            {errors.phone && <p className="error-text">{errors.phone}</p>}
          </div>

          {/* Password */}
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
                placeholder="Create a password"
              />
            </div>
            {errors.password && <p className="error-text">{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div className="input-group">
            <label className="input-label">Confirm Password</label>
            <div className="input-wrapper">
              <FaLock className="input-icon" />
              <input
                type="password"
                name="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="input-field"
                placeholder="Confirm password"
              />
            </div>
            {errors.password && <p className="error-text">{errors.password}</p>}
          </div>

          {/* Terms and Conditions */}
          <div className="terms-container">
            <input
              type="checkbox"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleChange}
              className="checkbox"
            />
            <label className="terms-text">
              I agree to the <a href="/terms">Terms & Conditions</a>
            </label>
          </div>
          {errors.agreeToTerms && (
            <p className="error-text">{errors.agreeToTerms}</p>
          )}

          {/* Signup Button */}
          <button type="submit" className="signup-btn" disabled={loading}>
            {loading ? "Please wait..." : "Sign up"}
          </button>
        </form>

        <p className="signup-text">
          Already have an account?{" "}
          <a href="/login" className="signup-link">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
