import React, { useEffect, useState } from "react";
import {
  AppsExternalUser,
  isErrorCode,
  SdkErrors,
} from "@tonomy/tonomy-id-sdk";
import { useNavigate, useLocation } from "react-router-dom";
import { useDisconnect } from "@reown/appkit/react";
import Debug from "debug";
import useErrorStore from "../../common/stores/errorStore";

const debug = Debug("tonomy-app-websites:apps:AuthProvider");

interface AuthContextType {
  loading: boolean;
  user: AppsExternalUser | null;
  signin: (user: AppsExternalUser, page?: string) => void;
  signout: (page?: string) => void;
  init: () => Promise<void>;
}

export const AuthContext = React.createContext<AuthContextType>(null!);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AppsExternalUser | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { disconnect } = useDisconnect();
  const errorStore = useErrorStore();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const signout = async (page?: string) => {
    await user?.logout();
    await disconnect();

    if (page) navigate("/" + page);
    else navigate("/");
  };

  const signin = (user: AppsExternalUser, page?: string) => {
    setUser(user);
    debug("signin()", page);
    if (page) navigate(page);
  };

  const init = async () => {
    try {
      const user = await AppsExternalUser.getUser({ autoLogout: false });
      setUser(new AppsExternalUser(user));
    } catch (e) {
      if (
        isErrorCode(e, [
          SdkErrors.AccountNotFound,
          SdkErrors.AccountDoesntExist,
          SdkErrors.UserNotLoggedIn,
        ])
      ) {
        // User not logged in - don't navigate, just set user to null
        setUser(null);
      } else {
        errorStore.setError({ error: e, expected: false });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    init();
  }, []);

  const value = { user, signout, signin, init, loading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
