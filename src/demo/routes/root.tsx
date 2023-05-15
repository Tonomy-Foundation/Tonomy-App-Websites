import { createBrowserRouter } from "react-router-dom";

import Home from "../pages/Home";
import Callback from "../pages/Callback";
import UserHome from "../pages/UserHome";
import Test from "../pages/Test";

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
    path: "/test",
    element: <Test />,
  },
]);

export default router;
