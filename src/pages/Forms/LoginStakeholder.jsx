import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../Forms/loginStakeholder.css";
import axios from "axios";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAuthentication } from "../../Utilis/Auth";
import navLogo from "../../assets/navlogo.jpg";

const LoginStakeholder = () => {
  const loginSchema = yup.object().shape({
    subdomain: yup.string().required("Please enter a valid sudomain"),
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
  const [showPassword, setShowPassword] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const { login } = useAuthentication();
  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setAlert({ ...alert, open: false });
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post(
        "/disbursify/login",
        { subdomain: data.subdomain, password: data.password },
        { headers: { "Content-Type": "application/json" } }
      );
      login(response.data.token, data.subdomain);
      navigate(`/${data.subdomain}/dashboard`);
      setAlert({
        open: true,
        message: response?.data?.message || "Login succeessful",
        severity: "success",
      });
      setTimeout(() => {
        setAlert({ ...alert, open: false });
      }, 5000);
    } catch (error) {
      console.log(error);
      let errorMessage = "Something went wrong, server not responding";
      if (error && error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      setAlert({ open: true, message: errorMessage, severity: "error" });
      setTimeout(() => {
        setAlert({ ...alert, open: false });
      }, 5000);
    } finally {
      setLoading(false);
    }
  };
  return <></>;
};

export default LoginStakeholder;
