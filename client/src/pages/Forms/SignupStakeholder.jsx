import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../utils/Api";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { signupSchema } from "../../utils/schemas/validationSchema";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Leaf } from "lucide-react";
import Modal from "../Elements/Modal";
import image3 from "../../assets/image3.png";

const SignupStakeholder = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({ resolver: yupResolver(signupSchema) });

  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [subdomain, setSubdomain] = useState(null);
  // const subdomain = watch("subdomain");

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      const response = await api.post(
        "/api/v1/create",
        {
          orgName: data.orgName,
          email: data.email,
          password: data.password,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("Response:", response);
      setSubdomain(response.data.subdomain);
      setShowModal(true);
      toast.success("Account created successfully!");
    } catch (error) {
      console.error("Error during signup:", error);
      let errorMessage = "An error occurred. Please try again later.";
      if (error.response && error.response.data && error.response.data.error) {
        errorMessage = error.response.data.error;
      }
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      {/* form */}
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
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
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Create Account</h1>
                <p className="text-balance text-sm text-muted-foreground">
                  Create an account to get started with AgriPass. It’s free
                  and only takes a few minutes.
                </p>
              </div>
              <div className="grid gap-6">
                {/* Company Name */}
                <div className="grid gap-2">
                  <Label htmlFor="name">Organization </Label>
                  <Input
                    id="name"
                    type="name"
                    placeholder="Your Company Name"
                    {...register("orgName")}
                    className={errors.orgName ? "border-red-500" : ""}
                  />
                  {errors.orgName && (
                    <p className="text-sm text-red-500">
                      {errors.orgName.message}
                    </p>
                  )}
                </div>

                {/* Subdomain */}
                {/* <div className="grid gap-2">
                  <Label htmlFor="name">Subdomain</Label>
                  <Input
                    id="subdomain"
                    type="name"
                    placeholder="e.g mycompany"
                    {...register("subdomain")}
                    className={errors.subdomain ? "border-red-500" : ""}
                  />
                  {errors.subdomain && (
                    <p className="text-sm text-red-500">
                      {errors.subdomain.message}
                    </p>
                  )}
                </div> */}

                {/* Email */}
                <div className="grid gap-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    {...register("email")}
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="grid gap-2">
                  <Label htmlFor="password">Create Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    {...register("password")}
                    className={errors.password ? "border-red-500" : ""}
                  />
                  {errors.password && (
                    <p className="text-sm text-red-500">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="grid gap-2">
                  <Label htmlFor="password">Confirm Password</Label>
                  <Input
                    id="confrimpassword"
                    type="password"
                    placeholder="Enter your password"
                    {...register("confirmPassword")}
                    className={errors.confirmPassword ? "border-red-500" : ""}
                  />
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-500">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-700 text-white hover:bg-blue-800 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Please wait...
                    </>
                  ) : (
                    "Sign Up"
                  )}
                </Button>

                {/* Policy & Terms */}
                <div className="flex items-center justify-center">
                  <p className="text-sm text-muted-foreground">
                    By signing up, you agree to our{" "}
                    <a
                      href="#"
                      className="underline underline-offset-4 hover:underline"
                    >
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a
                      href="#"
                      className="underline underline-offset-4 hover:underline"
                    >
                      Privacy Policy
                    </a>
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="flex items-center justify-center gap-2">
          <p>Already have an account? </p>
          <Link to="/signin" className="underline underline-offset-2">
            Sign in
          </Link>
        </div>
      </div>

      {/* Image */}
      <div className="relative hidden bg-muted lg:block">
        <img
          src={image3}
          alt=""
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        subdomain={subdomain}
      />
    </div>
  );
};

export default SignupStakeholder;
