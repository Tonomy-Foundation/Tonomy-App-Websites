import React from "react";
import { Route, Routes } from "react-router-dom";
import AuthProvider from "../providers/AuthProvider";
import mainRoutes from "./mainRoutes";
import PrivateRoute from "./guards/PrivateRoute";
import HomeScreen from "../pages/Home";
import MainLayout from "../layout/MainLayout";
import Callback from "../pages/Callback";

export default function BanklessRoutes() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<MainLayout><HomeScreen /></MainLayout>} />
        <Route path="/home" element={<MainLayout><HomeScreen /></MainLayout>} />
        <Route path="/callback" element={<Callback />} />
        {mainRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={
              <PrivateRoute>
                <MainLayout>{route?.element}</MainLayout>
              </PrivateRoute>
            }
          />
        ))}
      </Routes>
    </AuthProvider>
  );
}