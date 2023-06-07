import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { api, SdkError, SdkErrors } from "@tonomy/tonomy-id-sdk";
import useErrorStore from "../../common/stores/errorStore";
import PrivateRoute from "./guards/PrivateRoute";
import LogoutProvider from "../providers/LogoutProvider";
import HomeScreen from "../pages/Home";
import Callback from "../pages/Callback";
import MainLayout from "../layout/MainLayout";
import mainRoutes from "./mainRoutes";

export default function RootRoutes(): JSX.Element {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const errorStore = useErrorStore();

  useEffect(() => {
    const fetchAuthentication = async (): Promise<void> => {
      try {
        const user = await api.ExternalUser.getUser({ autoLogout: false });

        if (user) setIsAuthenticated(true);
      } catch (e) {
        if (
          e instanceof SdkError &&
          (e.code === SdkErrors.AccountNotFound ||
            e.code === SdkErrors.AccountDoesntExist ||
            e.code === SdkErrors.UserNotLoggedIn)
        ) {
          // User not logged in
          setIsAuthenticated(false);

          return;
        }

        errorStore.setError({ error: e, expected: false });
      }
    };

    fetchAuthentication();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/callback" element={<Callback />} />
        {mainRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={
              <LogoutProvider>
                <PrivateRoute isAuthenticated={isAuthenticated}>
                  <MainLayout>{route.element}</MainLayout>
                </PrivateRoute>
              </LogoutProvider>
            }
          />
        ))}
      </Routes>
    </Router>
  );
}
