import React, { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/LandingPage/HomePage";
import ForgotPasswordPage from "./pages/ForgotPassword";
import OtpPage from "./pages/OtpPage";
import SignupStakeholder from "./pages/Forms/SignupStakeholder";
import "./App.css";
import AuthProvider from "./Utilis/Auth";
import LoginStakeholder from "./pages/Forms/LoginStakeholder";
import ProtectedROutes from "./Utilis/ProtectedROutes";
import Organization from "./pages/Dashboard/Organization/Organization";
import { ThemeProvider } from "./context/NewThemeContext";
import Layout from "./pages/Dashboard/Layout";
import { dashboardLoader, activeprojects } from "./Utilis/LoaderFunction";
import { Toaster } from "sonner";
import NotFoundPage from "./pages/NotFoundPage";
import CreateProject from "./pages/Routes/Organization/CreateProject";
import Projects from "./pages/Routes/Organization/Projects";
import BeneficiaryLogin from "./pages/Forms/BeneficiaryLogin";
import Beneficiary from "./pages/Dashboard/Beneficiary/Header";
import ProtectedRoutesII from "./Utilis/ProtectedRoutesII";
import ProjectDetails from "./pages/Routes/Organization/ProjectDetails";
import CreateNewProject from "./pages/Routes/Organization/CreateNewProject";
import Applications from "./pages/Routes/Organization/Applications";
import ApplicationForm from "./pages/Routes/Organization/ApplicationForm";

function App() {
  const publicRoutes = [
    {
      index: true,
      path: "/",
      element: <HomePage />,
    },
    {
      path: "/create_deployment",
      element: <SignupStakeholder />,
    },
    {
      path: "/signin",
      element: <LoginStakeholder />,
    },
    {
      path: "/login/beneficiary",
      element: <BeneficiaryLogin />,
    },
    {
      path: "/signup/beneficiary",
    },
  ];

  const protectedRoutes = [
    {
      path: "/beneficiary",
      element: <ProtectedRoutesII />,
      children: [
        {
          path: "dashboard",
          element: <Beneficiary />,
        },
      ],
    },

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
            // {
            //   path: "project",
            //   element: <Projects />,
            //   loader: activeprojects,
            // },
            {
              path: "project/:projectId",
              element: <ProjectDetails />,
            },
            {
              path: "projects",
              element: <Projects />,
            },
            {
              path: "newProject",
              element: <CreateNewProject />,
            },
            {
              path: "applications",
              element: <Applications />,
            },
            { 
              path: "projects/:projectId/application-form",
              element: <ApplicationForm />,
            },
          ],
        },
      ],
    },
  ];

  const router = createBrowserRouter([
    ...publicRoutes,
    ...protectedRoutes,
    {
      path: "*",
      element: <NotFoundPage />,
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
