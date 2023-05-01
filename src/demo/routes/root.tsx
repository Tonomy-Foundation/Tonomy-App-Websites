import { createBrowserRouter } from "react-router-dom";

import Home from "../pages/Home";
import Callback from "../pages/Callback";
import Login from "../pages/Login";

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
    path: "/login",
    element: <Login />,
  },
]);

export default router;
