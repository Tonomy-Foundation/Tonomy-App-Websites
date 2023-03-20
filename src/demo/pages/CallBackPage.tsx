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
    const externalUser = await ExternalUser.verifyLoginRequest({
      keyManager: new JsKeyManager(),
    });

    setPayLoad(await externalUser.getLoginRequest());

    setName((await externalUser.getAccountName()).toString());
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
            target={"_blank"}
            href={
              "https://local.bloks.io/account/" +
              name +
              "?nodeUrl=" +
              settings.config.blockchainUrl
            }
            rel="noreferrer"
          >
            Check in blockchain
          </a>
        </div>
      );
    }
  };

  return <div>{showJwt()}</div>;
}
