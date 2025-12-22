import React, { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AppsIcon from "@mui/icons-material/Apps";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import IconButton from "@mui/material/IconButton";
import { formatAppUsername } from "../common/formatUsername";
import { useApps } from "../context/AppsContext";
import "./AppsManagerHeader.css";

type AppsManagerHeaderProps = {
  children?: ReactNode;
};

export default function AppsManagerHeader({
  children,
}: AppsManagerHeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { getAppByUsername } = useApps();

  // Show back button only on app viewer/editor pages (apps/:username)
  const usernameMatch = location.pathname.match(/\/apps\/([^/]+)(\/|$)/);
  const username = usernameMatch ? usernameMatch[1] : null;
  const showBackButton = !!username;

  const app = username ? getAppByUsername(username) : null;
  const appUsername = app ? formatAppUsername(app.appUsername) : null;

  const handleBack = () => {
    navigate("/build/apps");
  };

  return (
    <header className="apps-manager-header">
      <div className="header-content">
        {showBackButton && (
          <IconButton onClick={handleBack} className="back-button" size="small">
            <ArrowBackIcon />
          </IconButton>
        )}
        {app && app.logoUrl ? (
          <img src={app.logoUrl} alt="app-logo" className="header-app-logo" />
        ) : (
          <AppsIcon className="header-icon" />
        )}
        <h1 className="header-title">
          {appUsername ? appUsername : "Apps Manager"}
        </h1>
        {children}
      </div>
    </header>
  );
}
