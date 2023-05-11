import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import CallBackPage from "../pages/CallBack";
import DownloadApp from "../pages/DownloadApp";
import Login from "../pages/Login";
import TestStart from "../pages/TestStart";
import TestEnd from "../pages/TestEnd";

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
    path: "/test-start",
    element: <TestStart />,
  },
  {
    path: "/test-end",
    element: <TestEnd />,
  },
]);

export default router;
