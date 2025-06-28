import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAuthentication } from "../../Utilis/Auth";
import { Loader2 } from "lucide-react";
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
  const loginSchema = yup.object().shape({
    subdomain: yup.string().required("Please enter a valid subdomain"),
    password: yup.string().required("Password is required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const [loading, setLoading] = useState(false);

  const { login, baseDomain } = useAuthentication();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post(
        "/disbursify/login",
        { subdomain: data.subdomain, password: data.password },
        { headers: { "Content-Type": "application/json" } }
      );

      toast.success("Login Successful", {
        description: `Welcome back to ${data.subdomain}`,
      });
      login(response.data.token, data.subdomain);
      navigate(`/${data.subdomain}/dashboard`);
    } catch (error) {
      console.log(error);
      let errorMessage = "Something went wrong, server not responding";
      if (error && error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      // Error toast
      toast.error("Login Failed", {
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <motion.div
        className="relative min-h-svh bg-gray-950"
        variants={fadeIn("right", 0.2)}
        initial="hidden"
        whileInView="show"
      >
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${image2})` }}
        ></div>
        <motion.div
          className="relative z-10 flex flex-col items-center justify-center min-h-svh p-6 md:p-10"
          variants={fadeIn("left", 0.5)}
          initial="hidden"
          whileInView="show"
        >
          <div className="w-full max-w-sm md:max-w-3xl">
            <div className="flex flex-col gap-6">
              <Card className="overflow-hidden bg-white dark:bg-gray-800 shadow-lg">
                <CardContent className="grid p-0 md:grid-cols-2">
                  <form
                    action=""
                    className="p-6 md:p-8"
                    onSubmit={handleSubmit(onSubmit)}
                  >
                    <div className="flex flex-col gap-6">
                      <div className="flex flex-col items-center text-center">
                        <motion.h1
                          className="text-2xl font-bold"
                          variants={textVariant(0.5)}
                        >
                          Welcome back
                        </motion.h1>
                        <motion.p
                          className="text-balance text-muted-foreground"
                          variants={textVariant(0.5)}
                        >
                          Login to your account
                        </motion.p>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="name">Subdomain</Label>
                        <Input
                          id="name"
                          type="text"
                          placeholder="Enter your subdomain"
                          {...register("subdomain")}
                          className={errors.subdomain ? "border-red-500" : ""}
                        />
                        {errors.subdomain && (
                          <p className="text-sm text-red-500 mt-1">
                            {errors.subdomain.message}
                          </p>
                        )}
                      </div>
                      <div className="grid gap-2">
                        <div className="flex items-center">
                          <Label htmlFor="password">Password</Label>
                          <a
                            href="#"
                            className="ml-auto text-sm underline-offset-2 hover:underline"
                          >
                            Forgot your password?
                          </a>
                        </div>
                        <Input
                          id="password"
                          type="password"
                          {...register("password")}
                          className={errors.password ? "border-red-500" : ""}
                          placeholder="Enter your password"
                        />
                        {errors.password && (
                          <p className="text-sm text-red-500 mt-1">
                            {errors.password.message}
                          </p>
                        )}
                      </div>
                      <motion.div
                        variants={fadeIn("up", 0.5)}
                        initial="hidden"
                        whileInView="show"
                      >
                        <Button
                          className="w-full bg-blue-950 text-white hover:bg-blue-500"
                          type="submit"
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Authenticating...
                            </>
                          ) : (
                            "Login"
                          )}
                        </Button>
                      </motion.div>
                      <motion.div
                        className="text-center text-sm"
                        variants={fadeIn("up", 0.5)}
                        initial="hidden"
                        whileInView="show"
                      >
                        Don&apos;t have an account?{" "}
                        {/* <a href="#" className="underline underline-offset-4">
                          Sign up
                        </a> */}
                        <Link
                          to="/create_deployment"
                          className="underline underline-offset-4"
                        >
                          Sign up
                        </Link>
                      </motion.div>
                    </div>
                  </form>
                  {/* Image */}
                  <div className="relative hidden bg-muted md:block">
                    <img
                      src={navLogo}
                      alt="Company Logo"
                      className="absolute inset-0 h-full w-full object-cover "
                    />
                    {/* <div className="absolute inset-0 bg-black/30" /> */}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
};

export default LoginStakeholder;
