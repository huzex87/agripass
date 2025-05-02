import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../Forms/SignupStakeholder.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { signupSchema } from "../../Utilis/ValidationSchema";
import { toast } from "sonner";
import navlogo from "../../assets/navlogo.jpg";

const SignupStakeholder = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(signupSchema) });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post(
        "/disbursify/create",
        {
          orgName: data.orgName,
          email: data.email,
          phone: data.phone,
          password: data.password,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("Response:", response);
      navigate("/signin");
    } catch (error) {
      console.error("Error during signup:", error);
      let errorMessage = "An error occurred. Please try again later.";
      if (error && error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      toast.error("Signup failed", {
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return <></>;
};

export default SignupStakeholder;
