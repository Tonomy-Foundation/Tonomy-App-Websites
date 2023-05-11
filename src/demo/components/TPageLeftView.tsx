import React from "react";
import "./UserHome.css";
import { TH3, TP } from "../../sso/components/THeadings";
import "@tonomy/tonomy-id-sdk/build/api/tonomy.css";
import { TButton } from "../../sso/components/Tbutton";

export default function TPageLeftView() {
  return (
    <div className="intro">
      <TP className="head-subtitle">You are now logged in with Tonomy ID.</TP>
      <TP>
        Anonymous account: {accountName} (
        <a
          target={"_blank"}
          href={
            "https://local.bloks.io/account/" +
            accountName +
            "?nodeUrl=http://localhost:8888"
          }
          rel="noreferrer"
        >
          view on the blockchain
        </a>
        )
      </TP>
      <TP>Username: {username}</TP>
      <TH3 className="text-title">Home</TH3>
      <TP className="text-header">
        Our demo site showcases the benefits of Tonomy ID for both users and
        administrators. <br />
        As a user, you now have access to a variety of features.
      </TP>
      <div className="example-container">
        <TP>
          You can create a verifiable data by using our built-in tools to create
          and manage your own digital certificates
        </TP>
        <button className="tonomy-login-button">
          SIGN W3C VERIFIABLE CREDENTIALS
        </button>
      </div>
      <div className="example-container">
        <TP>
          You can sign blockchain transactions using our secure system and your
          private key.
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
  );
}
