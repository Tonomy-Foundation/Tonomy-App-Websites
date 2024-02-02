import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AuthProvider from "../providers/AuthProvider";
import mainRoutes from "./mainRoutes";
import PrivateRoute from "./guards/PrivateRoute";
import HomeScreen from "../pages/Home";
import Callback from "../pages/Callback";
import AppManager from "../pages/AppManager";
import TopMenuBar from "../layout/TopMenuBar";
import MainLayout from "../layout/MainLayout";

export default function RootRoutes(): JSX.Element {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/callback" element={<Callback />} />
          <Route
            path="/app-manager"
            element={
              <MainLayout>
                <AppManager />
              </MainLayout>
            }
          />

          {mainRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={
                <PrivateRoute>
                  <TopMenuBar>{route?.element}</TopMenuBar>
                </PrivateRoute>
              }
            />
          ))}
        </Routes>
      </AuthProvider>
    </Router>
  );
}
