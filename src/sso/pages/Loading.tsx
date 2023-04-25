import { useEffect, useState } from "react";
import { TH3, TH4, TP } from "../components/THeadings";
import TImage from "../components/TImage";
import { TContainedButton } from "../components/TContainedButton";
import LogoutIcon from "@mui/icons-material/Logout";
import { TButton } from "../components/Tbutton";
import {
  api,
  UserApps,
  ExternalUser,
  LoginRequestsMessage,
  AuthenticationMessage,
  SdkErrors,
  base64url,
} from "@tonomy/tonomy-id-sdk";
import "./loading.css";
import { useCommunicationStore } from "../stores/communication.store";
import { useNavigate } from "react-router-dom";
import connectionImage from "../assets/tonomy/connecting.png";
import logo from "../assets/tonomy/tonomy-logo1024.png";
import { LoginRequest } from "@tonomy/tonomy-id-sdk";

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
      const issuer = await user.getIssuer();

      setUser(user);
      const username = await user.getUsername();

      setUsername(username.username);
      const ssoLoginRequest = await LoginRequest.signRequest(
        await user.getLoginRequest(),
        issuer
      );

      // get issuer from storage
      const jwkIssuer = await api.ExternalUser.getDidJwkIssuerFromStorage();
      const communicationLoginMessage =
        await AuthenticationMessage.signMessageWithoutRecipient({}, jwkIssuer);

      const appLoginRequest = await LoginRequestsMessage.signMessage(
        {
          requests: [externalLoginRequest, ssoLoginRequest],
        },
        jwkIssuer,
        issuer.did + "#local"
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

  const logout = async () => {
    // TODO
    if (user) await user.logout();
    const response = {
      success: false,
      error: {
        message: "User logged out",
        code: SdkErrors.UserLogout,
      }
    };
    const base64UrlPayload = base64url.encode(JSON.stringify(response);
    window.location.replace(`/callback?payload=${base64UrlPayload}`);
  };

  const cancelRequest = async () => {
    if (user) await user.logout();
    // window.location.href = document.referrer;
    const response = {
      success: false,
      reason: SdkErrors.UserCancelled,
    };

    window.location.replace(`/callback?response=${JSON.stringify(response)}`);
  };

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
          <TContainedButton
            onClick={async () => {
              await cancelRequest();
            }}
          >
            Cancel
          </TContainedButton>
        </div>
      )}
      {user && (
        <TButton
          className="logout margin-top"
          onClick={async () => {
            await logout();
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
