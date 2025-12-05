import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AuthProvider from "../providers/AuthProvider";
import HomeScreen from "../pages/Home";
import MainLayout from "../../common/layout/MainLayout";
import Callback from "../pages/Callback";
import BanklessRoutes from "../../appsBankless/routes/routes";
import BuildRoutes from "../../appsBuild/routes/routes";

export default function RootRoutes() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route
            path="/"
            element={
              <MainLayout>
                <HomeScreen />
              </MainLayout>
            }
          />
          <Route path="/callback" element={<Callback />} />

          {/* Bankless App Routes */}
          <Route
            path="/bankless/*"
            element={
              <MainLayout page="bankless">
                <BanklessRoutes />
              </MainLayout>
            }
          />

          {/* Build App Routes */}
          <Route
            path="/build/*"
            element={
              <MainLayout page="build">
                <BuildRoutes />
              </MainLayout>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}
