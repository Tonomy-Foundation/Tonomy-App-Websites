import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import mainRoutes from "./mainRoutes";
import authRoutes from "./authRoutes";
import MainLayout from "../layout/main";
import { api, ExternalUser, SdkError, SdkErrors } from "@tonomy/tonomy-id-sdk";

const isLoggedIn = (): boolean => {
  // Your logic to determine if the user is logged in or not
  // Return true if logged in, false otherwise
  // For example, you can check if a token or user object exists in local storage
  return false; // Replace with your own logic
};

const LoggedInRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        {mainRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Route>
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
    </Routes>
  );
};

const Router: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  async function onRender() {
    try {
      const user = await api.ExternalUser.getUser();

      if (user) setIsLoggedIn(true);
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
  }, []);
  return (
    <BrowserRouter>
      {isLoggedIn ? LoggedInRoutes() : AuthRoutes()}
    </BrowserRouter>
  );
};

export default Router;
