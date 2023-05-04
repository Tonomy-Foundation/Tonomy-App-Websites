import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import CallBackPage from "../pages/CallBack";
import DownloadApp from "../pages/DownloadApp";
import Login from "../pages/Login";
import Loading from "../pages/Loading";
import AppDetails from "../pages/AppDetails";

/* Navigation flow:
  /login
  --> /loading (logged in)
    --> external website (on logout / cancel)
    --> /appDetails (app requests sent)
      --> external website (on logout) **
  --> /callback (after QR code scanned and the request response received)
    --> ** external website (with the response)
*/

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
