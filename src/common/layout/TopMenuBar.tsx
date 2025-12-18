import React, { useContext, useEffect, useState } from "react";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import TonomyLogo from "../../apps/assets/appSwitcherIcons/tonomy.png";
import BuildLogo from "../../apps/assets/appSwitcherIcons/Build.png";
import BanklessLogo from "../../appsBankless/assets/bankless-logo.png";
import "./TopMenuBar.css";
import { AppsExternalUser } from "@tonomy/tonomy-id-sdk";
import { AuthContext } from "../../apps/providers/AuthProvider";
import LogoutIcon from "@mui/icons-material/Logout";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import AppSwitcherIcon from "../../apps/assets/app-switcher.png";
import AppSwitcher from "./AppSwitcher";
import useErrorStore from "../../common/stores/errorStore";

const TopMenuBar = ({ page }) => {
  const { signout, user, loading } = useContext(AuthContext);
  const [username, setUsername] = useState<string>("");
  const [showSwitcher, setShowSwitcher] = useState(false);
  const [open, setOpen] = useState(false);
  const errorStore = useErrorStore();

  function getAppName(): string {
    if (page === "bankless") return "Tonomy Bankless";
    if (page === "build") return "Tonomy Build";
    return "Tonomy Apps";
  }

  function getAppLogo() {
    if (page === "bankless") return BanklessLogo;
    if (page === "build") return BuildLogo;
    return TonomyLogo;
  }

  useEffect(() => {
    async function getUsername() {
      try {
        if (!loading && user) {
          const username = await user.getUsername();
          if (!username) throw new Error("No username found");
          setUsername(username.getBaseUsername());
        }
      } catch (e) {
        errorStore.setError({ error: e, expected: false });
      }
    }
    getUsername();
  }, [loading, user, errorStore]);

  function handleLogout() {
    signout(page);
    setUsername("");
  }

  async function onButtonPress() {
    let callback = "/callback";
    if (page) callback = "/callback?page=" + page;
    AppsExternalUser.loginWithTonomy({
      callbackPath: callback,
      dataRequest: { username: true },
    });
  }

  function shouldShowAppSwitch(): boolean {
    const urlObj = new URL(window.location.href);
    const path = urlObj.pathname;

    // Don't show if path is empty, just "/", or only contains query/hash
    return path !== "" && path !== "/";
  }

  return (
    <div className="tonomy-header">
      <div className="tonomy-title">
        <a
          href={window.location.origin}
          className="tonomy-title"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <img
            src={getAppLogo()}
            alt={getAppName() + " Logo"}
            className="tonomy-logo"
            width={37}
            height={37}
          />
          <h1 className="tonomy-main-title">{getAppName()}</h1>
        </a>
      </div>
      <div className="tonomy-time-container">
        {shouldShowAppSwitch() && (
          <div className="switcher-container">
            <img
              src={AppSwitcherIcon}
              alt="App Switcher"
              className="tonomy-logo cursor-pointer"
              width={18}
              height={18}
              onClick={() => setShowSwitcher(!showSwitcher)}
            />
            {showSwitcher && <AppSwitcher />}
          </div>
        )}

        {username ? (
          <div className="dropdown">
            {/* Trigger */}
            <div className="dropdown-trigger" onClick={() => setOpen(!open)}>
              <span className="username">@{username}</span>
              {open ? (
                <KeyboardArrowUpIcon className="arrow" />
              ) : (
                <KeyboardArrowDownIcon className="arrow" />
              )}
            </div>

            {/* Dropdown menu */}
            {open && (
              <div className="dropdown-menu cursor-pointer">
                <button className="dropdown-item" onClick={handleLogout}>
                  Log out
                  <LogoutIcon className="icon" />
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <span onClick={() => onButtonPress()} className="tonomy-time">
              Login
            </span>
            <ArrowForwardIcon
              onClick={() => onButtonPress()}
              className="tonomy-arrow-icon cursor-pointer"
            />
          </>
        )}
      </div>
    </div>
  );
};

export default TopMenuBar;
