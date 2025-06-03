import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import CallBackPage from "../pages/CallBack";
import Login from "../pages/Login";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/callback",
    element: <CallBackPage />,
  },
]);

export default router;
