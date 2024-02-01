import { RouteObject } from "react-router-dom";
import UserHome from "../pages/UserHome";

const mainRoutes: RouteObject[] = [
  {
    path: "/user-home",
    element: <UserHome />,
  },
];

export default mainRoutes;
