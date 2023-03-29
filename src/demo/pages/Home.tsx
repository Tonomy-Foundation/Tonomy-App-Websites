import React from "react";
import { setSettings, KeyManager, ExternalUser } from "@tonomy/tonomy-id-sdk";
import JsKeyManager from "../keymanager";
import settings from "../settings";
import "./Home.css";
import { TH1, TH3, TP } from "../../sso/components/THeadings";
import { TContainedButton } from "../../sso/components/TContainedButton";
import logo from "../assets/tonomy/tonomy-logo48.png";

function Home() {
  async function onButtonPress() {
    setSettings({ ssoWebsiteOrigin: settings.config.ssoWebsiteOrigin });
    ExternalUser.loginWithTonomy(
      { callbackPath: "/callback" },
      new JsKeyManager() as unknown as KeyManager
    );
  }

  return (
    <div className="container">
      <div className="intro">
        <header>
          <img src={logo} alt="" />
        </header>
        <TH1>Tonomy ID DEMO</TH1>
        <TH3>Welcome to our Tonomy ID Demo website!</TH3>
        <TH3>
          With Tonomy ID, you can simplify login, improve security, and enhance
          user experience by logging in to multiple applications with just one
          set of credentials. Our demo site showcases the benefits of Tonomy ID
          for both users and administrators.
        </TH3>
        <TContainedButton>
          Login with {settings.config.appName}
        </TContainedButton>
      </div>

      <div className="docs">
        <TH3>Code Snippet</TH3>
        <pre>
          <code>
            {/* function onButtonPress() {
    userApps.onPRessLogin(
       { callbackPath: "/callback" }, 
       new JsKeyManager()
         );
    }
      
    <button className="tonomy" 
    onClick={onButtonPress}> Login with {Your Platform Name Here}
     </button>
     <img src={"market.com.png"} />
      <button className="tonomy" onClick={onButtonPress}>
            Login with {settings.config.appName}
    </button> */}
          </code>
        </pre>

        <a href="">View Documentation</a>
        <a href="">View on GitHub</a>
      </div>
    </div>
  );
}

export default Home;
