import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import CallBackPage from "../pages/CallBack";
import DownloadApp from "../pages/DownloadApp";
import Login from "../pages/Login";
import Help from "../pages/Help";

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
    path: "/download",
    element: <DownloadApp />,
  },
  {
    path: "/callback",
    element: <CallBackPage />,
  },
  {
    path: "/help",
    element: <Help />,
  },
]);

export default router;
