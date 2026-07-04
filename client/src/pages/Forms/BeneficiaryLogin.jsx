import React, { useState } from "react";
import * as yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Leaf } from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";
import { useAuthentication } from "../../utils/Auth";

const BeneficiaryLogin = () => {
  const loginSchema = yup.object().shape({
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup.string().required("Password is required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const { login } = useAuthentication();

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const result = await login(data.email, data.password, true);
      if (result.success) {
        toast.success("Login Successful", {
          description: "Welcome back to your AgriPass Farmer Portal",
        });
        navigate("/projects");
      } else {
        toast.error("Login Failed", {
          description: result.error,
        });
      }
    } catch (error) {
      console.error("Error during login:", error);
      toast.error("Login failed", {
        description: "An error occurred. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="grid min-h-svh lg:grid-cols-2">
        {/* Login Form */}
        <div className="flex flex-col gap-4 p-6 md:p-10">
          <div className="flex justify-center md:justify-start">
            <Link to="/" className="flex items-center gap-2">
              <div className="p-1.5 bg-emerald-500/20 rounded-lg text-emerald-400 border border-emerald-500/30">
                <Leaf size={16} />
              </div>
              <div>
                <span className="font-extrabold text-sm text-white tracking-wider uppercase">AgriPass</span>
                <span className="block text-[6px] uppercase tracking-widest text-emerald-400">Agricultural Ledger</span>
              </div>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-xs">
              <form
                action=""
                className="flex flex-col gap-6"
                onSubmit={handleSubmit(onSubmit)}
              >
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">Welcome Back</h1>
                  <p>Login into your account</p>
                </div>
                <div className="flex flex-col gap-4 justify-center">
                  <Label htmlFor="email">
                    Enter your registered email addresss
                  </Label>
                  <Input
                    id="name"
                    type="email"
                    placeholder="example@gmail.com"
                    className=""
                    {...register("email")}
                  />
                  {errors.email?.message && (
                    <p className="text-red-500 text-sm">
                      {errors.email?.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-4 justify-center">
                  <Label htmlFor="password">Enter your password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="example@gmail.com"
                    className=""
                    {...register("password")}
                  />
                  {errors.password?.message && (
                    <p className="text-red-500 text-sm">
                      {errors.password?.message}
                    </p>
                  )}
                </div>
                <div>
                  <Button
                    className="w-full bg-blue-600 text-white hover:bg-blue-700"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Please wait...
                      </>
                    ) : (
                      "Login"
                    )}
                  </Button>
                </div>
                <div className="flex flex-col items-center text-center">
                  <Link className="" to={"/forgot-password?role=beneficiary"}>
                    Forgot Password
                  </Link>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <p>Don&apos;t have an account? </p>
                  <Link to="/signup/beneficiary" className="underline underline-offset-2">
                    Sign up
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* image */}
      </div>
    </>
  );
};

export default BeneficiaryLogin;
