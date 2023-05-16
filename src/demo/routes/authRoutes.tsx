import { RouteObject } from "react-router-dom";
import Home from "../pages/Home";
import Callback from "../pages/Callback";

const authRoutes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/user-home",
    element: <Home />,
  },
  {
    path: "/callback",
    element: <Callback />,
  },
];

export default authRoutes;
