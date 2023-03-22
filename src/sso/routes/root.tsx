import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import CallBackPage from "../pages/CallBack";
import DownloadApp from "../pages/DownloadApp";
import Login from "../pages/Login";
import Loading from "../pages/Loading";
import AppDetails from "../pages/AppDetails";

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
    path: "/appDetails",
    element: <AppDetails />,
  },
  {
    path: "/loading",
    element: <Loading />,
  },
  {
    path: "/callback",
    element: <CallBackPage />,
  },
]);

export default router;
