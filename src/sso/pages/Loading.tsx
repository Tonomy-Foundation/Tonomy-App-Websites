import { useEffect, useState } from "react";
import { TH3, TH4, TP } from "../components/THeadings";
import TImage from "../components/TImage";
import { TContainedButton } from "../components/TContainedButton";
import LogoutIcon from "@mui/icons-material/Logout";
import { TButton } from "../components/Tbutton";
import { Communication, ExternalUser } from "@tonomy/tonomy-id-sdk";
import JsKeyManager from "../keymanager";
import "./loading.css";

const Loading = () => {
  const [user, setUser] = useState<ExternalUser>();
  const [username, setUsername] = useState<string>();
  const communication = new Communication();

  useEffect(() => {
    getUser();
  }, []);

  async function getUser() {
    ExternalUser.getUser(new JsKeyManager()).then((user) => {
      setUser(user);
      user.getUsername().then((uname) => setUsername(uname.username));
    });
  }

  return (
    <div className="container">
      <TImage
        height={60}
        src={"src/sso/assets/tonomy/tonomy-logo1024.png"}
        alt="Tonomy Logo"
      />
      <TH3>{"Tonomy"}</TH3>
      {user && <TH4>{username}</TH4>}
      <div>
        <TImage
          src={"src/sso/assets/tonomy/connecting.png"}
          alt="Connecting Phone-PC"
        />
        <TP>Linking to phone and sending data. Please remain connected. </TP>
      </div>
      {!user && (
        <div>
          <TContainedButton>Cancel</TContainedButton>
        </div>
      )}
      {user && (
        <TButton
          className="logout"
          onClick={() => {
            //TODO: logout
          }}
          startIcon={<LogoutIcon></LogoutIcon>}
        >
          Logout
        </TButton>
      )}
    </div>
  );
};

export default Loading;
