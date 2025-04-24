import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../Forms/SignupStakeholder.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { signupSchema } from "../../Utilis/ValidationSchema";
import navlogo from "../../assets/navlogo.jpg";

const SignupStakeholder = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(signupSchema) });

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });
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
      setAlert({
        open: true,
        message: `Sign up successful! Your subdomain is ${response.data.subdomain}`,
        severity: "success",
      });
      setTimeout(() => {
        setAlert({ ...alert, open: false });
      }, 6000);
      navigate("/signin");
    } catch (error) {
      console.error("Error during signup:", error);
      let errorMessage = "An error occurred. Please try again later.";
      if (error && error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      setAlert({
        open: true,
        message: errorMessage,
        severity: "error",
      });
      setTimeout(() => {
        setAlert({ ...alert, open: false });
      }, 5000);
    } finally {
      setLoading(false);
    }
  };

  return <></>;
};

export default SignupStakeholder;
