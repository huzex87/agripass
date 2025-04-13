import React, { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { signupSchema } from "../../Utilis/ValidationSchema";
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
      if (response.status === 200) {
        alert("Signup successful! Please check your email for verification.");
      }
    } catch (error) {
      console.error("Error during signup:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Container
        maxWidth={false}
        disableGutters
        sx={{
          display: "flex",
          // flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: "#002E5D",
          gap: 10,
        }}
      >
        <Grid container spacing={3} justifyContent="center" alignItems="center">
          <Grid item xs={12} lg={6}>
            <Box
              component="form"
              noValidate
              autoComplete="off"
              onSubmit={handleSubmit(onSubmit)}
              sx={{
                width: "100%",
                maxWidth: 600,
                backgroundColor: "#FFFFFF",
                borderRadius: 4,
                boxShadow: 3,
                p: 4,
                mx: "auto",
              }}
            >
              {/* Company Logo */}
              <Box textAlign="center">
                <img src={navlogo} alt="company logo" />
              </Box>

              {/* Form Section */}
              <Box textAlign="center" mb={4}>
                <Typography variant="h5" gutterBottom>
                  Stakeholder Signup
                </Typography>
              </Box>

              <Grid container spacing={3}>
                {/* ORGANIZATION NAME  */}
                <Grid item xs={12} md={6}>
                  <TextField
                    required
                    {...register("orgName")}
                    name="orgName"
                    type="text"
                    label="Organization Name"
                    variant="outlined"
                    fullWidth
                    margin="normal"
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
                  {errors.orgName && (
                    <Typography color="error">
                      {errors.orgName.message}
                    </Typography>
                  )}
                </Grid>

                {/* ORGANIZATION EMAIL */}
                <Grid item xs={12} md={6}>
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
                  {errors.email && (
                    <Typography color="error">
                      {errors.email.message}
                    </Typography>
                  )}
                </Grid>

                {/* ORGANIZAtion PHONE */}
                <Grid item xs={12} md={6}>
                  <TextField
                    required
                    {...register("phone")}
                    name="phone"
                    type="number"
                    label="Phone"
                    variant="outlined"
                    fullWidth
                    margin="normal"
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
                  {errors.phone && (
                    <Typography color="error">
                      {errors.phone.message}
                    </Typography>
                  )}
                </Grid>

                {/* passsword */}
                <Grid item xs={12} md={6}>
                  <TextField
                    reequired
                    {...register("password")}
                    name="password"
                    type="password"
                    label="Password"
                    variant="outlined"
                    fullWidth
                    margin="normal"
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
                  {errors.password && (
                    <Typography color="error">
                      {errors.password.message}
                    </Typography>
                  )}
                </Grid>

                {/* CONFIRM PASSWORD */}
                <Grid item xs={12} md={6}>
                  <TextField
                    required
                    {...register("confirmPassword")}
                    name="confirmPassword"
                    label="Confirm Password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    margin="normal"
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
                  {errors.confirmPassword && (
                    <Typography color="error">
                      {errors.confirmPassword.message}
                    </Typography>
                  )}
                </Grid>

                {/* TERMS AND CONDITIONS */}
                <FormControlLabel
                  required
                  control={<Checkbox {...register("agreeToTerms")} />}
                  label="I agree to the terms and conditions"
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
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default SignupStakeholder;
