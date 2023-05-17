import React, { useState, useEffect } from "react";
import "./TUserInfo.css";
import { api } from "@tonomy/tonomy-id-sdk";
import { TP } from "../../common/atoms/THeadings";
import "@tonomy/tonomy-id-sdk/build/api/tonomy.css";
import { useUserStore } from "../../sso/stores/user.store";
import useErrorStore from "../../common/stores/errorStore";
import settings from "../../common/settings";

export default function TUserInfo() {
  const [username, setUsername] = useState<string>("");
  const userStore = useUserStore();
  const errorStore = useErrorStore();

  async function onRender() {
    try {
      const user = await api.ExternalUser.getUser();

      userStore.setUser(user);

      const username = await user.getUsername();

      setUsername(username.getBaseUsername());
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
          href={settings.config.blockchainUrl}
          rel="noreferrer"
        >
          here
        </a>
      </TP>
    </div>
  );
}
