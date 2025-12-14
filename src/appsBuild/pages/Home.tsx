import React, { useContext } from "react";
import {
  AppsExternalUser,
} from "@tonomy/tonomy-id-sdk";
import settings from "../../common/settings";
import "./Home.css";
import { TP, TH2 } from "../../common/atoms/THeadings";
import { AuthContext } from "../../apps/providers/AuthProvider";
import BuildLogo from "../../apps/assets/appSwitcherIcons/Build.png";

export default function Home() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <TH2 className="loading-text">Loading...</TH2>
    );
  }

  if (user) {
    return null; // Router will handle redirect via BuildRouterContainer
  }

  async function onButtonPress() {
    AppsExternalUser.loginWithTonomy({
      callbackPath: "/callback?page=build/app-manager",
      dataRequest: { username: true },
    });
  }

  return (
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
            Manage your Tonomy applications and infrastructure easily from
            one place
          </TP>

          <button className="console-login-button" onClick={onButtonPress}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <span>Login with {settings.config.appName}</span>
            </div>
          </button>
        </div>
      </header>
    </div>
  );
}
