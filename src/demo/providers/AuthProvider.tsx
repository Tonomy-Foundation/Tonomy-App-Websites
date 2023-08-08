import React, { useEffect, useState } from "react";
import { api, ExternalUser, SdkError, SdkErrors } from "@tonomy/tonomy-id-sdk";
import useErrorStore from "../../common/stores/errorStore";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  user: any;
  login: () => void;
  signout: () => void;
}

export const AuthContext = React.createContext<AuthContextType>({
  user: null,
  signout: () => {},
  login: () => {},
});

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<ExternalUser | null>(null);
  const navigation = useNavigate();
  const errorStore = useErrorStore();

  async function onRender() {
    try {
      const user = await api.ExternalUser.getUser({ autoLogout: false });

      setUser(user);
      navigation("/user-home");
    } catch (e) {
      if (
        e instanceof SdkError &&
        (e.code === SdkErrors.AccountNotFound ||
          e.code === SdkErrors.AccountDoesntExist ||
          e.code === SdkErrors.UserNotLoggedIn)
      ) {
        // User not logged in
        navigation("/");
        return;
      }

      errorStore.setError({ error: e, expected: false });
    }
  }

  useEffect(() => {
    onRender();
  }, []);

  const signout = async () => {
    await user?.logout();
    navigation("/");
  };

  const login = () => {
    api.ExternalUser.loginWithTonomy({ callbackPath: "/callback" });
  };

  const value = { user, signout, login };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
