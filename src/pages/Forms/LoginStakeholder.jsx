import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Forms/loginStakeholder.css";
import axios from "axios";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAuthentication } from "../../Utilis/Auth";
import navLogo from "../../assets/navlogo.jpg";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Grid,
  InputAdornment,
  Checkbox,
  FormControlLabel,
  FormControl,
  IconButton,
  Alert,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

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
      login(response.data.token);
      navigate("/dashboard_org");
      setAlert({
        open: true,
        message: response?.data?.message || "Login succeessful",
        severity: "success",
      });
      setTimeout(() => {
        setAlert({ ...alert, open: false });
      }, 3000);
    } catch (error) {
      console.log(error);
      let errorMessage = "Something went wrong";
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
  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: "#002E5D",
          padding: (theme) => theme.spacing(3), // Add some padding
        }}
      >
        <Container className="loginStakeholder" maxWidth="sm">
          <Box
            sx={{
              backgroundColor: "#FFFFFF",
              padding: (theme) => theme.spacing(4),
              borderRadius: 4,
              boxShadow: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {/* Company Logo */}
            <Box>
              <img
                src={navLogo}
                alt="Company Logo"
                style={{ maxWidth: "150px" }}
              />
            </Box>
            {/* Form Title */}
            <Typography variant="h5" component="h2">
              Stakeholder Sign In
            </Typography>

            {/* login Form */}
            <Box
              component="form"
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              sx={{ width: "100%" }}
            >
              {/* Subdomain */}
              <TextField
                fullWidth
                margin="normal"
                label="Subdomain"
                variant="outlined"
                {...register("subdomain")}
                error={!!errors.subdomain}
                helperText={errors.subdomain?.message}
              />

              {/* Password */}
              <TextField
                fullWidth
                margin="normal"
                label="Password"
                variant="outlined"
                type={showPassword ? "text" : "password"}
                {...register("password")}
                error={!!errors.password}
                helperText={errors.password?.message}
                slotProps={{
                  InputProps: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, backgroundColor: "#002E5D" }}
                disabled={loading}
                loading={loading}
              >
                Sign In
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
      {/* Alert Message */}
      {alert.open && (
        <Alert
          severity={alert.severity}
          onClose={handleCloseAlert}
          sx={{
            position: "fixed",
            top: 60,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1000,
          }}
        >
          {" "}
          {alert.message}{" "}
        </Alert>
      )}
    </>
  );
};

export default LoginStakeholder;
