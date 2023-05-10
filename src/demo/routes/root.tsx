import { createBrowserRouter } from "react-router-dom";

import Home from "../pages/Home";
import Callback from "../pages/Callback";
import UserHome from "../pages/UserHome";
import W3CVCs from "../pages/W3CVCs";
import BlockchainTx from "../pages/blockchainTx";
import Messages from "../pages/messages";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/callback",
    element: <Callback />,
  },
  {
    path: "/user-home",
    element: <UserHome />,
  },
  {
    path: "/w3c-vcs",
    element: <W3CVCs />,
  },
  {
    path: "/blockchain-tx",
    element: <BlockchainTx />,
  },
  {
    path: "/messages",
    element: <Messages />,
  },
]);

export default router;
