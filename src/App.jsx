import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import ForgotPasswordPage from "./pages/ForgotPassword";
import OtpPage from "./pages/OtpPage";
import BeneficiarySignup from "./pages/BeneficiarySignup";
import BeneficiaryLogin from "./pages/BeneficiaryLogin";
import Dashboard from "./pages/Dashboard";
import SignupStakeholder from "./pages/Forms/SignupStakeholder";
import "./App.css";
import AuthProvider from "./Utilis/Auth";
import LoginStakeholder from "./pages/Forms/LoginStakeholder";
import ProtectedROutes from "./Utilis/ProtectedROutes";
import Organization from "./pages/Dashboard/Organization";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" index element={<LandingPage />} />
          {/*Organisation Route */}
          {/* <Route path="/create_deployment" element={<SignupStakeholder />} />
          <Route path="/signin" element={<LoginStakeholder />} />
          <Route
            path="/:subdomain/dashboard"
            element={<ProtectedROutes></ProtectedROutes>}
          /> */}
          <Route path="/org" element={<Organization />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
