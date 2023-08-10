import React, { useEffect, useState } from "react";
import { api, ExternalUser, SdkError, SdkErrors } from "@tonomy/tonomy-id-sdk";
import useErrorStore from "../../common/stores/errorStore";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  user: ExternalUser | null;
  signin: (user: ExternalUser) => void;
  signout: () => void;
}

export const AuthContext = React.createContext<AuthContextType>(null!);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<ExternalUser | null>(null);
  const navigation = useNavigate();

  const signout = async () => {
    await user?.logout();
    navigation("/");
  };

  const signin = (user: ExternalUser) => {
    setUser(user);
    navigation("/user-home");
  };

  const value = { user, signout, signin };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
