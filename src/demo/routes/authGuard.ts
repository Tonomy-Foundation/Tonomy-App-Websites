import React from "react";
import { Navigate } from "react-router-dom";
import { useUserStore } from "../../common/stores/user.store";

const AuthGuard = ({ children }) => {
  const isLoggedIn = useUserStore((state) => state.isLoggedIn);

  if (isLoggedIn) {
    return children;
  } else {
    return <Navigate to="/login" />;
  }
};

export default AuthGuard;
