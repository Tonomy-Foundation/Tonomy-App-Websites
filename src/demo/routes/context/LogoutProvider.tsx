import React, { createContext, useEffect, useState } from "react";
import { api, ExternalUser, SdkError, SdkErrors } from "@tonomy/tonomy-id-sdk";
import useErrorStore from "../../../common/stores/errorStore";

interface LogoutContextProps {
  logout: () => void;
}

interface LogoutProviderProps {
  children: React.ReactNode;
}

export const LogoutContext = createContext<LogoutContextProps>({
  logout: () => {},
});

const LogoutProvider: React.FC<LogoutProviderProps> = ({ children }) => {
  const errorStore = useErrorStore();
  const [user, setUser] = useState<ExternalUser | null>(null);

  async function onRender() {
    try {
      const user = await api.ExternalUser.getUser();

      setUser(user);
    } catch (e) {
      if (
        e instanceof SdkError &&
        (e.code === SdkErrors.AccountNotFound ||
          e.code === SdkErrors.AccountDoesntExist ||
          e.code === SdkErrors.UserNotLoggedIn)
      ) {
        // User not logged in
        window.location.href = "/";
        return;
      }

      errorStore.setError({ error: e, expected: false });
    }
  }

  useEffect(() => {
    onRender();
  }, []);

  const logout = async () => {
    await user?.logout();
    window.location.href = "/";
  };

  return (
    <LogoutContext.Provider value={{ logout }}>
      {children}
    </LogoutContext.Provider>
  );
};

export default LogoutProvider;
