import { lazy } from "react";
import { Navigate } from "react-router-dom";
import AuthGuard from "./auth/AuthGuard";
import { authRoles } from "./auth/authRoles";
import Loadable from "./components/Loadable";
import Layout from "./components/Layout/Layout";
import materialRoutes from "app/views/components/MaterialRoutes";
// // SESSION PAGES
const NotFound = Loadable(lazy(() => import("app/views/sessions/NotFound")));
const JwtLogin = Loadable(lazy(() => import("app/views/sessions/JwtLogin")));
const JwtRegister = Loadable(lazy(() => import("app/views/sessions/JwtRegister")));
const ForgotPassword = Loadable(lazy(() => import("app/views/sessions/ForgotPassword")));

// DASHBOARD PAGE
const Analytics = Loadable(lazy(() => import("app/views/dashboard/Analytics")));
// const Records = Loadable(lazy(() => import("app/views/components/tables/AppTable")));
// const ManageUser = Loadable(lazy(() => import("app/views/components/tables/ManageUsers")));
const PatientsRecord = Loadable(lazy(() => import("app/views/components/tables/PatientsRecord")));
const PatientForm = Loadable(lazy(() => import("app/views/components/forms/PatientForm")));
const ProfilePage = Loadable(lazy(() => import("app/views/components/profile_page")));
const routes = [
  {
    element: (
      <AuthGuard>
        <Layout />
      </AuthGuard>
    ),
    children: [
      ...materialRoutes,
      { path: "/dashboard/", element: <Analytics />},
      { path: "/newcase/", element: <PatientForm />},
      { path: "/records/", element: <PatientsRecord />},
      // { path: "/manage_users/", element: <ManageUser />},
      { path: "/user_profile/", element: <ProfilePage />},
      { path: "*", element: <NotFound /> }
    ]
  },

  { path: "/session/404", element: <NotFound /> },
  { path: "/session/signin", element: <JwtLogin /> },
  { path: "/session/signup", element: <JwtRegister /> },
  { path: "/session/forgot-password", element: <ForgotPassword /> },
  { path: "/", element: <Navigate to="dashboard/" /> },
  { path: "*", element: <NotFound /> }
];

export default routes;
