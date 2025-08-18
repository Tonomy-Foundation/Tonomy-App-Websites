import React from "react";
import { Route, Routes } from "react-router-dom";
import AuthProvider from "../providers/AuthProvider";
import mainRoutes from "./mainRoutes";
import PrivateRoute from "./guards/PrivateRoute";
import HomeScreen from "../pages/Home";
import TonomySwap from "../pages/tonomySwap";
import { AppKitProvider } from "../../tonomyAppList/providers/AppKitProvider";

export default function BanklessRoutes() {
  return (
    <AuthProvider>
      <AppKitProvider>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/swap" element={<TonomySwap />} />

          {mainRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={<PrivateRoute>{route?.element}</PrivateRoute>}
            />
          ))}
        </Routes>
      </AppKitProvider>
    </AuthProvider>
  );
}
