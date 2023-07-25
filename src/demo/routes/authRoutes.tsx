import { RouteObject } from "react-router-dom";
import Home from "../pages/Home";
import Callback from "../pages/Callback";
import UserHome from "../pages/UserHome";

const authRoutes: RouteObject[] = [
  {
    path: "/",
    element: <UserHome />,
  },
  {
    path: "/callback",
    element: <Callback />,
  },
];

export default authRoutes;
