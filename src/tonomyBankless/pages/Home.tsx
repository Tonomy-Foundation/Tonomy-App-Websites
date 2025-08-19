import React, { useContext, useEffect, useState } from "react";
import { ExternalUser, isErrorCode, SdkErrors } from "@tonomy/tonomy-id-sdk";
import settings from "../../common/settings";
import "./Home.css";
import { TP, TH2 } from "../../common/atoms/THeadings";
import { useNavigate } from "react-router-dom";
import useErrorStore from "../../common/stores/errorStore";
import { AuthContext } from "../../tonomyAppList/providers/AuthProvider";
import BanklessLogo from "../assets/bankless-logo.png";

export default function Home() {
  const { signin } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigate();
  const errorStore = useErrorStore();

  async function onRender() {
    try {
      const user = await ExternalUser.getUser({ autoLogout: false });

      if (user) {
        signin(user);
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
        navigation("/bankless");
        return;
      }

      errorStore.setError({ error: e, expected: false });
    }
  }

  useEffect(() => {
    onRender();
  }, []);

  async function onButtonPress() {
    ExternalUser.loginWithTonomy({
      callbackPath: "/callback?page=bankless",
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
                src={BanklessLogo}
                alt="Tonomy Logo"
                className="tonomy-logo"
                width={80}
              />
            </div>
            <div className="text-center">
              <TP className="demo-head">Tonomy Bankless</TP>
              <TP className="demo-main">
                Swap your Tonomy coins quickly and securely — no banks, no
                middlemen, no hassle
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
