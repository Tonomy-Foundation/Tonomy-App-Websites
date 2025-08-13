import React, { useContext, useEffect } from "react";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import TonomyBanklessLogo from "../assets/tonomy-bankless.png";
import "./TopMenuBar.css";
import { ExternalUser } from "@tonomy/tonomy-id-sdk";
import { AuthContext } from "../providers/AuthProvider";
import LogoutIcon from '@mui/icons-material/Logout';

const TopMenuBar = () => {
  const {user, signout} = useContext(AuthContext);
  const [username, setUsername] = React.useState<string>("");


    async function onRender() {
      try {
        const username = await user?.getUsername();

        if (username) {
          setUsername(username.getBaseUsername());
        }
      } catch (e) {
        console.error("error", e);
      }
    }
  
    let rendered = false;
  
    useEffect(() => {
     
      if (!rendered) {
        rendered = true;
      } else {
        return;
      }
  
      onRender();
    }, []);
  

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
        {
          username ? (
            <>            <span className="tonomy-time" onClick={() => signout()}>{username}</span>
                 <LogoutIcon className="tonomy-arrow-icon" />

</>
          ) : (
            <>               <span className="tonomy-time" onClick={() => onButtonPress()}>Login</span>
     <ArrowForwardIcon className="tonomy-arrow-icon" />
</>
          )
        }
      </div>
</div>
  );
};

export default TopMenuBar;
