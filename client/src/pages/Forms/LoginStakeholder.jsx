import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAuthentication } from "../../utils/Auth";
import { Loader2, Leaf, Shield, User, Lock, Mail, Globe } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import navLogo from "../../assets/navlogo.jpg";
import { toast } from "sonner";
import image2 from "../../assets/image2.png";
import { motion } from "framer-motion";
import { fadeIn, textVariant } from "../../constants/motion";

const LoginStakeholder = () => {
  const [loginType, setLoginType] = useState("organization"); // "organization" or "beneficiary"
  const [loading, setLoading] = useState(false);
  const { login } = useAuthentication();
  const navigate = useNavigate();
  const location = useLocation();

  const loginSchema = yup.object().shape({
    subdomain: loginType === "organization"
      ? yup.string().required("Please enter a valid subdomain")
      : yup.string().notRequired(),
    email: loginType === "beneficiary"
      ? yup.string().email("Invalid email").required("Email is required")
      : yup.string().notRequired(),
    password: yup.string().required("Password is required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const from = location.state?.from?.pathname || "/dashboard";

  const handleTypeChange = (type) => {
    setLoginType(type);
    reset(); // Clear validation errors and values
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (loginType === "organization") {
        const result = await login(data.subdomain, data.password);
        if (result.success) {
          toast.success("Login Successful", {
            description: `Welcome back to ${data.subdomain}`,
          });
          if (from && from !== "/dashboard") {
            navigate(from, { replace: true });
          } else {
            navigate(`/${data.subdomain}/dashboard`);
          }
        } else {
          toast.error("Login Failed", {
            description: result.error,
          });
        }
      } else {
        // Farmer Beneficiary Login
        toast.success("Login Successful", {
          description: `Welcome back Sani Abubakar`,
        });

        const mockUser = {
          isAuthenticated: true,
          email: data.email,
          role: "beneficiary",
        };
        sessionStorage.setItem("subdomain", "beneficiary");
        sessionStorage.setItem("mock_user", JSON.stringify(mockUser));

        // Use custom window reload/replace or navigation to projects page
        window.location.replace("/projects");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login Failed", {
        description: "Something went wrong, please try again",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <motion.div
        className="relative min-h-svh bg-slate-950 flex items-center justify-center p-4 md:p-10 select-none overflow-hidden"
        variants={fadeIn("right", 0.2)}
        initial="hidden"
        whileInView="show"
      >
        {/* Background Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10 pointer-events-none"
          style={{ backgroundImage: `url(${image2})` }}
        ></div>

        <div className="w-full max-w-sm md:max-w-4xl relative z-10">
          <Card className="overflow-hidden bg-slate-900 border-slate-800 shadow-2xl rounded-3xl">
            <CardContent className="grid p-0 md:grid-cols-2">
              
              {/* Form Side */}
              <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-10 flex flex-col justify-center">
                <div className="space-y-6">
                  
                  {/* Header Title */}
                  <div className="text-center md:text-left">
                    <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center justify-center md:justify-start gap-1.5">
                      <Leaf className="text-emerald-500" size={24} /> AgriPass Login
                    </h1>
                    <p className="text-xs text-slate-400 mt-1">Select your access portal below</p>
                  </div>

                  {/* Toggle Selector Segment */}
                  <div className="flex p-1 bg-slate-950 rounded-xl border border-slate-800">
                    <button
                      type="button"
                      onClick={() => handleTypeChange("organization")}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                        loginType === "organization"
                          ? "bg-emerald-600 text-white shadow"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      <Shield size={13} />
                      Cooperative
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTypeChange("beneficiary")}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                        loginType === "beneficiary"
                          ? "bg-emerald-600 text-white shadow"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      <User size={13} />
                      Farmer Portal
                    </button>
                  </div>

                  {/* Conditional inputs */}
                  {loginType === "organization" ? (
                    <div className="space-y-2">
                      <Label htmlFor="subdomain" className="text-xs font-bold text-slate-300 flex items-center gap-1">
                        <Globe size={13} className="text-emerald-500" /> Subdomain
                      </Label>
                      <Input
                        id="subdomain"
                        type="text"
                        placeholder="e.g. katsina-agro"
                        {...register("subdomain")}
                        className={`bg-slate-950 border-slate-800 focus:border-emerald-500 focus:ring-emerald-500 text-white text-xs ${
                          errors.subdomain ? "border-red-500" : ""
                        }`}
                      />
                      {errors.subdomain && (
                        <p className="text-[10px] text-red-500 mt-1">{errors.subdomain.message}</p>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-xs font-bold text-slate-300 flex items-center gap-1">
                        <Mail size={13} className="text-emerald-500" /> Registered Email
                      </Label>
                      <Input
                        id="email"
                        type="text"
                        placeholder="e.g. sani.abubakar@gmail.com"
                        {...register("email")}
                        className={`bg-slate-950 border-slate-800 focus:border-emerald-500 focus:ring-emerald-500 text-white text-xs ${
                          errors.email ? "border-red-500" : ""
                        }`}
                      />
                      {errors.email && (
                        <p className="text-[10px] text-red-500 mt-1">{errors.email.message}</p>
                      )}
                    </div>
                  )}

                  {/* Password Input */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="password" className="text-xs font-bold text-slate-300 flex items-center gap-1">
                        <Lock size={13} className="text-emerald-500" /> Password
                      </Label>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      {...register("password")}
                      className={`bg-slate-950 border-slate-800 focus:border-emerald-500 focus:ring-emerald-500 text-white text-xs ${
                        errors.password ? "border-red-500" : ""
                      }`}
                    />
                    {errors.password && (
                      <p className="text-[10px] text-red-500 mt-1">{errors.password.message}</p>
                    )}
                  </div>

                  {/* Submission */}
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/10 cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin h-4 w-4" />
                        Authenticating...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>

                  {/* Sign Up Link for Cooperatives */}
                  {loginType === "organization" && (
                    <p className="text-center text-[11px] text-slate-400">
                      Want to enroll your cooperative?{" "}
                      <Link to="/create_deployment" className="text-emerald-500 underline font-semibold">
                        Sign up here
                      </Link>
                    </p>
                  )}

                </div>
              </form>

              {/* Banner Branding Side */}
              <div className="relative hidden md:flex bg-slate-950 items-center justify-center p-8 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 to-teal-950/20 pointer-events-none z-10" />
                <img
                  src={navLogo}
                  alt="Branding Logo"
                  className="absolute inset-0 h-full w-full object-cover opacity-20"
                />
                <div className="relative z-20 text-center space-y-4 max-w-xs text-white">
                  <h3 className="text-2xl font-extrabold tracking-tight">Standardized Input Disbursement</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Connecting agricultural cooperatives, smallholder farms, and verification warehouses in one single ledger.
                  </p>
                </div>
              </div>

            </CardContent>
          </Card>
        </div>
      </motion.div>
    </>
  );
};

export default LoginStakeholder;
