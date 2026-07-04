import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Leaf, Loader2, Warehouse, Mail, Lock } from "lucide-react";
import { toast } from "sonner";
import { useAuthentication } from "../../utils/Auth";

const CenterLogin = () => {
  const { loginCenter } = useAuthentication();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Email and password are required");
      return;
    }
    setLoading(true);
    try {
      const result = await loginCenter(email, password);
      if (result.success) {
        toast.success("Login Successful", { description: "Welcome to your redemption center" });
        navigate("/center/dashboard");
      } else {
        toast.error("Login Failed", { description: result.error });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-svh place-items-center bg-slate-950 p-4">
      <div className="w-full max-w-sm rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">
        <Link to="/" className="mb-6 flex items-center justify-center gap-2">
          <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/20 p-1.5 text-emerald-400">
            <Leaf size={16} />
          </div>
          <div>
            <span className="text-sm font-extrabold uppercase tracking-wider text-white">AgriPass</span>
            <span className="block text-[6px] uppercase tracking-widest text-emerald-400">Redemption Center</span>
          </div>
        </Link>

        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white">
            <Warehouse size={22} />
          </div>
          <h1 className="text-xl font-extrabold text-white">Center Sign In</h1>
          <p className="text-xs text-slate-400">Access your farmers and redeem input vouchers</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="flex items-center gap-1 text-xs font-bold text-slate-300">
              <Mail size={13} className="text-emerald-500" /> Center Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="center@cooperative.org"
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>
          <div className="space-y-1.5">
            <label className="flex items-center gap-1 text-xs font-bold text-slate-300">
              <Lock size={13} className="text-emerald-500" /> Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 font-bold text-white transition-all hover:bg-emerald-500 disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Signing in…
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <p className="mt-5 text-center text-[11px] text-slate-400">
          Not a center?{" "}
          <Link to="/signin" className="font-semibold text-emerald-500 underline">
            Cooperative / Farmer login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default CenterLogin;
