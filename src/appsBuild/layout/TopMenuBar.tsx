import React from "react";
import settings from "../../common/settings";
import "./TopMenuBar.css";

const TopMenuBar = () => {
  return (
    <div className="top-menu-bar">
      <img src={settings.config.images.logo48} alt="top-menu-logo" width="40" />
    </div>
  );
};

export default TopMenuBar;
