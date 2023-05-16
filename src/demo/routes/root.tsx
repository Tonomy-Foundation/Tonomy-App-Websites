import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import mainRoutes from "./mainRoutes";
import authRoutes from "./authRoutes";
import MainLayout from "../layout/main";
import { api, SdkError, SdkErrors, ExternalUser } from "@tonomy/tonomy-id-sdk";

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
  const [user, setUser] = useState<ExternalUser | null>(null);

  async function onRender() {
    try {
      const user = await api.ExternalUser.getUser();

      setUser(user);
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

      console.error(e);
      alert(e);
    }
  }

  useEffect(() => {
    onRender();
  }, [isLoggedIn]);

  const handleLogout = async () => {
    try {
      await user?.logout();
      setIsLoggedIn(false);
    } catch (e) {
      console.error(e);
      alert(e);
    }
  };

  return (
    <BrowserRouter>
      {isLoggedIn ? <LoggedInRoutes onLogout={handleLogout} /> : <AuthRoutes />}
    </BrowserRouter>
  );
};

export default Router;
