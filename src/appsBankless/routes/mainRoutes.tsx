import { RouteObject } from "react-router-dom";
import BanklessFeatures from "../pages/BanklessFeatures";

const mainRoutes: RouteObject[] = [
  {
    path: "/swap",
    element: <BanklessFeatures />,
  },
  {
    path: "/faucet",
    element: <BanklessFeatures />,
  },
];

export default mainRoutes;
