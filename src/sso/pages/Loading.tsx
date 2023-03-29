import { useEffect, useState } from "react";
import { TH3, TH4, TP } from "../components/THeadings";
import TImage from "../components/TImage";
import { TContainedButton } from "../components/TContainedButton";
import LogoutIcon from "@mui/icons-material/Logout";
import { TButton } from "../components/Tbutton";
import {
  Communication,
  ExternalUser,
  Message,
  UserApps,
} from "@tonomy/tonomy-id-sdk";
import JsKeyManager from "../keymanager";
import "./loading.css";
import { useCommunicationStore } from "../stores/communication.store";
import { useNavigate } from "react-router-dom";

const Loading = () => {
  const [user, setUser] = useState<ExternalUser>();
  const [username, setUsername] = useState<string>();
  const communication = useCommunicationStore((state) => state.communication);
  const navigation = useNavigate();

  useEffect(() => {
    getUser();
  }, []);

  async function getUser() {
    const verifiedJwt = await UserApps.onRedirectLogin();
    const keyManager = new JsKeyManager();

    try {
      const user = await ExternalUser.getUser(keyManager);
      const did = await user.getDid();

      setUser(user);
      const username = await user.getUsername();

      setUsername(username.username);
      const ssoMessage = await ExternalUser.signMessage(
        await user.getLoginRequest(),
        keyManager
      );
      const communicationLoginMessage = await ExternalUser.signMessage(
        {},
        keyManager
      );
      const appLoginRequest = await ExternalUser.signMessage(
        {
          requests: [verifiedJwt.jwt, ssoMessage.jwt],
        },
        keyManager,
        did
      );

      await communication.login(communicationLoginMessage);
      const result = await communication.sendMessage(appLoginRequest);

      if (result) {
        navigation("/appDetails" + location.search);
      }
    } catch (e) {
      console.log(e);
    }
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
      <div className="margin-top">
        <TImage
          src={"src/sso/assets/tonomy/connecting.png"}
          alt="Connecting Phone-PC"
        />
        <TP className="margin-top">
          Linking to phone and sending data. Please remain connected.{" "}
        </TP>
      </div>
      {!user && (
        <div>
          <TContainedButton>Cancel</TContainedButton>
        </div>
      )}
      {user && (
        <TButton
          className="logout margin-top"
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
