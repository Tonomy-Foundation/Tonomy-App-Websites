import React from "react";
import { Route, Routes } from "react-router-dom";
import mainRoutes from "./mainRoutes";
import PrivateRoute from "./guards/PrivateRoute";
import HomeScreen from "../pages/Home";
import { AppKitProvider } from "../../apps/providers/AppKitProvider";

export default function BanklessRoutes() {
  return (
    <AppKitProvider>
      <Routes>
        <Route path="/" element={<HomeScreen />} />

        {mainRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={<PrivateRoute>{route?.element}</PrivateRoute>}
          />
        ))}
      </Routes>
    </AppKitProvider>
  );
}
