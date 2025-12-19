import React, { useEffect, useContext } from "react";
import { AppsExternalUser } from "@tonomy/tonomy-id-sdk";
import settings from "../../common/settings";
import "./Home.css";
import { TP, TH2 } from "../../common/atoms/THeadings";
import { AuthContext } from "../../apps/providers/AuthProvider";
import BanklessLogo from "../assets/bankless-logo.png";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const { loading, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate("swap");
    }
  }, [loading, user, navigate]);

  if (loading) {
    return <TH2 className="loading-text">Loading...</TH2>;
  }

  async function onButtonPress() {
    AppsExternalUser.loginWithTonomy({
      callbackPath: "/callback?page=bankless",
      dataRequest: { username: true },
    });
  }

  return (
    <div className="container">
      <header className="header-column">
        <div className="app-logo">
          <img
            src={BanklessLogo}
            alt="Tonomy Logo"
            className="tonomy-logo"
            width={80}
          />
        </div>
        <div className="text-center">
          <TP className="demo-head">Tonomy Bankless</TP>
          <TP className="demo-main">
            Swap your Tonomy coins quickly and securely — no banks, no
            middlemen, no hassle
          </TP>

          <button className="console-login-button" onClick={onButtonPress}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <span>Login with {settings.config.appName}</span>
            </div>
          </button>
        </div>
      </header>
    </div>
  );
}
