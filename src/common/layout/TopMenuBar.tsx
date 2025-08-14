import React, { useContext, useEffect } from "react";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import TonomyBanklessLogo from "../../tonomyAppList/assets/tonomy-bankless.png";
import "./TopMenuBar.css";
import { ExternalUser } from "@tonomy/tonomy-id-sdk";
import { AuthContext } from "../../tonomyAppList/providers/AuthProvider";
import LogoutIcon from "@mui/icons-material/Logout";
import { useUserStore } from "../../common/stores/user.store";

const TopMenuBar = ({ page }) => {
  const { signout } = useContext(AuthContext);
  const { setUser } = useUserStore();
  const [username, setUsername] = React.useState<string>("");
  console.log("pagename", page);
  useEffect(() => {
    async function authentication() {
      try {
        const user = await ExternalUser.getUser({ autoLogout: false });
        setUser(user);

        const username = await user.getUsername();
        if (!username) throw new Error("No username found");
        setUsername(username.getBaseUsername());
      } catch (e) {
        console.log("e", e);
      }
    }
    authentication();
  }, []);

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
        <ViewModuleIcon className="tonomy-arrow-icon" />
        {username ? (
          <>
            {" "}
            <span className="tonomy-time" onClick={() => signout(page)}>
              {username}
            </span>
            <LogoutIcon className="tonomy-arrow-icon" />
          </>
        ) : (
          <>
            {" "}
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
