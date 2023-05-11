import React, { useState, useEffect } from "react";
import "./UserHome.css";
import { api, ExternalUser, SdkError, SdkErrors } from "@tonomy/tonomy-id-sdk";

import { TH3, TP } from "../../sso/components/THeadings";
import "@tonomy/tonomy-id-sdk/build/api/tonomy.css";
import { TButton } from "../../sso/components/Tbutton";

export default function TPageLeftView() {
  const [user, setUser] = useState<ExternalUser | null>(null);
  const [accountName, setAccountName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const navigation = useNavigate();

  async function onRender() {
    try {
      const user = await api.ExternalUser.getUser();

      setUser(user);

      const accountName = await user.getAccountName();

      setAccountName(accountName.toString());
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
    <>
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
    </>
  );
}
