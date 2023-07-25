import { RouteObject } from "react-router-dom";
import Home from "../pages/Home";
import Callback from "../pages/Callback";
import W3CVCs from "../pages/newW3CVCs";
import UserHome from "../pages/UserHome";

const authRoutes: RouteObject[] = [
  {
    path: "/",
    element: <W3CVCs />,
  },
  {
    path: "/w3c-vcs",
    element: <W3CVCs />,
  },
  {
    path: "/user-home",
    element: <UserHome />,
  },
  {
    path: "/callback",
    element: <Callback />,
  },
];

export default authRoutes;
