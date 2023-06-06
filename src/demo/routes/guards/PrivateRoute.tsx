import React from "react";
import { Route, useNavigate } from "react-router-dom";

interface PrivateRouteProps {
  path: string;
  component: React.ComponentType<any>;
  isAuthenticated: boolean;
  handleLogout: () => void;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  component: Component,
  isAuthenticated,
  handleLogout,
  ...rest
}) => {
  const navigate = useNavigate();

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? (
          <Component {...props} handleLogout={handleLogout} />
        ) : (
          navigate("/login")
        )
      }
    />
  );
};

export default PrivateRoute;
