import React, { useEffect, useState } from "react";
import {
  ExternalUser,
  JWTLoginPayload,
  KeyManager,
  UserApps,
} from "@tonomy/tonomy-id-sdk";

import JsKeyManager from "../keymanager";
import settings from "../settings";
import "./callback.css";

export default function CallBackPage() {
  const [payload, setPayLoad] = useState<JWTLoginPayload>();
  const [name, setName] = useState<string>();

  useEffect(() => {
    verifyLogin();
  }, []);

  async function verifyLogin() {
    const { result, accountName } = await ExternalUser.verifyRequests();
    const verifiedLoginSso = await ExternalUser.verifyKeyExistsForApp(
      accountName,
      new JsKeyManager() as unknown as KeyManager
    );

    if (verifiedLoginSso && result) {
      setPayLoad(result[0].getPayload() as JWTLoginPayload);
    }

    setName(accountName);
  }

  const showJwt = () => {
    if (!payload) {
      return <h1>Loading...</h1>;
    } else {
      return (
        <div>
          <h1>Logged in</h1>
          <h2>Account: {name}</h2>
          <div className="code">
            <span className="braces">&#123;</span>
            {Object.entries(payload).map(([key, value], index: number) => {
              return (
                <div className="code-line" key={index}>
                  <div className="key">{key}:&nbsp;</div>
                  <div className="value">{value}</div>
                </div>
              );
            })}
            <span className="braces">&#125;</span>
          </div>

          <a
            className="btn"
            href={
              "https://local.bloks.io/account/" +
              name +
              "?nodeUrl=" +
              settings.config.blockchainUrl
            }
          >
            Check in blockchain
          </a>
        </div>
      );
    }
  };

  return <div>{showJwt()}</div>;
}
