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
  randomString,
  KeyManagerLevel,
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
      const publicKey = await user.keyManager.getKey({
        level: KeyManagerLevel.BROWSER_LOCAL_STORAGE,
      });

      setUser(user);
      const username = await user.getUsername();

      setUsername(username.username);

      const payload = {
        randomString: randomString(32),
        origin: window.location.origin,
        publicKey: publicKey,
        callbackPath: "/callback",
      };

      const ssoLoginRequest = await LoginRequest.signRequest(payload, issuer);

      const communicationLoginMessage =
        await AuthenticationMessage.signMessageWithoutRecipient({}, issuer);

      const appLoginRequest = await LoginRequestsMessage.signMessage(
        {
          requests: [externalLoginRequest, ssoLoginRequest],
        },
        issuer,
        await user.getWalletDid()
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
    try {
      const { requests } = await UserApps.getLoginRequestFromUrl();
      const externalLoginRequest = requests.find(
        (r) => r.getPayload().origin !== window.location.origin
      );

      if (!externalLoginRequest)
        throw new Error("No external login request found");

      const callbackUrl = await UserApps.terminateLoginRequest(
        [externalLoginRequest],
        "url",
        {
          code: SdkErrors.UserLogout,
          reason: "User logged out",
        },
        {
          callbackOrigin: externalLoginRequest.getPayload().origin,
          callbackPath: externalLoginRequest.getPayload().callbackPath,
        }
      );

      if (user) await user.logout();

      window.location.href = callbackUrl;
    } catch (e) {
      console.error(e);
    }
  };

  const cancelRequest = async () => {
    try {
      const { requests } = await UserApps.getLoginRequestFromUrl();
      const externalLoginRequest = requests.find(
        (r) => r.getPayload().origin !== window.location.origin
      );

      if (!externalLoginRequest)
        throw new Error("No external login request found");

      const callbackUrl = await UserApps.terminateLoginRequest(
        [externalLoginRequest],
        "url",
        {
          code: SdkErrors.UserCancelled,
          reason: "User cancelled login",
        },
        {
          callbackOrigin: externalLoginRequest.getPayload().origin,
          callbackPath: externalLoginRequest.getPayload().callbackPath,
        }
      );

      if (user) await user.logout();

      window.location.href = callbackUrl;
    } catch (e) {
      console.error(e);
    }
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
