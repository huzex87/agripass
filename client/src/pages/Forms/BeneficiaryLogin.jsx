import React, { useState } from "react";
import * as yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
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
          <div className="flex justify-center md:justify-start gap-2">
            <img src="" alt="" />
            agripass
          </div>
          <div className=" flex flex-1 items-center justify-center">
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
                  <Link className="" to={"#"}>
                    Forgot Password
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
