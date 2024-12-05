import { lazy } from "react";
import Loadable from "app/components/Loadable";

const AppForm = Loadable(lazy(() => import("./forms/AppForm")));
const AppIcon = Loadable(lazy(() => import("./icons/AppIcon")));
const AppTable = Loadable(lazy(() => import("./tables/AppTable")));
const AppButton = Loadable(lazy(() => import("./buttons/AppButton")));

const materialRoutes = [
  { path: "/components/table", element: <AppTable /> },
  { path: "/components/form", element: <AppForm /> },
  { path: "/components/buttons", element: <AppButton /> },
  { path: "/components/icons", element: <AppIcon /> },
];

export default materialRoutes;
