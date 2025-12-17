import { RouteObject } from "react-router-dom";
import AppManager from "../pages/AppManager";

const mainRoutes: RouteObject[] = [
  {
    path: "/apps",
    element: <AppManager />,
  },
];

export default mainRoutes;
