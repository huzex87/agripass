import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ForgotPasswordPage from "./pages/ForgotPassword";
import OtpPage from "./pages/OtpPage";
import BeneficiarySignup from "./pages/BeneficiarySignup";
import BeneficiaryLogin from "./pages/BeneficiaryLogin";
import Dashboard from "./pages/Dashboard";
import Sidebar2 from "./pages/components/Sidebar2";
import SignupStakeholder from "./pages/Forms/SignupStakeholder";
import "./App.css";
import AuthProvider from "./Utilis/Auth";
import LoginStakeholder from "./pages/Forms/LoginStakeholder";

import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./Utilis/Theme"; // Import your custom theme

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" index element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgotpassword" element={<ForgotPasswordPage />} />
            <Route path="/otp" element={<OtpPage />} />
            <Route path="/beneficiarysignup" element={<BeneficiarySignup />} />
            <Route path="/beneficiarylogin" element={<BeneficiaryLogin />} />
            <Route path="/dashboard" element={<Dashboard />} />{" "}
            {/*Organisation Route */}
            <Route path="/signin" element={<LoginStakeholder />} />
            <Route path="/dashboard_org" element={<Sidebar2 />} />
            <Route path="/create_deployment" element={<SignupStakeholder />} />
          </Routes>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
