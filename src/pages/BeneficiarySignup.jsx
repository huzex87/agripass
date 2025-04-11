import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FaUser,
  FaPhone,
  FaEnvelope,
  FaIdCard,
  FaMapMarkerAlt,
  FaTransgender,
  FaCalendarAlt,
} from "react-icons/fa";
import nigeriaStates from "../data/nigeria_states.json"; // Import the JSON file
import "../styles/beneficiarysignup.css";
import logo from "../assets/logo.png";
import axios from "axios";

const BeneficiarySignup = () => {
  const navigate = useNavigate(); // Initialize navigation
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    dateOfBirth: "",
    phone: "",
    email: "",
    password: "",
    idType: "",
    idNumber: "",
    state: "",
    lga: "",
  });

  const [errors, setErrors] = useState({});

  // const validateForm = () => {
  //   let valid = true;
  //   let newErrors = {};

  //   if (!formData.firstName.trim()) {
  //     newErrors.firstName = "First name is required";
  //     return (valid = false);
  //   }

  //   if (!formData.lastName.trim()) {
  //     newErrors.lastName = "Last name is required";
  //     valid = false;
  //   }

  //   if (!formData.gender) {
  //     newErrors.gender = "Please select your gender";
  //     valid = false;
  //   }

  //   if (!formData.dateOfBirth) {
  //     newErrors.dateOfBirth = "Date of birth is required";
  //     valid = false;
  //   }

  //   if (!formData.phone.match(/^\d{11}$/)) {
  //     newErrors.phone = "Phone number must be 11 digits";
  //     valid = false;
  //   }

  //   if (!formData.email.match(/^\S+@\S+\.\S+$/)) {
  //     newErrors.email = "Enter a valid email address";
  //     valid = false;
  //   }

  //   if (!formData.nin.match(/^\d{11}$/)) {
  //     newErrors.nin = "NIN must be exactly 11 digits";
  //     valid = false;
  //   }

  //   if (!formData.state) {
  //     newErrors.state = "Please select your state";
  //     valid = false;
  //   }

  //   if (!formData.lga) {
  //     newErrors.lga = "Please select your LGA";
  //     valid = false;
  //   }

  //   if (!formData.ward.trim()) {
  //     newErrors.ward = "Ward is required";
  //     valid = false;
  //   }

  //   setErrors(newErrors);
  //   return valid;
  // };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone" || name === "nin") {
      if (/^\d*$/.test(value) && value.length <= 11) {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        ...(name === "state" && { lga: "" }),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form Submitted Successfully", formData);
      navigate("/beneficiary-login"); // Navigate to the login page after submission
    } else {
      console.log("Form has errors, not submitted");
    }

    try {
      const response = await axios.post();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="beneficiary-signup">
      <div className="form-container">
        <img src={logo} alt="Disbursify Logo" className="login-logo" />
        <h2 className="form-title">Beneficiary Sign Up</h2>
        <form onSubmit={handleSubmit} className="form-content">
          <div className="input-group">
            <FaUser className="input-icon" />
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
            {errors.firstName && <p className="error">{errors.firstName}</p>}
          </div>

          <div className="input-group">
            <FaUser className="input-icon" />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
            {errors.lastName && <p className="error">{errors.lastName}</p>}
          </div>

          <div className="input-group">
            <FaTransgender className="input-icon" />
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="Other">Other</option>
            </select>
            {errors.gender && <p className="error">{errors.gender}</p>}
          </div>

          <div className="input-group">
            <FaCalendarAlt className="input-icon" />
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              required
            />
            {errors.dateOfBirth && (
              <p className="error">{errors.dateOfBirth}</p>
            )}
          </div>

          <div className="input-group">
            <FaPhone className="input-icon" />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            {errors.phone && <p className="error">{errors.phone}</p>}
          </div>

          <div className="input-group">
            <FaEnvelope className="input-icon" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {errors.email && <p className="error">{errors.email}</p>}
          </div>

          <div className="input-group">
            <select name="" id="">
              <option value="national_id">National Id Card</option>
            </select>
          </div>

          <div className="input-group">
            <FaIdCard className="input-icon" />
            <input
              type="number"
              name="nin"
              placeholder="NIN"
              value={formData.nin}
              onChange={handleChange}
              maxLength={11}
              required
            />
            {errors.nin && <p className="error">{errors.nin}</p>}
          </div>

          <div className="input-group">
            <FaMapMarkerAlt className="input-icon" />
            <select name="state" value={formData.state} onChange={handleChange}>
              <option value="">Select State</option>
              {nigeriaStates.map((stateData) => (
                <option key={stateData.state} value={stateData.state}>
                  {stateData.state}
                </option>
              ))}
            </select>
            {errors.state && <p className="error">{errors.state}</p>}
          </div>
          {/* LGA Dropdown */}
          <div className="input-group">
            <FaMapMarkerAlt className="input-icon" />
            <select
              name="lga"
              value={formData.lga}
              onChange={handleChange}
              disabled={!formData.state}
            >
              <option value="">Select LGA</option>
              {nigeriaStates
                .find((stateData) => stateData.state === formData.state)
                ?.lgas.map((lga) => (
                  <option key={lga} value={lga}>
                    {lga}
                  </option>
                ))}
            </select>
            {errors.lga && <p className="error">{errors.lga}</p>}
          </div>

          <button type="submit" className="submit-button">
            Sign Up
          </button>
        </form>

        <p className="login-link">
          Already have an account?{" "}
          <Link to="/beneficiarylogin">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default BeneficiarySignup;
