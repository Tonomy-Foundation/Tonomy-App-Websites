import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import mainRoutes from "./mainRoutes";
import authRoutes from "./authRoutes";
import MainLayout from "../layout/MainLayout";
import { api, SdkError, SdkErrors } from "@tonomy/tonomy-id-sdk";
import { useUserStore } from "../../common/stores/user.store";
import useErrorStore from "../../common/stores/errorStore";

const LoggedInRoutes = ({ onLogout }) => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout onLogout={onLogout} />}>
        {mainRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Route>
      <Route path="*" element={<Navigate to="/user-home" />} />
    </Routes>
  );
};

const AuthRoutes = () => {
  return (
    <Routes>
      <Route path="/">
        {authRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

const Router: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const userStore = useUserStore();
  const errorStore = useErrorStore();

  async function onRender() {
    try {
      const user = await api.ExternalUser.getUser();

      userStore.setUser(user);
      setIsLoggedIn(true);
    } catch (e) {
      if (
        e instanceof SdkError &&
        (e.code === SdkErrors.AccountNotFound ||
          e.code === SdkErrors.AccountDoesntExist ||
          e.code === SdkErrors.UserNotLoggedIn)
      ) {
        // User not logged in
        setIsLoggedIn(false);

        return;
      }

      errorStore.setError({ error: e, expected: false });
    }
  }

  useEffect(() => {
    onRender();
  }, []);

  const handleLogout = async () => {
    try {
      await userStore?.logout();
      setIsLoggedIn(false);
    } catch (e) {
      errorStore.setError({ error: e, expected: false });
    }
  };

  return (
    <BrowserRouter>
      {isLoggedIn ? <LoggedInRoutes onLogout={handleLogout} /> : <AuthRoutes />}
    </BrowserRouter>
  );
};

export default Router;
