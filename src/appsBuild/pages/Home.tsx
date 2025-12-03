import React, { useContext, useEffect, useState } from "react";
import {
  AppsExternalUser,
  isErrorCode,
  SdkErrors,
} from "@tonomy/tonomy-id-sdk";
import settings from "../../common/settings";
import "./Home.css";
import { TP, TH2 } from "../../common/atoms/THeadings";
import { useNavigate } from "react-router-dom";
import useErrorStore from "../../common/stores/errorStore";
import { AuthContext } from "../../apps/providers/AuthProvider";
import BuildLogo from "../../apps/assets/appSwitcherIcons/Build.png";

export default function Home() {
  const { signin } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigate();
  const errorStore = useErrorStore();

  async function onRender() {
    try {
      const user = await AppsExternalUser.getUser({ autoLogout: false });
      if (user) {
        signin(user, "build/");
      }

      setLoading(false);
    } catch (e) {
      if (
        isErrorCode(e, [
          SdkErrors.AccountNotFound,
          SdkErrors.AccountDoesntExist,
          SdkErrors.UserNotLoggedIn,
        ])
      ) {
        // User not logged in
        setLoading(false);
        navigation("/build");
        return;
      }

      errorStore.setError({ error: e, expected: false });
    }
  }

  useEffect(() => {
    onRender();
  }, []);

  async function onButtonPress() {
    AppsExternalUser.loginWithTonomy({
      callbackPath: "/callback?page=build",
      dataRequest: { username: true },
    });
  }

  return (
    <>
      {loading ? (
        <TH2 className="loading-text">Loading...</TH2>
      ) : (
        <div className="container">
          <header className="header-column">
            <div className="app-logo">
              <img
                src={BuildLogo}
                alt="Tonomy Logo"
                className="tonomy-logo"
                width={80}
              />
            </div>
            <div className="text-center">
              <TP className="demo-head">Tonomy Build</TP>
              <TP className="demo-main">
                Manage your Tonomy applications and infrastructure easily from one place
              </TP>

              <button className="console-login-button" onClick={onButtonPress}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span>Login with {settings.config.appName}</span>
                </div>
              </button>
            </div>
          </header>
        </div>
      )}
    </>
  );
}
