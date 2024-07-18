import React, { useContext, useEffect, useState } from "react";
import { api, SdkError, SdkErrors } from "@tonomy/tonomy-id-sdk";
import settings from "../../common/settings";
import "./Home.css";
import { TP, TH2 } from "../../common/atoms/THeadings";
import { useNavigate } from "react-router-dom";
import useErrorStore from "../../common/stores/errorStore";
import { AuthContext } from "../providers/AuthProvider";

export default function Home() {
  const { signin } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigate();
  const errorStore = useErrorStore();

  async function onRender() {
    try {
      const user = await api.ExternalUser.getUser({ autoLogout: false });

      if (user) {
        signin(user);
      }

      setLoading(false);
    } catch (e) {
      if (
        e instanceof SdkError &&
        (e.code === SdkErrors.AccountNotFound ||
          e.code === SdkErrors.AccountDoesntExist ||
          e.code === SdkErrors.UserNotLoggedIn)
      ) {
        // User not logged in
        setLoading(false);
        navigation("/");
        return;
      }

      errorStore.setError({ error: e, expected: false });
    }
  }

  useEffect(() => {
    onRender();
  }, []);

  async function onButtonPress() {
    api.ExternalUser.loginWithTonomy({
      callbackPath: "/callback",
      dataRequest: { username: true },
    });
  }

  return (
    <>
      {loading ? (
        <TH2 className="loading-text">Loading...</TH2>
      ) : (
        <div className="container">
          <header>
            <div className="box">
              <div className="box-heading">
                <span>Need help ?</span>
              </div>
            </div>
            <div className="app-logo">
              <img
                src={settings.config.images.logo1024}
                alt={`${settings.config.appName} Logo`}
                width="120px"
              />
            </div>
            <div className="text-center">
              <TP className="demo-head">Tonomy Developer Console</TP>
              <TP className="demo-main">Building ecosystem of Trust</TP>

              <button className="console-login-button" onClick={onButtonPress}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <img
                    src={settings.config.images.logo48}
                    alt={`${settings.config.appName} Logo`}
                    className="btnImage"
                  />
                  <span>Login with {settings.config.appName}</span>
                </div>
              </button>
              <div className="bottom-text">
                <p>By creating an account, you agree to our</p>
                <p>
                  <span className="blue-color">Terms & Conditions </span>
                  and agree to{" "}
                  <span className="blue-color">Privacy Policy</span>
                </p>
              </div>
            </div>
          </header>
        </div>
      )}
    </>
  );
}
