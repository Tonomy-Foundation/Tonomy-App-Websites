import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AuthProvider from "../providers/AuthProvider";
import mainRoutes from "./mainRoutes";
import PrivateRoute from "./guards/PrivateRoute";
import HomeScreen from "../pages/Home";
import Callback from "../pages/Callback";
import MainLayout from "../layout/MainLayout";

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
                  <MainLayout>{route?.element}</MainLayout>
                </PrivateRoute>
              }
            />
          ))}
        </Routes>
      </AuthProvider>
    </Router>
  );
}
