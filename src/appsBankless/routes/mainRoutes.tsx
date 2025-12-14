import { RouteObject } from "react-router-dom";
import BanklessFeatures from "../pages/BanklessFeatures";
import Faucet from "../pages/Faucet";

const mainRoutes: RouteObject[] = [
  {
    path: "/swap",
    element: <BanklessFeatures />,
  },
  {
    path: "/faucet",
    element: <Faucet />,
  },
];

export default mainRoutes;
