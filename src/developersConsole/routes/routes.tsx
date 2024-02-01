import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AuthProvider from "../providers/AuthProvider";
import mainRoutes from "./mainRoutes";
import PrivateRoute from "./guards/PrivateRoute";
import HomeScreen from "../pages/Home";
import Callback from "../pages/Callback";
import AppManager from "../pages/AppManager";

export default function RootRoutes(): JSX.Element {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/callback" element={<Callback />} />
          <Route path="/app-manager" element={<AppManager />} />

          {mainRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={
                <PrivateRoute>
                  <>{route?.element}</>
                </PrivateRoute>
              }
            />
          ))}
        </Routes>
      </AuthProvider>
    </Router>
  );
}
