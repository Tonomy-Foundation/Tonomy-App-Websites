import React, { useContext, useEffect } from "react";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import TonomyBanklessLogo from "../../tonomyAppList/assets/tonomy-bankless.png";
import "./TopMenuBar.css";
import { App, ExternalUser } from "@tonomy/tonomy-id-sdk";
import { AuthContext } from "../../tonomyAppList/providers/AuthProvider";
import LogoutIcon from "@mui/icons-material/Logout";
import { useUserStore } from "../../common/stores/user.store";
import AppSwitcherIcon from "../../tonomyAppList/assets/app-switcher.png";

const TopMenuBar = ({ page }) => {
  const { user, signout, signin } = useContext(AuthContext);
  const [username, setUsername] = React.useState<string>("");
  console.log("pagename", page);
 useEffect(() => {
  async function authentication() {
    try {
      const externalUser = await ExternalUser.getUser({ autoLogout: false });
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
      setUsername("");
    }
  }
  authentication();
}, [user, page]); // watch for changes

function handleLogout() {
  signout(page);
  setUsername(""); // clear local state so UI updates instantly
}

  // async function onRender() {
  //   try {
  //     const username = await user?.getUsername();

  //     if (username) {
  //       setUsername(username.getBaseUsername());
  //     }
  //   } catch (e) {
  //     console.error("error", e);
  //   }
  // }

  // let rendered = false;

  // useEffect(() => {
  //   if (!rendered) {
  //     rendered = true;
  //   } else {
  //     return;
  //   }

  //   onRender();
  // }, []);

  async function onButtonPress() {
    let callback = "/callback";
    if (page) callback = "/callback?page=" + page;
    ExternalUser.loginWithTonomy({
      callbackPath: callback,
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
        <img
          src={AppSwitcherIcon}
          alt="Tonomy Logo"
          className="tonomy-logo"
          width={18}
          height={18}
        />
        {user ? (
          <>
    <span className="tonomy-time" onClick={handleLogout}>
              {username}
            </span>
            <LogoutIcon className="tonomy-arrow-icon" />
          </>
        ) : (
          <>
            <span className="tonomy-time" onClick={() => onButtonPress()}>
              Login
            </span>
            <ArrowForwardIcon className="tonomy-arrow-icon" />
          </>
        )}
      </div>
    </div>
  );
};

export default TopMenuBar;
