import { RouteObject } from "react-router-dom";
import TonomySwap from "../pages/TonomySwap";

const mainRoutes: RouteObject[] = [
  {
    path: "/swap",
    element: <TonomySwap />,
  },
];

export default mainRoutes;
