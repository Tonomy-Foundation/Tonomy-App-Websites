import React from "react";
import { Route, Routes } from "react-router-dom";
import mainRoutes from "./mainRoutes";
import PrivateRoute from "./guards/PrivateRoute";
import HomeScreen from "../pages/Home";
import AppsLayout from "../layout/AppsLayout";

export default function BuildRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomeScreen />} />

      {mainRoutes.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          element={
            <PrivateRoute>
              <AppsLayout>{route?.element}</AppsLayout>
            </PrivateRoute>
          }
        />
      ))}
    </Routes>
  );
}
