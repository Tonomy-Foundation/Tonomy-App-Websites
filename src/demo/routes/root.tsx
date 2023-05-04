import { createBrowserRouter } from "react-router-dom";

import Home from "../pages/Home";
import Callback from "../pages/Callback";
import UserHome from "../pages/UserHome";

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
]);

export default router;
