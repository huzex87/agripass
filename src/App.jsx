import React, { lazy, Suspense } from "react";
import { Loader2 } from "lucide-react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import AuthProvider from "./Utilis/Auth";
import ProtectedROutes from "./Utilis/ProtectedROutes";
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
const BeneficiaryActiveProjectInfo = lazy(() =>
  import("./pages/Dashboard/Beneficiary/Components/ProjectInfo")
);
const Beneficiary = lazy(() =>
  import("./pages/Dashboard/Beneficiary/Beneficiary")
);
const ProjectDetails = lazy(() =>
  import("./pages/Routes/Organization/ProjectDetails")
);
const CreateNewProject = lazy(() =>
  import("./pages/Routes/Organization/CreateNewProject")
);
const Applications = lazy(() =>
  import("./pages/Routes/Organization/Applications")
);
const ApplicationForm = lazy(() =>
  import("./pages/Routes/Organization/ApplicationForm")
);

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Loader2 className="w-8 h-8 animate-spin text-primary" />
  </div>
);

function App() {
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
    },
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
  ];

  const protectedRoutes = [
    {
      path: "/:subdomain",
      element: <ProtectedROutes />,
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
