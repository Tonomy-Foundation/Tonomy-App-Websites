import React from "react";
import user from "../assets/user.png";
import VCBanner from "../assets/VC-banner.png";
import "./newW3CVCs.css";

export default function W3CVCs() {
  return (
    <div className="containerVC">
      <div className="userSectionVC">
        <p className="leftText sign-dcoument">Feature Name: Sign Document</p>
        <p className="userLogoVC">
          <img src={user} alt="userLogo" />
          <span>Jack Tanner</span>
        </p>
      </div>
      <div className="gridView">
        <div className="leftSection">
          <div className="headSection">
            <p className="howText">How to use:</p>
            <p className="tonomy-head">Tonomy ID</p>
          </div>
          <p className="paraDetail">
            Sign and verify sensitive information with Tonomy ID. The W3C
            Verifiable Credential standard can help ensure trust and security
            when sharing sensitive and tamper-proof data.
          </p>
          <a href="#" className="paraLink">
            Learn about the W3C Verifiable Credentials {`->`}
          </a>
          <p className="demoLink">Enter Demo</p>
        </div>
        <div className="rightSection">
          <img src={VCBanner} alt="banner-image" className="bannerImg" />
        </div>
      </div>
    </div>
  );
}
