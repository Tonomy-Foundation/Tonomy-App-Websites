import React, { useContext, useEffect, useState } from "react";
import { api, SdkError, SdkErrors, ExternalUser } from "@tonomy/tonomy-id-sdk";
import settings from "../../common/settings";
import "./Home.css";
import { TP, TH2 } from "../../common/atoms/THeadings";
import logo from "../assets/tonomy-mobile-logo.png";
import Rectangle from "../assets/Rectangle.png";
import HandImage from "../assets/handImg.png";
import "@tonomy/tonomy-id-sdk/build/api/tonomy.css";
import { useNavigate } from "react-router-dom";
import useErrorStore from "../../common/stores/errorStore";
import { AuthContext } from "../providers/AuthProvider";
import CodeSnippetPreview from "../components/CodeSnippetPreview";

const snippetCode = `
// LoginPage.jsx
async function onButtonPress() {
  await api.ExternalUser.loginWithTonomy({ callbackPath: '/callback' });
}

<button className="tonomy-login-button" onClick={onButtonPress}>Login with Tonomy ID</button>
`;

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
        <TH2 className="loadinghead">Loading...</TH2>
      ) : (
        <div className="mobile-container">
            <img className= "mobile-logo" src={logo} alt="Tonomy-logo" />
            <p className="heading1">Explore our demo features</p>
            <h1 className="mainHeading">Solution that works for you</h1>
            <p className="m-description">Simplify login and enhance security, and user experience by logging in to multiple applications with just one set of credentials</p>
            <button
                className="tonomy-login-button m-button"
                onClick={onButtonPress}
                  >
                    Login with {settings.config.appName}
                  </button>
            <div className="m-main-image">
                <img src={Rectangle} alt="mobile-view" className="m-mobile-img" />
                <img src={HandImage} alt="hand-img" className="m-hand-img" />
            </div>
        </div>
      )}
    </>
  );
}
