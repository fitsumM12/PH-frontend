import { lazy } from "react";
import { Navigate } from "react-router-dom";
import AuthGuard from "./auth/AuthGuard";
import Loadable from "./components/Loadable";
import Layout from "./components/Layout/Layout";
// import { element } from "prop-types";
// // SESSION PAGES
const NotFound = Loadable(lazy(() => import("app/views/sessions/NotFound")));
const JwtLogin = Loadable(lazy(() => import("app/views/sessions/JwtLogin")));
const ForgotPassword = Loadable(lazy(() => import("app/views/sessions/ForgotPassword")));

// DASHBOARD PAGE
const Analytics = Loadable(lazy(() => import("app/views/dashboard/Analytics")));
const ManageRecord = Loadable(lazy(() => import("app/views/components/tables/ManageRecord")));
const ManageIndividualRecord = Loadable(lazy(() => import("app/views/components/tables/ManageIndividualRecord")));
const ManageGroupRecord = Loadable(lazy(() => import("app/views/components/tables/ManageGroupRecord")));
const ManageHatcheryUnit = Loadable(lazy(() => import("app/views/components/tables/ManageHatcheryUnit")));
const ManageChickenDistribution = Loadable(lazy(() => import("app/views/components/tables/ManageChickenDistribution")));
const ManageUser = Loadable(lazy(() => import("app/views/components/tables/ManageUser")));

const routes = [
  {
    element: (
      <AuthGuard>
        <Layout />
      </AuthGuard>
    ),
    children: [
      { path: "/dashboard/", element: <Analytics />},
      { path: "/managerecord/", element: <ManageRecord />},
      { path: "/individualrecord/", element: <ManageIndividualRecord />},
      { path: "/grouprecord/", element: <ManageGroupRecord />},
      { path: "/hatcheryunit", element:<ManageHatcheryUnit/>},
      { path: "/chickendistribution", element:<ManageChickenDistribution/>},
      { path: "/manageuser", element:<ManageUser/>},
      { path: "*", element: <NotFound /> }
    ]
  },

  { path: "/session/404", element: <NotFound /> },
  { path: "/session/signin", element: <JwtLogin /> },
  { path: "/session/forgot-password", element: <ForgotPassword /> },
  { path: "/", element: <Navigate to="individualrecord/" /> },
  { path: "*", element: <NotFound /> }
];

export default routes;
