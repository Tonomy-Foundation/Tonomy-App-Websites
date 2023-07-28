import { RouteObject } from "react-router-dom";
import Home from "../pages/Home";
import Callback from "../pages/Callback";
import W3CVCs from "../pages/UserHome";

const authRoutes: RouteObject[] = [
  {
    path: "/",
    element: <W3CVCs />,
  },
  {
    path: "/callback",
    element: <Callback />,
  },
];

export default authRoutes;
