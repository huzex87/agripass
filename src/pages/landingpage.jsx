import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaPhone,
  FaEnvelope,
  FaCheckCircle,
  FaFingerprint,
  FaMapMarkerAlt,
  FaKey,
  FaWallet,
  FaSearch,
  FaUserPlus,
} from "react-icons/fa";
import logo from "../assets/logo.png";
import "../styles/LandingPage.css";
import NavbarMUI from "./Navbar/NavbarMUI";
import { Button, Box } from "@mui/material";
import Button1 from "./components/Button1";

const LandingPage = () => {
  return (
    <div className="landing-page">
      <NavbarMUI />

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Efficient & Transparent Resource Disbursement</h1>
          <p>
            Secure, data-driven solutions for equitable allocation and
            disbursements of funds and resources.
          </p>
          <div className="hero-buttons">
            <Button
              variant="outlined"
              component={Link}
              to={"/beneficiarySignup"}
              sx={{
                borderColor: "#ff9900",
                marginRight: 2,
                color: "white",
                "&:hover": {
                  backgroundColor: "#ff9900",
                  color: "white",
                },
              }}
            >
              <FaUserPlus className="button-icon" /> Sign Up
            </Button>
            <Button1
              component={Link}
              to={"/beneficiaryLogin"}
              label={"Sign In"}
              sx={{
                backgroundColor: "#FD8A2E",
                color: "black",
              }}
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2> Key Features</h2>
        <div className="feature-cards">
          <div className="feature-card">
            <FaCheckCircle className="feature-icon" />
            <h3>Data Collection</h3>
            <p>Customizable forms for efficient data entry.</p>
          </div>
          <div className="feature-card">
            <FaFingerprint className="feature-icon" />
            <h3>Verification Mechanism</h3>
            <p>Biometric and ID verification for authenticity.</p>
          </div>
          <div className="feature-card">
            <FaKey className="feature-icon" />
            <h3>Unique Token Generation</h3>
            <p>Personalized tokens for secure verification.</p>
          </div>
          <div className="feature-card">
            <FaWallet className="feature-icon" />
            <h3>Resource Disbursement</h3>
            <p>Seamless allocation upon successful verification.</p>
          </div>
          <div className="feature-card">
            <FaMapMarkerAlt className="feature-icon" />
            <h3>Geotagging for Monitoring</h3>
            <p>Capture geo-coordinates for effective tracking.</p>
          </div>
        </div>
      </section>

      <div className="news-ticker">
        <marquee behavior="scroll" direction="left">
          Latest Update: Disbursify launches new biometric verification system!
          &nbsp; | &nbsp; Government partners with Disbursify for digital
          resource distribution! &nbsp; | &nbsp; Secure & transparent
          transactions with Disbursify's blockchain integration!
        </marquee>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section about">
            <h2>About Disbursify</h2>
            <p>
              Disbursify is an innovative, comprehensive platform designed to
              streamline data collection, verification, and disbursement of
              resources for government and non-governmental organisations
              (NGOs).
            </p>
          </div>
          <div className="footer-section links">
            <h2>Quick Links</h2>
            <ul>
              <li>
                <a href="#">Home</a>
              </li>
              <li>
                <a href="#">About</a>
              </li>
              <li>
                <a href="#">Services</a>
              </li>
              <li>
                <a href="#">Resources</a>
              </li>
              <li>
                <a href="#">Contact</a>
              </li>
            </ul>
          </div>
          <div className="footer-section contact">
            <h2>Contact Us</h2>
            <p>
              <FaPhone /> +234 123 456 7890
            </p>
            <p>
              <FaEnvelope /> info@disbursify.com
            </p>
            <div className="socials">
              <a href="#">
                <FaFacebook />
              </a>
              <a href="#">
                <FaTwitter />
              </a>
              <a href="#">
                <FaLinkedin />
              </a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          &copy; {new Date().getFullYear()} Disbursify. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
