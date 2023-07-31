import React from "react";
import { api } from "@tonomy/tonomy-id-sdk";
import settings from "../../common/settings";
import "./Home.css";
import { TP } from "../../common/atoms/THeadings";
import logo from "/tonomy-logo48.png";
import Rectangle from "../assets/Rectangle.png";
import HandImage from "../assets/handImg.png";
import "@tonomy/tonomy-id-sdk/build/api/tonomy.css";

export default function Home() {
  async function onButtonPress() {
    api.ExternalUser.loginWithTonomy({ callbackPath: "/callback" });
  }

  return (
    <div className="container">
      <div className="intro">
        <header>
          <div className="box">
            <img src={logo} alt="Tonomy-logo" />
            <div className="box-heading">
              <span>Tonomy ID</span>
              <div className="box-subheading">demo</div>
            </div>
          </div>
          <div className="intro-container">
            <TP className="demo-head">Explore our demo features</TP>
            <TP className="demo-main">Solution that works for you.</TP>

            <TP className="text-body">
              Simplify login, improve security, and enhance user experience by
              logging in to multiple applications with just one set of
              credentials.
            </TP>
            <div className="footer">
              <button className="tonomy-login-button" onClick={onButtonPress}>
                Login with {settings.config.appName}
              </button>
            </div>
          </div>
        </header>
      </div>

      <div className="docs">
        <img src={Rectangle} alt="mobile-view" className="mobile-img" />
        <img src={HandImage} alt="hand-img" className="hand-img" />
      </div>
    </div>
  );
}
