import { useEffect, useState } from "react";
import { TH3, TH4, TP } from "../components/THeadings";
import TImage from "../components/TImage";
import { TContainedButton } from "../components/TContainedButton";
import LogoutIcon from "@mui/icons-material/Logout";
import { TButton } from "../components/Tbutton";
import {
  api,
  MessageType,
  UserApps,
  ExternalUser,
  LoginRequest,
  createVCSigner,
  KeyManagerLevel,
} from "@tonomy/tonomy-id-sdk";
import "./loading.css";
import { useCommunicationStore } from "../stores/communication.store";
import { useNavigate } from "react-router-dom";
import connectionImage from "../assets/tonomy/connecting.png";
import logo from "../assets/tonomy/tonomy-logo1024.png";

const Loading = () => {
  const [user, setUser] = useState<ExternalUser>();
  const [username, setUsername] = useState<string>();
  const communication = useCommunicationStore((state) => state.communication);
  const navigation = useNavigate();

  useEffect(() => {
    getUser();
  }, []);

  async function getUser() {
    const externalLoginRequest = await UserApps.onRedirectLogin();

    try {
      const user = await api.ExternalUser.getUser();
      const did = await user.getDid();
      const issuer = {
        did: did,
        signer: createVCSigner(
          user.keyManager,
          KeyManagerLevel.BROWSER_LOCAL_STORAGE
        ),
        alg: "ES256K-R",
      };

      setUser(user);
      const username = await user.getUsername();

      setUsername(username.username);
      const ssoLoginRequest = await LoginRequest.sign(
        user.getLoginRequest(),
        issuer
      );

      const communicationLoginMessage = await api.ExternalUser.signMessage(
        {},
        undefinded,
        { type: MessageType.COMMUNICATION_LOGIN }
      );
      const appLoginRequest = await api.ExternalUser.signMessage(
        {
          requests: [
            externalLoginRequest.toString(),
            ssoLoginRequest.toString(),
          ],
        },
        did + "#local",
        {
          type: MessageType.LOGIN_REQUEST,
        }
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
      <TImage height={60} src={logo} alt="Tonomy Logo" />
      <TH3>{"Tonomy"}</TH3>
      {user && <TH4>{username}</TH4>}
      <div className="margin-top">
        <TImage src={connectionImage} alt="Connecting Phone-PC" />
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
