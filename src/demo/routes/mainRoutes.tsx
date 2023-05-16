import { RouteObject } from "react-router-dom";
import BlockchainTx from "../pages/blockchainTx";
import Messages from "../pages/messages";

const mainRoutes: RouteObject[] = [
  {
    path: "/blockchain-tx",
    element: <BlockchainTx />,
  },
  {
    path: "/messages",
    element: <Messages />,
  },
];

export default mainRoutes;
