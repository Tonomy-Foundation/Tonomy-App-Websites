import React, { useEffect, useState } from "react";
import {
  api,
  LoginRequestPayload,
  SdkError,
  SdkErrors,
} from "@tonomy/tonomy-id-sdk";
import settings from "../settings";
import "./callback.css";

export default function Callback() {
  const [payload, setPayLoad] = useState<LoginRequestPayload>();
  const [name, setName] = useState<string>();
  const [username, setUsername] = useState<string>();

  useEffect(() => {
    verifyLogin();
  }, []);

  async function verifyLogin() {
    try {
      const externalUser = await api.ExternalUser.verifyLoginRequest();
      const request: any = await externalUser.getLoginRequest();

      request.publicKey = request.publicKey.toString();

      setPayLoad(request);
      setName((await externalUser.getAccountName()).toString());
      setUsername((await externalUser.getUsername()).toString());
    } catch (e) {
      if (
        e instanceof SdkError &&
        (e.code === SdkErrors.UserCancelled || SdkErrors.UserLogout)
      ) {
        alert("User cancelled login");
        window.location.replace("/");
      } else {
        console.error(e);
      }
    }
  }

  const showJwt = () => {
    if (!payload) {
      return <h1>Loading...</h1>;
    } else {
      return (
        <div>
          <h1>Logged in</h1>
          <h2>Account: {name}</h2>
          <h2>Username: {username}</h2>
          <div className="code">
            <span className="braces">&#123;</span>
            {Object.entries(payload).map(([key, value], index: number) => {
              return (
                <div className="code-line" key={index}>
                  <div className="key">{key}:&nbsp;</div>
                  <div className="value">{value as string}</div>
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
