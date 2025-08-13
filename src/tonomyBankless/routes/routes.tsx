import React from "react";
import { Route, Routes } from "react-router-dom";
import AuthProvider from "../providers/AuthProvider";
import mainRoutes from "./mainRoutes";
import PrivateRoute from "./guards/PrivateRoute";
import HomeScreen from "../pages/Home";

export default function BanklessRoutes() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        {mainRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={
              <PrivateRoute>
                {route?.element}
              </PrivateRoute>
            }
          />
        ))}
      </Routes>
    </AuthProvider>
  );
}