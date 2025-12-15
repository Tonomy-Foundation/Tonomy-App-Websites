import { RouteObject } from "react-router-dom";
import AppManager from "../pages/AppManager";
import AppViewer from "../pages/AppViewer";

const mainRoutes: RouteObject[] = [
  {
    path: "/apps",
    element: <AppManager />,
  },
  {
    path: "/apps/:username",
    element: <AppViewer />,
  },
];

export default mainRoutes;
