import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/LandingPage/HomePage";
import LandingPage from "./pages/LandingPage";
import ForgotPasswordPage from "./pages/ForgotPassword";
import OtpPage from "./pages/OtpPage";
import BeneficiarySignup from "./pages/BeneficiarySignup";
import BeneficiaryLogin from "./pages/BeneficiaryLogin";
import SignupStakeholder from "./pages/Forms/SignupStakeholder";
import "./App.css";
import AuthProvider from "./Utilis/Auth";
import LoginStakeholder from "./pages/Forms/LoginStakeholder";
import ProtectedROutes from "./Utilis/ProtectedROutes";
import Organization from "./pages/Dashboard/Organization";
import { ThemeProvider } from "./context/NewThemeContext";
import Layout from "./pages/Dashboard/Layout";
import { dashboardLoader } from "./Utilis/LoaderFunction";
import { Toaster } from "sonner";

function App() {
  const router = createBrowserRouter([
    // Public Routes
    {
      path: "/",
      element: <HomePage />,
      // element: <LandingPage />,
    },
    {
      path: "/forgot-password",
      element: <ForgotPasswordPage />,
    },
    {
      path: "/otp",
      element: <OtpPage />,
    },
    {
      path: "/beneficiary-signup",
      element: <BeneficiarySignup />,
    },
    {
      path: "/beneficiary-login",
      element: <BeneficiaryLogin />,
    },
    {
      path: "/create_deployment",
      element: <SignupStakeholder />,
    },
    {
      path: "/signin",
      element: <LoginStakeholder />,
    },

    // Protected Routes
    {
      path: "/:subdomain",
      element: <ProtectedROutes />,
      children: [
        {
          path: "",
          element: <Layout />,
          children: [
            {
              path: "dashboard",
              element: <Organization />,
              loader: dashboardLoader,
            },
          ],
        },
      ],
    },
  ]);

  return (
    <ThemeProvider>
      <AuthProvider>
        <Toaster position="top-center" richColors closeButton expand={true} />
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
