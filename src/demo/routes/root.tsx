import { createBrowserRouter } from "react-router-dom";

import Home from "../pages/Home";
import Callback from "../pages/Callback";
import LoggedIn from "../pages/LoggedIn";

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
    path: "/logged-in",
    element: <LoggedIn />,
  },
]);

export default router;
