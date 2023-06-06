import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { api, SdkError, SdkErrors } from "@tonomy/tonomy-id-sdk";
import { useUserStore } from "../../common/stores/user.store";
import useErrorStore from "../../common/stores/errorStore";
import PrivateRoute from "./guards/PrivateRoute";
import LogoutProvider from "./context/LogoutProvider";
import HomeScreen from "../pages/Home";
import Callback from "../pages/Callback";
import BlockchainTx from "../pages/BlockchainTx";
import Messages from "../pages/Messages";
import UserHome from "../pages/UserHome";
import W3CVCs from "../pages/W3CVCs";
import MainLayout from "../layout/MainLayout";

export default function App(): JSX.Element {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const userStore = useUserStore();
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

  const handleLogout = () => {
    // Perform logout logic
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/callback" element={<Callback />} />
        <Route
          element={
            <MainLayout>
              <LogoutProvider>
                <PrivateRoute
                  path="/user-home"
                  component={UserHome}
                  isAuthenticated={isAuthenticated}
                  handleLogout={handleLogout}
                />
                <PrivateRoute
                  path="/blockchain-tx"
                  component={BlockchainTx}
                  isAuthenticated={isAuthenticated}
                  handleLogout={handleLogout}
                />
                <PrivateRoute
                  path="/messages"
                  component={Messages}
                  isAuthenticated={isAuthenticated}
                  handleLogout={handleLogout}
                />
                <PrivateRoute
                  path="/w3c-vcs"
                  component={W3CVCs}
                  isAuthenticated={isAuthenticated}
                  handleLogout={handleLogout}
                />
              </LogoutProvider>
            </MainLayout>
          }
        />
      </Routes>
    </Router>
  );
}
