import React, { useEffect, useState } from "react";
import { api, ExternalUser, SdkError, SdkErrors } from "@tonomy/tonomy-id-sdk";
import useErrorStore from "../../common/stores/errorStore";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  user: any;
  signout: () => void;
}

export const AuthContext = React.createContext<AuthContextType>({
  user: null,
  signout: () => {},
});

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<ExternalUser | null>(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigate();
  const errorStore = useErrorStore();

  async function onRender() {
    try {
      const user = await api.ExternalUser.getUser({ autoLogout: false });

      setUser(user);
      setLoading(false);
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

  const value = { user, signout };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children} {/* Render children only when loading is false */}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
