import React, { useEffect, useState } from "react";
import { api, ExternalUser, SdkError, SdkErrors } from "@tonomy/tonomy-id-sdk";
import "./UserHome.css";
import { TH1, TH3, TP } from "../../common/atoms/THeadings";
import { Highlighter } from "rc-highlight";
import "@tonomy/tonomy-id-sdk/build/api/tonomy.css";
import { useNavigate } from "react-router-dom";
import { TButton } from "../../common/atoms/TButton";
import settings from "../../common/settings";

export default function Login() {
  const [user, setUser] = useState<ExternalUser | null>(null);
  const [accountName, setAccountName] = useState<string>("");
  const [explorerUrl, setExplorerUrl] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const navigation = useNavigate();

  async function onRender() {
    try {
      const user = await api.ExternalUser.getUser();

      setUser(user);

      const accountName = await user.getAccountName();
      let url = `https://local.bloks.io/account/${accountName}?nodeUrl=`;

      url += settings.isProduction()
        ? settings.config.blockchainUrl
        : "http://localhost:8888";
      setAccountName(accountName.toString());
      setExplorerUrl(url);
      const username = await user.getUsername();

      setUsername(username.getBaseUsername());
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
        <div className="head-subtitle">
          <TP className="top">Welcome back {username}</TP>
          <TP className="bottom">
            View your account on the blockchain{" "}
            <a target={"_blank"} href={explorerUrl} rel="noreferrer">
              here
            </a>
          </TP>
        </div>
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
  userApps.onPressLogin(
  { callbackPath: "/callback" },
  new JsKeyManager()
  );
  ...
}
<button className="tonomy-login-button"
 onClick={onButtonPress}>
 Login with {Your Platform Name Here}
 </button>
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
