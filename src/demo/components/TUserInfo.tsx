import React, { useState, useEffect } from "react";
import "./TUserInfo.css";
import { api } from "@tonomy/tonomy-id-sdk";
import { TP } from "../../common/atoms/THeadings";
import "@tonomy/tonomy-id-sdk/build/api/tonomy.css";
import { useUserStore } from "../../common/stores/user.store";
import useErrorStore from "../../common/stores/errorStore";
import settings from "../../common/settings";

export default function TUserInfo() {
  const [username, setUsername] = useState<string>("");
  const [accountName, setAccountName] = useState<string>("");
  const userStore = useUserStore();
  const user = userStore.user;
  const errorStore = useErrorStore();

  async function onRender() {
    try {
      const username = await user?.getUsername();

      setUsername(username?.getBaseUsername());

      const accountName = await user?.getAccountName();

      setAccountName(accountName?.toString());
    } catch (e) {
      errorStore.setError({ error: e, expected: false });
    }
  }

  useEffect(() => {
    onRender();
  }, []);
  return (
    <div className="head-subtitle">
      <TP>You are now logged in with Tonomy ID, as {username}</TP>
      <TP>
        View your account on the blockchain{" "}
        <a
          target={"_blank"}
          href={
            "https://local.bloks.io/account/" +
            accountName +
            "?nodeUrl=" +
            settings.isProduction()
              ? settings.config.blockchainUrl
              : "http://localhost:8888"
          }
          rel="noreferrer"
        >
          here
        </a>
      </TP>
    </div>
  );
}
