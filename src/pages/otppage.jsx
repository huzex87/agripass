import { useState } from "react";

const OtpPage = () => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [message, setMessage] = useState("");
  const [resendMessage, setResendMessage] = useState("");

  const handleChange = (index, value) => {
    if (/^\d*$/.test(value) && value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 3) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (otp.join("").length !== 4) {
      setMessage("Please enter the 4-digit OTP.");
    } else {
      setMessage("OTP verified successfully!");
      // Handle OTP verification logic here
    }
  };

  const handleResendOTP = () => {
    setResendMessage("A new OTP has been sent to your email.");

    // Hide the message after 3 seconds
    setTimeout(() => {
      setResendMessage("");
    }, 3000);
  };

  return (
    <div className="otp-container">
      <div className="otp-box">
        <h2 className="otp-title">Enter OTP</h2>
        <p className="otp-info-text">A 4-digit code has been sent to your email.</p>

        <form onSubmit={handleSubmit} className="otp-form">
          <div className="otp-input-group">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                className="otp-input"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                maxLength="1"
              />
            ))}
          </div>

          {message && <p className="otp-info-text">{message}</p>}

          <button type="submit" className="otp-btn">Verify OTP</button>
        </form>

        <p className="otp-resend-text">
          Didn't receive the code?{" "}
          <button onClick={handleResendOTP} className="otp-link">Resend OTP</button>
        </p>

        {/* Show the resend message when button is clicked */}
        {resendMessage && <p className="otp-success-message">{resendMessage}</p>}
      </div>
    </div>
  );
};

export default OtpPage;
