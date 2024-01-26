import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomeScreen from "../pages/Home";
import Callback from "../pages/Callback";
import AuthProvider from "../providers/AuthProvider";

export default function RootRoutes(): JSX.Element {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/callback" element={<Callback />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}
