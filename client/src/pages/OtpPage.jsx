import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import api from "../utils/Api";

const OtpPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const email = searchParams.get("email") || "";
  const role = searchParams.get("role") || "beneficiary";

  const [otp, setOtp] = useState(["", "", "", ""]);
  const [message, setMessage] = useState("");
  const [resendMessage, setResendMessage] = useState("");
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    if (otp.join("").length !== 4) {
      setMessage("Please enter the 4-digit code.");
      return;
    }
    if (!email) {
      setMessage("Missing email — please restart the password reset process.");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/api/v1/verify-reset-otp", {
        email,
        otp: otp.join(""),
      });
      const resetToken = response.data?.resetToken;
      if (resetToken) {
        navigate(`/reset-password?token=${encodeURIComponent(resetToken)}`);
      }
    } catch (error) {
      setMessage(error.response?.data?.error || "Invalid or expired verification code.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!email) return;
    try {
      await api.post("/api/v1/forgot-password", { email, role });
      setResendMessage("A new verification code has been sent to your email.");
    } catch (error) {
      setResendMessage("Failed to resend code. Please try again.");
    } finally {
      setTimeout(() => {
        setResendMessage("");
      }, 3000);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 dark:bg-slate-950 sm:px-6 lg:px-8 transition-colors">
      <div className="w-full max-w-md space-y-8 bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 transition-colors">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Enter Verification Code
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            A 4-digit verification code has been sent to {email ? <strong>{email}</strong> : "your email"}.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="flex justify-center gap-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                className="w-14 h-14 text-center text-2xl font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                maxLength="1"
              />
            ))}
          </div>

          {message && (
            <p className="text-center text-sm font-medium text-red-500">{message}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl text-white font-medium bg-blue-600 hover:bg-blue-500 dark:bg-blue-600 dark:hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all shadow-md shadow-blue-500/10 hover:shadow-lg hover:shadow-blue-500/25 disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify Code"}
          </button>
        </form>

        <div className="text-center mt-6 space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Didn&apos;t receive the code?{" "}
            <button
              onClick={handleResendOTP}
              className="font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 focus:outline-none"
            >
              Resend Code
            </button>
          </p>

          {resendMessage && (
            <p className="text-sm text-green-600 dark:text-green-400 font-medium">
              {resendMessage}
            </p>
          )}

          <div className="pt-2">
            <Link
              to="/signin"
              className="text-sm font-semibold text-slate-500 hover:text-slate-400 dark:text-slate-400 dark:hover:text-slate-300"
            >
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtpPage;
