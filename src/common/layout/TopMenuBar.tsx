import React, { useContext, useEffect, useState } from "react";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import TonomyLogo from "../../tonomyAppList/assets/appSwitcherIcons/tonomy.png";
import "./TopMenuBar.css";
import {
  AppsExternalUser,
  ExternalUser,
  isErrorCode,
  SdkErrors,
} from "@tonomy/tonomy-id-sdk";
import { AuthContext } from "../../tonomyAppList/providers/AuthProvider";
import LogoutIcon from "@mui/icons-material/Logout";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import AppSwitcherIcon from "../../tonomyAppList/assets/app-switcher.png";
import AppSwitcher from "./AppSwitcher";
import useErrorStore from "../../common/stores/errorStore";
import Debug from "debug";
const debug = Debug("tonomy-app-websites:accounts:pages:Login");

const TopMenuBar = ({ page }) => {
  const { signout, signin } = useContext(AuthContext);
  const [username, setUsername] = useState<string>("");
  const [showSwitcher, setShowSwitcher] = useState(false);
  const [open, setOpen] = useState(false);
  const errorStore = useErrorStore();

  console.log("pagename", page);
  useEffect(() => {
    async function authentication() {
      try {
        const externalUser = await AppsExternalUser.getUser({
          autoLogout: false,
        });
        debug("externalUser", externalUser);
        if (externalUser) {
          signin(externalUser, page);
          const uname = await externalUser.getUsername();
          if (!uname) throw new Error("No username found");
          setUsername(uname.getBaseUsername());
        } else {
          setUsername("");
        }
      } catch (e) {
        console.log("e", e);
        if (
          isErrorCode(e, [
            SdkErrors.AccountNotFound,
            SdkErrors.UserNotLoggedIn,
            SdkErrors.AccountDoesntExist,
          ])
        ) {
          setUsername("");
        } else {
          errorStore.setError({ error: e, expected: false });
        }
      }
    }
    authentication();
  }, []); // watch for changes

  function handleLogout() {
    signout(page);
    setUsername("");
  }

  async function onButtonPress() {
    let callback = "/callback";
    if (page) callback = "/callback?page=" + page;
    ExternalUser.loginWithTonomy({
      callbackPath: callback,
      dataRequest: { username: true },
    });
  }

  function shouldShowAppSwitch(url) {
    const urlObj = new URL(url);
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
            src={TonomyLogo}
            alt="Tonomy Logo"
            className="tonomy-logo"
            width={37}
            height={37}
          />
          <h1 className="tonomy-main-title">Tonomy</h1>
        </a>
      </div>
      <div className="tonomy-time-container">
        {shouldShowAppSwitch(window.location.href) && (
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
            <span className="tonomy-time">Login</span>
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
