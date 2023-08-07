import React from "react";
import { TA } from "../../common/atoms/TA";
import { TH4, TH3, TP } from "../../common/atoms/THeadings";
import appStoreImage from "../assets/app-store.svg";
import "./DownloadApp.css";
import settings from "../../common/settings";
import playStoreBadge from "../assets/google-play-badge.png";

export default function DownloadApp() {
  return (
    <div className="container">
      <TH3>Tonomy ID</TH3>
      <TH4>The easiest and safest way to access Tonomy apps</TH4>
      <TP className="paragraph">
        Tonomy ID is a self-sovereign identity digital wallet that protects your
        security and privacy. &nbsp;
        <TA href={settings.config.links.readMoreDownload}>Learn more</TA>
      </TP>

      <TP className="margin-bottom paragraph">
        It is open-source and maintained by the Tonomy Foundation.{" "}
        <TA>Learn more</TA>
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
      <TP>
        Already have Tonomy? <TA href="/login">Log in here</TA>
      </TP>
    </div>
  );
}
