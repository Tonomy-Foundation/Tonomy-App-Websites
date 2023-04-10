import React from "react";
import { api } from "@tonomy/tonomy-id-sdk";
import settings from "../settings";
import "./Home.css";
import { TH1, TH3, TP } from "../../sso/components/THeadings";
import logo from "../assets/tonomy/tonomy-logo48.png";
import { Highlighter } from "rc-highlight";
import "https://unpkg.com/@tonomy/tonomy-id-sdk/src/api/button.css";

export default function Home() {
  async function onButtonPress() {
    api.setSettings({ ssoWebsiteOrigin: settings.config.ssoWebsiteOrigin });
    api.ExternalUser.loginWithTonomy({ callbackPath: "/callback" });
  }

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
          href="https://tonomy-id-sdk.readthedocs.io/en/latest/"
          className="link"
        >
          View Documentation
        </a>
        <a
          href="https://github.com/Tonomy-Foundation/Tonomy-App-Websites/tree/master/src/demo"
          className="link footer"
        >
          View on GitHub
        </a>
      </div>
    </div>
  );
}
