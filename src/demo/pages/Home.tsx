import React, { useEffect } from "react";

import { api, SdkError, SdkErrors, ExternalUser } from "@tonomy/tonomy-id-sdk";
import settings from "../settings";
import "./Home.css";
import { TH1, TH3, TP } from "../../common/atoms/THeadings";
import logo from "../assets/tonomy/tonomy-logo48.png";
import { Highlighter } from "rc-highlight";
import "@tonomy/tonomy-id-sdk/build/api/tonomy.css";
import { useNavigate } from "react-router-dom";
import useErrorStore from "../../common/stores/errorStore";

export default function Home() {
  async function onButtonPress() {
    api.ExternalUser.loginWithTonomy({ callbackPath: "/callback" });
  }

  const navigation = useNavigate();

  async function onRender() {
    try {
      await api.ExternalUser.getUser();
      // User is logged in
      navigation("/user-home");
    } catch (e) {
      if (
        e instanceof SdkError &&
        (e.code === SdkErrors.AccountNotFound ||
          e.code === SdkErrors.AccountDoesntExist ||
          e.code === SdkErrors.UserNotLoggedIn)
      ) {
        // User not logged in
        return;
      }

      console.error(e);
      alert(e);
    }
  }

  useEffect(() => {
    onRender();
  }, []);

  return (
    <div className="container">
      <div className="intro">
        <header>
          <img src={logo} alt="" />
        </header>
        <TH1>Tonomy ID DEMO</TH1>
        <TP size={2} className="text-header">
          Welcome to our Tonomy ID Demo website!
        </TP>
        <TP size={2} className="text-body">
          With Tonomy ID, you can simplify login, improve security, and enhance
          user experience by logging in to multiple applications with just one
          set of credentials. Our demo site showcases the benefits of Tonomy ID
          for both users and administrators.
        </TP>
        <div className="footer">
          <button className="tonomy-login-button" onClick={onButtonPress}>
            Login with {settings.config.appName}
          </button>
        </div>
      </div>

      <div className="docs">
        <TH3 className="title">Code Snippet</TH3>
        <div className="highlighter">
          <Highlighter>
            {`
function onButtonPress() {
  ExternalUser.loginWithTonomy({ callbackPath: "/callback" });
}
<button className="tonomy-login-button" onClick={onButtonPress}>Login with Tonomy ID</button>
`}
          </Highlighter>
        </div>

        <a
          href="https://docs.tonomy.foundation"
          className="link"
          target="_blank"
          rel="noreferrer"
        >
          View Documentation
        </a>
        <a
          href="https://github.com/Tonomy-Foundation/Tonomy-App-Websites/blob/master/src/demo/pages/Home.tsx"
          className="link footer"
          target="_blank"
          rel="noreferrer"
        >
          View on GitHub
        </a>
      </div>
    </div>
  );
}
