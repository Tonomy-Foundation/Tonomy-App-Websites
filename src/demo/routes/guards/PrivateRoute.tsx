import * as React from "react";
import { useLocation, Navigate } from "react-router-dom";
import { useUserStore } from "../../../common/stores/user.store";

export default function PrivateRoute({ children }: { children: JSX.Element }) {
  const user = useUserStore((state) => state.user);

  console.log("private route user", user);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
}
