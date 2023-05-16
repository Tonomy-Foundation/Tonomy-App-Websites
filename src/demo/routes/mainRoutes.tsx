import { RouteObject } from "react-router-dom";
import BlockchainTx from "../pages/blockchainTx";
import Messages from "../pages/messages";
import UserHome from "../pages/UserHome";
import W3CVCs from "../pages/W3CVCs";

const mainRoutes: RouteObject[] = [
  {
    path: "/user-home",
    element: <UserHome />,
  },
  {
    path: "/blockchain-tx",
    element: <BlockchainTx />,
  },
  {
    path: "/messages",
    element: <Messages />,
  },
  {
    path: "/w3c-vcs",
    element: <W3CVCs />,
  },
];

export default mainRoutes;
