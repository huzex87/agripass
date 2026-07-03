import * as yup from "yup";

export const signupSchema = yup.object().shape({
  orgName: yup.string().required("Organization Name is required"),
  // subdomain: yup
  //   .string()
  //   .matches(/^[a-zA-Z0-9]+$/, "Subdomain must be alphanumeric")
  //   .required("Subdomain is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm your password"),
  agreeToTerms: yup.boolean().oneOf([true], "You must agree to the terms"),
});
