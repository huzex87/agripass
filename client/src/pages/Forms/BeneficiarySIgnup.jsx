import React, { useState } from "react";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Leaf } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";
import api from "../../utils/Api";
import LocationPicker from "@/components/ui/LocationPicker";

const signupSchema = yup.object().shape({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  gender: yup.string().oneOf(["male", "female"], "Select a gender").required("Gender is required"),
  dateOfBirth: yup.string().required("Date of birth is required"),
  phone: yup.string().required("Phone number is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
  idType: yup.string().oneOf(["passport", "national_id"], "Select an ID type").required("ID type is required"),
  idNumber: yup.string().required("ID number is required"),
  location: yup.object().shape({
    state: yup.string().required("State is required"),
    lga: yup.string().required("LGA is required"),
  }),
  agreeToTerms: yup.boolean().oneOf([true], "You must agree to the Terms of Service").required(),
});

const BeneficiarySignup = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({ resolver: yupResolver(signupSchema), defaultValues: { location: {} } });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await api.post("/api/v1/register", {
        firstName: data.firstName,
        lastName: data.lastName,
        gender: data.gender,
        dateOfBirth: data.dateOfBirth,
        phone: data.phone,
        email: data.email,
        password: data.password,
        idType: data.idType,
        idNumber: data.idNumber,
        state: data.location.state,
        lga: data.location.lga,
      });

      toast.success("Account created successfully!", {
        description: "You can now log in with your new farmer account.",
      });
      navigate("/login/beneficiary");
    } catch (error) {
      console.error("Error during beneficiary signup:", error);
      const errorMessage =
        error.response?.data?.error || "An error occurred. Please try again later.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-svh place-items-center p-6 md:p-10">
      <div className="w-full max-w-2xl">
        <div className="flex justify-center gap-2 mb-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="p-1.5 bg-emerald-500/20 rounded-lg text-emerald-400 border border-emerald-500/30">
              <Leaf size={16} />
            </div>
            <div>
              <span className="font-extrabold text-sm tracking-wider uppercase">AgriPass</span>
              <span className="block text-[6px] uppercase tracking-widest text-emerald-400">Agricultural Ledger</span>
            </div>
          </Link>
        </div>

        <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-2xl font-bold">Create Your Farmer Account</h1>
            <p className="text-balance text-sm text-muted-foreground">
              Sign up to apply for cooperative projects and track your disbursements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" placeholder="First name" {...register("firstName")} className={errors.firstName ? "border-red-500" : ""} />
              {errors.firstName && <p className="text-sm text-red-500">{errors.firstName.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" placeholder="Last name" {...register("lastName")} className={errors.lastName ? "border-red-500" : ""} />
              {errors.lastName && <p className="text-sm text-red-500">{errors.lastName.message}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="gender">Gender</Label>
              <select
                id="gender"
                {...register("gender")}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
              {errors.gender && <p className="text-sm text-red-500">{errors.gender.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input id="dateOfBirth" type="date" {...register("dateOfBirth")} className={errors.dateOfBirth ? "border-red-500" : ""} />
              {errors.dateOfBirth && <p className="text-sm text-red-500">{errors.dateOfBirth.message}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" placeholder="+234..." {...register("phone")} className={errors.phone ? "border-red-500" : ""} />
              {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" placeholder="you@example.com" {...register("email")} className={errors.email ? "border-red-500" : ""} />
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="idType">ID Type</Label>
              <select
                id="idType"
                {...register("idType")}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              >
                <option value="">Select ID type</option>
                <option value="national_id">National ID</option>
                <option value="passport">Passport</option>
              </select>
              {errors.idType && <p className="text-sm text-red-500">{errors.idType.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="idNumber">ID Number</Label>
              <Input id="idNumber" placeholder="ID number" {...register("idNumber")} className={errors.idNumber ? "border-red-500" : ""} />
              {errors.idNumber && <p className="text-sm text-red-500">{errors.idNumber.message}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Create Password</Label>
              <Input id="password" type="password" placeholder="Enter your password" {...register("password")} className={errors.password ? "border-red-500" : ""} />
              {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input id="confirmPassword" type="password" placeholder="Confirm your password" {...register("confirmPassword")} className={errors.confirmPassword ? "border-red-500" : ""} />
              {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>}
            </div>
          </div>

          <div>
            <Label className="mb-2 block">Location</Label>
            <Controller
              name="location"
              control={control}
              render={({ field }) => (
                <LocationPicker
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.location?.state?.message || errors.location?.lga?.message}
                />
              )}
            />
          </div>

          <div className="flex items-start gap-2 py-1">
            <input
              id="agreeToTerms"
              type="checkbox"
              {...register("agreeToTerms")}
              className="mt-1 h-4 w-4 rounded border-slate-800 bg-slate-950 text-emerald-500 focus:ring-emerald-500 cursor-pointer"
            />
            <div className="grid gap-1">
              <Label htmlFor="agreeToTerms" className="text-xs font-medium leading-none cursor-pointer">
                I agree to the Terms of Service and Privacy Policy
              </Label>
              {errors.agreeToTerms && <p className="text-[10px] text-red-500">{errors.agreeToTerms.message}</p>}
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer rounded-xl font-bold py-2.5 transition-all"
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

          <div className="flex items-center justify-center gap-2">
            <p>Already have an account? </p>
            <Link to="/login/beneficiary" className="underline underline-offset-2">
              Log in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BeneficiarySignup;
