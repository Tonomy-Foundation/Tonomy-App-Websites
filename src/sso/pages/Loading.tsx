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
  objToBase64Url,
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
    try {
      const externalLoginRequest = await UserApps.onRedirectLogin();

      const user = await api.ExternalUser.getUser();
      const issuer = await user.getIssuer();

      setUser(user);
      const username = await user.getUsername();

      setUsername(username.username);
      const request = await user.getLoginRequest();

      // get issuer from storage
      const jwkIssuer = await api.ExternalUser.getDidJwkIssuerFromStorage();

      // TODO we do not need to login again if we are already logged in...
      const ssoLoginRequest = await LoginRequest.signRequest(
        request,
        // TODO this should be signed by the did:antelope now
        jwkIssuer
      );

      const communicationLoginMessage =
        await AuthenticationMessage.signMessageWithoutRecipient({}, jwkIssuer);

      const appLoginRequest = await LoginRequestsMessage.signMessage(
        {
          requests: [externalLoginRequest, ssoLoginRequest],
        },
        jwkIssuer,
        issuer.did
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
    if (user) await user.logout();
    const response = {
      success: false,
      error: {
        message: "User logged out",
        code: SdkErrors.UserLogout,
      },
    };
    const base64UrlPayload = objToBase64Url(response);

    // TODO this should send back to external website
    window.location.replace(`/callback?payload=${base64UrlPayload}`);
  };

  const cancelRequest = async () => {
    if (user) await user.logout();
    const response = {
      success: false,
      error: {
        message: "User cancelled login out",
        code: SdkErrors.UserCancelled,
      },
    };
    const base64UrlPayload = objToBase64Url(response);

    // TODO this should send back to external website
    window.location.replace(`/callback?payload=${base64UrlPayload}`);
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
