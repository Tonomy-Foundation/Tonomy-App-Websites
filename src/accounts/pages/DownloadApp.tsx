import React from "react";
import { TLink } from "../../common/atoms/TLink";
import { TH4, TH3, TP } from "../../common/atoms/THeadings";
import appStoreImage from "../assets/app-store.svg";
import "./DownloadApp.css";
import settings from "../../common/settings";
import playStoreBadge from "../assets/google-play-badge.png";
import { useWalletRequestsStore } from "../stores/loginStore";

export default function DownloadApp() {
  const { payload } = useWalletRequestsStore();

  return (
    <div className="container">
      <TH3>{settings.config.appName}</TH3>
      <TH4>
        The easiest and safest way to access {settings.config.ecosystemName}{" "}
        apps
      </TH4>
      <TP className="paragraph">
        {settings.config.appName} is a self-sovereign identity digital wallet
        that protects your security and privacy. &nbsp;
        <TLink href={settings.config.links.readMoreDownload} target="_blank">
          Learn more
        </TLink>
      </TP>

      <TP className="margin-bottom paragraph">
        It is open-source and maintained by the Tonomy Foundation.{" "}
        <TLink href={settings.config.links.readMoreFoundation} target="_blank">
          Learn more
        </TLink>
      </TP>
      <div>
        <a href={settings.config.links.appleStoreDownload}>
          <img alt="Get it on Apple store" width="200px" src={appStoreImage} />
        </a>
      </div>

      <div>
        <a href={settings.config.links.playStoreDownload}>
          <img alt="Get it on Google Play" width="230px" src={playStoreBadge} />
        </a>
      </div>
      {payload && (
        <TP>
          Already have {settings.config.appName}?{" "}
          <TLink href={"/login?payload=" + payload}>Log in here</TLink>
        </TP>
      )}
    </div>
  );
}
