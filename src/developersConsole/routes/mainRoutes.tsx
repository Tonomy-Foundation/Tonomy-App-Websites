import { RouteObject } from "react-router-dom";
import UserHome from "../pages/UserHome";
import AppManager from "../pages/AppManager";

const mainRoutes: RouteObject[] = [
  {
    path: "/user-home",
    element: <UserHome />,
  },
  {
    path: "/app-manager",
    element: <AppManager />,
  },
];

export default mainRoutes;
