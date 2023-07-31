import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PrivateRoute from "./guards/PrivateRoute";
import HomeScreen from "../pages/Home";
import Callback from "../pages/Callback";
import MainLayout from "../layout/MainLayout";
import mainRoutes from "./mainRoutes";
import AuthProvider from "../providers/AuthProvider";

export default function RootRoutes(): JSX.Element {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/callback" element={<Callback />} />
          {mainRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={
                <PrivateRoute>
                  <MainLayout>{route.element}</MainLayout>
                </PrivateRoute>
              }
            />
          ))}
        </Routes>
      </AuthProvider>
    </Router>
  );
}
