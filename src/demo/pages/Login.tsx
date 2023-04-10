import React from "react";
import { api, setSettings } from "@tonomy/tonomy-id-sdk";
import settings from "../settings";
import "./tonomy.css";

setSettings({
  blockchainUrl: settings.config.blockchainUrl,
});

const styles = {
  container: {
    flex: 1,
    textAlign: "center" as const,
    alignSelf: "center",
  },
};

export default function Login() {
  async function onButtonPress() {
    api.setSettings({ ssoWebsiteOrigin: settings.config.ssoWebsiteOrigin });
    api.ExternalUser.loginWithTonomy({ callbackPath: "/callback" });
  }

  return (
    <div style={styles.container}>
      <img src={"market.com.png"} />
      <button className="tonomy" onClick={onButtonPress}>
        Login with {settings.config.appName}
      </button>
    </div>
  );
}
