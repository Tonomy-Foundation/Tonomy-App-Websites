import React, { useContext, useEffect, useState } from "react";
import { api, SdkError, SdkErrors } from "@tonomy/tonomy-id-sdk";
import settings from "../../common/settings";
import "./Home.css";
import { TP, TH2 } from "../../common/atoms/THeadings";
import logo from "../assets/favicon.png";
import Rectangle from "../assets/Rectangle.png";
import HandImage from "../assets/handImg.png";
import "@tonomy/tonomy-id-sdk/build/api/tonomy.css";
import { useNavigate } from "react-router-dom";
import useErrorStore from "../../common/stores/errorStore";
import { AuthContext } from "../providers/AuthProvider";
import CodeSnippetPreview from "../components/CodeSnippetPreview";
import mobileLogo from "../assets/tonomy-mobile-logo.png";

const snippetCode = `
// LoginPage.jsx
async function onButtonPress() {
  await api.ExternalUser.loginWithTonomy({ callbackPath: '/callback' });
}

<button className="tonomy-login-button" onClick={onButtonPress}>Login with Pangea</button>
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
        <TH2 className="loading-text">Loading...</TH2>
      ) : (
        <div className="container">
          <div className="intro">
            <header>
              <div className="box">
                <img src={logo} className="display-none" alt="Tonomy-logo" />
                <img
                  src={mobileLogo}
                  className="mobile-logo"
                  alt="Tonomy-logo"
                />

                <div className="box-heading display-none">
                  <span>Pangea demo</span>
                </div>
              </div>
              <div className="intro-container">
                <TP className="demo-head">Explore our demo features</TP>
                <TP className="demo-main">Solution that works for you.</TP>

                <TP className="text-body">
                  Simplify login, improve security, and enhance user experience
                  by logging in to multiple applications with just one set of
                  credentials.
                </TP>
                <div className="footer">
                  <button
                    className="tonomy-login-button"
                    onClick={onButtonPress}
                  >
                    Login with {settings.config.appName}
                  </button>
                </div>
              </div>

              <div className="snippet display-none">
                <CodeSnippetPreview
                  snippetCode={snippetCode}
                  documentationLink="https://docs.pangea.web4.world/start/single-sign-on/#2-login-page"
                />
              </div>
            </header>
          </div>

          <div className="main-image">
            <img src={Rectangle} alt="mobile-view" className="mobile-img" />
            <img src={HandImage} alt="hand-img" className="hand-img" />
          </div>
        </div>
      )}
    </>
  );
}
