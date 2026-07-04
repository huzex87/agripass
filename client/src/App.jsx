import React, { useEffect, lazy, Suspense } from "react";
import { Loader2 } from "lucide-react";
import { syncOfflineRegistrations } from "./utils/offlineQueue";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import AuthProvider from "./utils/Auth";
import ProtectedRoute from "./utils/ProtectedRoute";
import { ThemeProvider } from "./context/NewThemeContext";
import { Toaster } from "sonner";

const HomePage = lazy(() => import("./pages/LandingPage/HomePage"));
const SignupStakeholder = lazy(() => import("./pages/Forms/SignupStakeholder"));
const Layout = lazy(() => import("./pages/Dashboard/Layout"));
const Organization = lazy(() =>
  import("./pages/Dashboard/Organization/Organization")
);
const LoginStakeholder = lazy(() => import("./pages/Forms/LoginStakeholder"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const Projects = lazy(() => import("./pages/Routes/Organization/Projects"));
const BeneficiaryLogin = lazy(() => import("./pages/Forms/BeneficiaryLogin"));
const BeneficiarySignup = lazy(() => import("./pages/Forms/BeneficiarySIgnup"));
const BeneficiaryActiveProjectInfo = lazy(() =>
  import("./pages/Dashboard/Beneficiary/Components/ProjectInfo")
);
const Beneficiary = lazy(() =>
  import("./pages/Dashboard/Beneficiary/Beneficiary")
);
const Admin = lazy(() => import("./pages/Dashboard/Admin/Admin"));
const ProjectDetails = lazy(() =>
  import("./pages/Routes/Organization/ProjectDetails")
);
const CreateNewProject = lazy(() =>
  import("./pages/Routes/Organization/CreateNewProject")
);
const EditProject = lazy(() =>
  import("./pages/Routes/Organization/EditProject")
);
const Applications = lazy(() =>
  import("./pages/Routes/Organization/Applications")
);
const ApplicationForm = lazy(() =>
  import("./pages/Routes/Organization/ApplicationForm")
);
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const OtpPage = lazy(() => import("./pages/OtpPage"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const VoucherVerify = lazy(() => import("./pages/Routes/Organization/VoucherVerify"));
const CropRecovery = lazy(() => import("./pages/Routes/Organization/CropRecovery"));

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Loader2 className="w-8 h-8 animate-spin text-primary" />
  </div>
);

function App() {
  useEffect(() => {
    // Listen for online events to trigger sync
    const handleOnline = () => {
      syncOfflineRegistrations();
    };

    window.addEventListener("online", handleOnline);

    // Run initial sync check on startup if online
    if (navigator.onLine) {
      syncOfflineRegistrations();
    }

    return () => {
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  const publicRoutes = [
    {
      index: true,
      path: "/",
      element: (
        <Suspense fallback={<LoadingFallback />}>
          <HomePage />
        </Suspense>
      ),
    },
    {
      path: "/create_deployment",
      element: (
        <Suspense fallback={<LoadingFallback />}>
          <SignupStakeholder />
        </Suspense>
      ),
    },
    {
      path: "/signin",
      element: (
        <Suspense fallback={<LoadingFallback />}>
          <LoginStakeholder />
        </Suspense>
      ),
    },
    {
      path: "/login/beneficiary",
      element: (
        <Suspense fallback={<LoadingFallback />}>
          <BeneficiaryLogin />
        </Suspense>
      ),
    },
    {
      path: "/signup/beneficiary",
      element: (
        <Suspense fallback={<LoadingFallback />}>
          <BeneficiarySignup />
        </Suspense>
      ),
    },
    {
      path: "/forgot-password",
      element: (
        <Suspense fallback={<LoadingFallback />}>
          <ForgotPassword />
        </Suspense>
      ),
    },
    {
      path: "/verify-otp",
      element: (
        <Suspense fallback={<LoadingFallback />}>
          <OtpPage />
        </Suspense>
      ),
    },
    {
      path: "/reset-password",
      element: (
        <Suspense fallback={<LoadingFallback />}>
          <ResetPassword />
        </Suspense>
      ),
    },
  ];

  const protectedRoutes = [
    {
      path: "/:subdomain",
      element: <ProtectedRoute requireSubdomain={true} />,
      children: [
        {
          path: "",
          element: (
            <Suspense fallback={<LoadingFallback />}>
              <Layout />
            </Suspense>
          ),
          children: [
            {
              path: "dashboard",
              element: (
                <Suspense fallback={<LoadingFallback />}>
                  <Organization />
                </Suspense>
              ),
            },
            {
              path: "project/:projectId",
              element: (
                <Suspense fallback={<LoadingFallback />}>
                  <ProjectDetails />
                </Suspense>
              ),
            },
            {
              path: "projects",
              element: (
                <Suspense fallback={<LoadingFallback />}>
                  <Projects />
                </Suspense>
              ),
            },
            {
              path: "newProject",
              element: (
                <Suspense fallback={<LoadingFallback />}>
                  <CreateNewProject />
                </Suspense>
              ),
            },
            {
              path: "projects/:projectId/edit",
              element: (
                <Suspense fallback={<LoadingFallback />}>
                  <EditProject />
                </Suspense>
              ),
            },
            {
              path: "applications",
              element: (
                <Suspense fallback={<LoadingFallback />}>
                  <Applications />
                </Suspense>
              ),
            },
            {
              path: "projects/:projectId/application-form",
              element: (
                <Suspense fallback={<LoadingFallback />}>
                  <ApplicationForm />
                </Suspense>
              ),
            },
            {
              path: "voucher-verify",
              element: (
                <Suspense fallback={<LoadingFallback />}>
                  <VoucherVerify />
                </Suspense>
              ),
            },
            {
              path: "crop-recovery",
              element: (
                <Suspense fallback={<LoadingFallback />}>
                  <CropRecovery />
                </Suspense>
              ),
            },
          ],
        },
      ],
    },
  ];

  const beneficiaryProtectedRoutes = [
    {
      element: <ProtectedRoute allowedRoles={["beneficiary"]} />,
      children: [
        {
          path: "/projects",
          element: (
            <Suspense fallback={<LoadingFallback />}>
              <Beneficiary />
            </Suspense>
          ),
        },
        {
          path: "/projects/:projectId",
          element: (
            <Suspense fallback={<LoadingFallback />}>
              <BeneficiaryActiveProjectInfo />
            </Suspense>
          ),
        },
      ],
    },
  ];

  const adminProtectedRoutes = [
    {
      element: <ProtectedRoute allowedRoles={["admin"]} redirectPath="/signin" />,
      children: [
        {
          path: "/admin/dashboard",
          element: (
            <Suspense fallback={<LoadingFallback />}>
              <Admin />
            </Suspense>
          ),
        },
      ],
    },
  ];

  const router = createBrowserRouter([
    ...publicRoutes,
    ...protectedRoutes,
    ...beneficiaryProtectedRoutes,
    ...adminProtectedRoutes,
    {
      path: "*",
      element: (
        <Suspense fallback={<LoadingFallback />}>
          <NotFoundPage />
        </Suspense>
      ),
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
