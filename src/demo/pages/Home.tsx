import React, { useContext, useEffect } from "react";
import { api, SdkError, SdkErrors } from "@tonomy/tonomy-id-sdk";
import settings from "../../common/settings";
import "./Home.css";
import { TP } from "../../common/atoms/THeadings";
import logo from "/tonomy-logo48.png";
import Rectangle from "../assets/Rectangle.png";
import HandImage from "../assets/handImg.png";
import "@tonomy/tonomy-id-sdk/build/api/tonomy.css";
import { useNavigate } from "react-router-dom";
import useErrorStore from "../../common/stores/errorStore";
import { AuthContext } from "../providers/AuthProvider";

export default function Home() {
  const { login } = useContext(AuthContext);

  const navigation = useNavigate();
  const errorStore = useErrorStore();

  async function onRender() {
    try {
      const user = await api.ExternalUser.getUser({ autoLogout: false });

      if (user) navigation("/user-home");
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

  return (
    <div className="container">
      <div className="intro">
        <header>
          <div className="box">
            <img src={logo} alt="Tonomy-logo" />
            <div className="box-heading">
              <span>Tonomy ID</span>
              <div className="box-subheading">demo</div>
            </div>
          </div>
          <div className="intro-container">
            <TP className="demo-head">Explore our demo features</TP>
            <TP className="demo-main">Solution that works for you.</TP>

            <TP className="text-body">
              Simplify login, improve security, and enhance user experience by
              logging in to multiple applications with just one set of
              credentials.
            </TP>
            <div className="footer">
              <button className="tonomy-login-button" onClick={() => login()}>
                Login with {settings.config.appName}
              </button>
            </div>
          </div>
        </header>
      </div>

      <div className="docs">
        <img src={Rectangle} alt="mobile-view" className="mobile-img" />
        <img src={HandImage} alt="hand-img" className="hand-img" />
      </div>
    </div>
  );
}
