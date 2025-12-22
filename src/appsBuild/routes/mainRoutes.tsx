import { RouteObject } from "react-router-dom";
import AppManager from "../pages/AppManager";
import AppViewer from "../pages/AppViewer";
import AppEditor from "../pages/AppEditor";

const mainRoutes: RouteObject[] = [
  {
    path: "/apps",
    element: <AppManager />,
  },
  {
    path: "/apps/:username",
    element: <AppViewer />,
  },
  {
    path: "/apps/:username/edit",
    element: <AppEditor />,
  },
];

export default mainRoutes;
