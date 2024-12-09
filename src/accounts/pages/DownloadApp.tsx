import React from "react";
import { TLink } from "../../common/atoms/TLink";
import { TH3, TP } from "../../common/atoms/THeadings";
import appStoreImage from "../assets/applestore.png";
import "./DownloadApp.css";
import settings from "../../common/settings";
import playStoreBadge from "../assets/googleplay.png";
import TImage from "../../common/atoms/TImage";

const isMobileDevice = () => {
  return /Mobi|Android/i.test(navigator.userAgent);
};

export default function DownloadApp() {
  const payload = localStorage.getItem("loginPayload");
  const isMobile = isMobileDevice();
  const params = new URLSearchParams(window.location.search);
  const appName = params.get("app");

  return (
    <div
      className="container"
      style={{ justifyContent: isMobile ? "flex-start" : "center" }}
    >
      <div
        style={{ display: "flex", alignItems: "center", marginBottom: "3rem" }}
      >
        <TImage src={settings.config.images.logo48} />
        <TH3 style={{ marginLeft: "10px" }}>Pangea</TH3>
      </div>
      <TH3 style={{ marginTop: isMobile ? "3rem" : "" }}>
        {settings.config.appName}
      </TH3>
      <p className="text-paragraph">
        {appName ? `${appName} is using` : "This application uses"} the Pangea
        identity system to improve your security and privacy in their
        application
      </p>
      <TP className="learn-more" style={{ marginBottom: "0px" }}>
        Learn more
      </TP>
      {isMobile ? (
        <p className="text-paragraph">
          You will need to install United Citizen Wallet and create an account
          to be able to complete your login
        </p>
      ) : (
        <p className="text-paragraph">
          You will need to install {settings.config.appName} and create an
          account to be able to scan this QR code
        </p>
      )}

      <div style={{ marginTop: "2rem", textAlign: "left" }}>
        <div>
          <a href={settings.config.links.appleStoreDownload}>
            <img
              alt="Get it on Apple store"
              width="210px"
              src={appStoreImage}
            />
          </a>
        </div>

        <div style={{ marginTop: "0.3rem" }}>
          <a href={settings.config.links.playStoreDownload}>
            <img
              alt="Get it on Google Play"
              width="210px"
              src={playStoreBadge}
            />
          </a>
        </div>
      </div>

      {payload && (
        <TP style={{ lineHeight: "26px", marginTop: "1.7rem" }}>
          Already have {settings.config.appName}?{" "}
          <TLink href={"/login?payload=" + payload}>Log in here</TLink>
        </TP>
      )}
    </div>
  );
}
