import React from "react";
import "./TopMenuBar.css";
import TopMenuLogo from "../assets/top-logo.png";

const TopMenuBar = () => {
  return (
    <div className="top-menu-bar">
      <img src={TopMenuLogo} alt="top-menu-logo" width="40" />
    </div>
  );
};

export default TopMenuBar;
