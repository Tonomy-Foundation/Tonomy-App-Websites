import React from "react";
import {
  setSettings,
  KeyManager,
  JsKeyManager,
  ExternalUser,
} from "@tonomy/tonomy-id-sdk";
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

function Home() {
  async function onButtonPress() {
    setSettings({ ssoWebsiteOrigin: settings.config.ssoWebsiteOrigin });
    ExternalUser.loginWithTonomy(
      { callbackPath: "/callback" },
      new JsKeyManager() as unknown as KeyManager
    );
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

export default Home;
