import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../Forms/SignupStakeholder.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { signupSchema } from "../../Utilis/ValidationSchema";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  InputAdornment,
  Checkbox,
  FormControlLabel,
  Alert,
} from "@mui/material";
import navlogo from "../../assets/navlogo.jpg";
import StoreIcon from "@mui/icons-material/Store";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import PhoneIcon from "@mui/icons-material/Phone";
import LockOpenIcon from "@mui/icons-material/LockOpen";

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

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: "#002E5D",
        }}
      >
        <Container maxWidth="sm">
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
            <Box textAlign="center">
              <img
                src={navlogo}
                alt="company logo"
                style={{ maxWidth: "150px" }}
              />
            </Box>
            <Typography variant="h5" gutterBottom>
              Create Deployment
            </Typography>

            {/* Form Section */}
            <Box
              className="signupStakeholder"
              component="form"
              noValidate
              autoComplete="off"
              onSubmit={handleSubmit(onSubmit)}
              sx={{ width: "100%" }}
            >
              {/* Domain Name */}
              <TextField
                required
                {...register("orgName")}
                name="orgName"
                type="text"
                label="Create Domain"
                placeholder="Name should be in lowercase"
                variant="outlined"
                fullWidth
                margin="normal"
                error={!!errors.orgName}
                helperText={errors.orgName?.message}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <StoreIcon />
                      </InputAdornment>
                    ),
                  },
                  inputLabel: {
                    sx: { fontSize: "1.2rem", fontWeight: "bold" },
                  },
                }}
              />

              {/* Email Field */}
              <TextField
                required
                {...register("email")}
                name="email"
                type="email"
                id="input-with-icon-textfield"
                label="Email"
                variant="outlined"
                fullWidth
                margin="normal"
                error={!!errors.email}
                helperText={errors.email?.message}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <AlternateEmailIcon />
                      </InputAdornment>
                    ),
                  },
                  inputLabel: {
                    sx: { fontSize: "1.2rem", fontWeight: "bold" },
                  },
                }}
              />

              {/* Phone Number Field */}
              <TextField
                required
                {...register("phone")}
                name="phone"
                type="number"
                label="Phone"
                variant="outlined"
                fullWidth
                margin="normal"
                error={!!errors.phone}
                helperText={errors.phone?.message}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIcon />
                      </InputAdornment>
                    ),
                  },
                  inputLabel: {
                    sx: { fontSize: "1.2rem", fontWeight: "bold" },
                  },
                }}
              />

              {/* Password Field */}
              <TextField
                required
                {...register("password")}
                name="password"
                type="password"
                label="Password"
                variant="outlined"
                fullWidth
                margin="normal"
                error={!!errors.password}
                helperText={errors.password?.message}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOpenIcon />
                      </InputAdornment>
                    ),
                  },
                  inputLabel: {
                    sx: { fontSize: "1.2rem", fontWeight: "bold" },
                  },
                }}
              />

              {/* Confirm Password */}
              <TextField
                required
                {...register("confirmPassword")}
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                variant="outlined"
                fullWidth
                margin="normal"
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOpenIcon />
                      </InputAdornment>
                    ),
                  },
                  inputLabel: {
                    sx: { fontSize: "1.2rem", fontWeight: "bold" },
                  },
                }}
              />

              {/* TERMS AND CONDITIONS */}
              <FormControlLabel
                required
                control={<Checkbox {...register("agreeToTerms")} />}
                label="I agree to the terms and conditions"
                error={!!errors.agreeToTerms}
              />
              {errors.agreeToTerms && (
                <Typography color="error">
                  {errors.agreeToTerms.message}
                </Typography>
              )}

              {/* SUBMIT BUTTON */}
              <Button
                variant="contained"
                type="submit"
                fullWidth
                sx={{ mt: 3, backgroundColor: "#002E5D" }}
                loading={loading}
              >
                Sign Up
              </Button>
            </Box>

            {alert.open && (
              <Alert
                severity={alert.severity}
                onClose={() => setAlert({ ...alert, open: false })}
                sx={{
                  position: "fixed",
                  top: 60,
                  left: "50%",
                  transform: "translateX(-50%)",
                  zIndex: 1000,
                }}
              >
                {alert.message}
              </Alert>
            )}
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default SignupStakeholder;
