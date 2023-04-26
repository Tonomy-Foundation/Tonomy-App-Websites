import React, { useEffect } from "react";
import { api, SdkError, SdkErrors } from "@tonomy/tonomy-id-sdk";
import settings from "../settings";
import { api, SdkError, SdkErrors, ExternalUser } from "@tonomy/tonomy-id-sdk";
import "./Home.css";
import { TH1, TH3, TP } from "../../sso/components/THeadings";
import { Highlighter } from "rc-highlight";
import "@tonomy/tonomy-id-sdk/build/api/tonomy.css";

export default function Home() {
  async function onButtonPress() {
    api.ExternalUser.loginWithTonomy({ callbackPath: "/callback" });
  }

  async function onRender() {
    try {
      const user = await api.ExternalUser.getUser();

      const accountName = await user.getAccountName();

      console.log("Logged in as", accountName.toString());
      // TODO take user to logged in page
    } catch (e) {
      if (e instanceof SdkError && e.code === SdkErrors.AccountNotFound) {
        // User not logged in
        return;
      }

      alert(e);
    }
  }

  useEffect(() => {
    onRender();
  }, []);

  return (
    <div className="container">
      <div className="intro">
        <TP className="head-subtitle">You are now logged in with Tonomy ID.</TP>
        <TH3 className="text-title">Home</TH3>
        <TP className="text-header">
          Our demo site showcases the benefits of Tonomy ID for both users and
          administrators. <br />
          As a user, you now have access to a variety of features.
        </TP>
        <div className="example-container">
          <TP>
            You can create a verifiable data by using our built-in tools to
            create and manage your own digital certificates
          </TP>
          <button className="tonomy-login-button">
            SIGN W3C VERIFIABLE CREDENTIALS
          </button>
        </div>
        <div className="example-container">
          <TP>
            You can sign blockchain transactions using our secure system and
            your private key.
          </TP>
          <button className="tonomy-login-button">
            SIGN BLOCKCHAIN TRANSACTIONS
          </button>
        </div>
        <div className="example-container">
          <TP>
            Additionally, you can send messages to other users of Tonomy ID,
            allowing for easy communication and collaboration.
          </TP>
          <button className="tonomy-login-button">
            SEND PEER TO PEER MESSAGES
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
