import { createBrowserRouter } from "react-router-dom";

import Home from "../pages/Home";
import Navigation from "../pages/navigation";
import Callback from "../pages/Callback";
import UserHome from "../pages/UserHome";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigation />, //<Home />,
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
