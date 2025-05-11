import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/LandingPage/HomePage";
import ForgotPasswordPage from "./pages/ForgotPassword";
import OtpPage from "./pages/OtpPage";
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
import NotFoundPage from "./pages/NotFoundPage";

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
  ];

  const protectedRoutes = [
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
  ];

  const router = createBrowserRouter([
    ...publicRoutes,
    ...protectedRoutes,
    {
      path: "/*",
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
