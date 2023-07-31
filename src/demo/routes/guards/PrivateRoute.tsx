import React, { useContext } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { AuthContext } from "../../providers/AuthProvider";

export default function PrivateRoute({ children }: { children: JSX.Element }) {
  const { user } = useContext(AuthContext);

  console.log("private route user", user);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
}
