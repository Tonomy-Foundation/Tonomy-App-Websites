import React from "react";
import settings from "../../common/settings";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import TonomyBanklessLogo from "../assets/tonomy-bankless.png";
import "./TopMenuBar.css";
import TImage from "../../common/atoms/TImage";
import { ExternalUser } from "@tonomy/tonomy-id-sdk";

const TopMenuBar = () => {
   async function onButtonPress() {
      ExternalUser.loginWithTonomy({
        callbackPath: "/callback",
        dataRequest: { username: true },
      });
    }
  
  return (
    <div className="tonomy-header">
      <div className="tonomy-title">
        <img 
          src={TonomyBanklessLogo} 
          alt="Tonomy Logo" 
          className="tonomy-logo"
          width={25}
          height={25}
        />
        <h1 className="tonomy-main-title">Tonomy Bankless</h1>
      </div>
      <div className="tonomy-time-container">
        <ViewModuleIcon className="tonomy-arrow-icon" />
        <span className="tonomy-time" onClick={() => onButtonPress()}>Login</span>
        <ArrowForwardIcon className="tonomy-arrow-icon" />
      </div>
</div>
  );
};

export default TopMenuBar;
