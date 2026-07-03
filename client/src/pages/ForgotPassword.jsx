import React, { useState } from "react";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    console.log("Password reset link sent to:", email);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 dark:bg-slate-950 sm:px-6 lg:px-8 transition-colors">
      <div className="w-full max-w-md space-y-8 bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 transition-colors">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Forgot Your Password?
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
            Enter your email address to reset your password.
          </p>
        </div>

        {sent ? (
          <div className="rounded-xl bg-green-50 dark:bg-green-950/20 p-4 border border-green-200 dark:border-green-800/30">
            <div className="text-sm font-medium text-green-800 dark:text-green-400 text-center">
              A password reset link has been sent to <span className="font-semibold">{email}</span>. Please check your inbox.
            </div>
            <div className="mt-6 text-center">
              <Link
                to="/signin"
                className="text-sm font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Back to Sign In
              </Link>
            </div>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl text-white font-medium bg-blue-600 hover:bg-blue-500 dark:bg-blue-600 dark:hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all shadow-md shadow-blue-500/10 hover:shadow-lg hover:shadow-blue-500/25"
            >
              Send Reset Link
            </button>

            <div className="text-center mt-4">
              <Link
                to="/signin"
                className="text-sm font-semibold text-slate-600 hover:text-slate-500 dark:text-slate-400 dark:hover:text-slate-300"
              >
                Back to Sign In
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
