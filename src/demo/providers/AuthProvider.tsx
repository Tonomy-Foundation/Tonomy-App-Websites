import React, { createContext, useEffect, useState } from "react";
import { api, ExternalUser, SdkError, SdkErrors } from "@tonomy/tonomy-id-sdk";
import useErrorStore from "../../common/stores/errorStore";

interface AuthContextType {
  user: any;
  signin: (user: string, callback: VoidFunction) => void;
  signout: (callback: VoidFunction) => void;
}

export const AuthContext = React.createContext<AuthContextType>(null!);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = React.useState<any>(null);
  const errorStore = useErrorStore();

  const signin = async (newUser: string, callback: VoidFunction) => {
    try {
      const user = await api.ExternalUser.getUser();

      setUser(user);
      callback();
    } catch (e) {
      if (
        e instanceof SdkError &&
        (e.code === SdkErrors.AccountNotFound ||
          e.code === SdkErrors.AccountDoesntExist ||
          e.code === SdkErrors.UserNotLoggedIn)
      ) {
        // User not logged in
        setUser(null);
        callback();
        return;
      }

      errorStore.setError({ error: e, expected: false });
    }
  };

  const signout = (callback: VoidFunction) => {
    return user?.logout(() => {
      setUser(null);
      callback();
    });
  };

  const value = { user, signin, signout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
