import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import {
  UserApps,
  Message,
  LoginRequest,
  STORAGE_NAMESPACE,
  api,
  LoginWithTonomyMessages,
  AuthenticationMessage,
  IdentifyMessage,
  LoginRequestsMessage,
  LoginRequestResponseMessage,
  objToBase64Url,
  SdkError,
  SdkErrors,
  ExternalUser,
} from "@tonomy/tonomy-id-sdk";
import QRCode from "react-qr-code";
import { TH3, TH4, TP } from "../components/THeadings";
import TImage from "../components/TImage";
import TProgressCircle from "../components/TProgressCircle";
import settings from "../settings";
import { isMobile } from "../utills/IsMobile";
import logo from "../assets/tonomy/tonomy-logo1024.png";
import { useNavigate } from "react-router-dom";
import { useCommunicationStore } from "../stores/communication.store";
import "./login.css";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { TButton } from "../components/Tbutton";
import { TContainedButton } from "../components/TContainedButton";
import LinkingPhone from "../molecules/LinkingPhone";

api.setSettings({
  blockchainUrl: settings.config.blockchainUrl,
  communicationUrl: settings.config.communicationUrl,
});

const styles = {
  container: {
    flex: 1,
    textAlign: "center" as const,
    alignSelf: "center",
  },
};

function Login() {
  const [status, setStatus] = useState<"qr" | "connecting" | "app">("qr");
  const [user, setUser] = useState<ExternalUser>();
  const [username, setUsername] = useState<string>();
  const [showQR, setShowQR] = useState<string>();
  const navigation = useNavigate();
  const communication = useCommunicationStore((state) => state.communication);
  const location = useLocation();

  let rendered = false;
  useEffect(() => {
    // Prevent useEffect from running twice which causes a race condition of the
    // async handleRequests() between which publicKey is sent in the request and this
    // conflicts in the publicKey that is saved in localStorage
    if (!rendered) {
      rendered = true;
    } else {
      return;
    }

    onLoad();
  }, []);

  // sends the login request to Tonomy ID via URL
  async function redirectToMobileAppUrl(requests: LoginRequest[]) {
    const payload = {
      requests,
    };

    const base64UrlPayload = objToBase64Url(payload);

    window.location.replace(
      `${settings.config.tonomyIdLink}?payload=${base64UrlPayload}`
    );

    // wait 1 second
    // if this code runs then the redirect didn't work
    setTimeout(() => {
      throw new Error("Redirect to Tonomy ID failed");
    }, 1000);
  }

  // connects to the communication server, waits for Tonomy ID to connect via QR code and then sends the login request
  async function connectToTonomyId(
    requests: LoginRequest[],
    loginToCommunication: AuthenticationMessage
  ) {
    try {
      // Login to the communication server
      await communication.login(loginToCommunication);

      // subscribe for connection from Tonomy ID, which will then send login request
      communication.subscribeMessage(async (message) => {
        setStatus("connecting");

        const identifyMessage = new IdentifyMessage(message);

        const jwkIssuer = await api.ExternalUser.getDidJwkIssuerFromStorage();
        const requestMessage = await LoginRequestsMessage.signMessage(
          {
            requests,
          },
          jwkIssuer,
          identifyMessage.getSender()
        );

        localStorage.setItem(
          STORAGE_NAMESPACE + ".tonomy.id.did",
          identifyMessage.getSender()
        );

        communication.sendMessage(requestMessage);
        setStatus("app");
      }, IdentifyMessage.getType());
    } catch (e) {
      console.error(JSON.stringify(e, null, 2));
      alert(e);
    }
  }

  // waits for the login request response from Tonomy ID then redirects to the callback url
  async function subscribeToLoginRequestResponse() {
    // subscribe for login request response
    communication.subscribeMessage(async (message: Message) => {
      const loginRequestResponsePayload = new LoginRequestResponseMessage(
        message
      ).getPayload();

      const requests = loginRequestResponsePayload.requests;

      const externalLoginRequest = requests?.find((r: LoginRequest) => {
        return r.getPayload().origin !== window.location.origin;
      });

      if (!externalLoginRequest) {
        throw new Error("No external login request found");
      }

      if (!loginRequestResponsePayload.success) {
        const error = loginRequestResponsePayload.error;

        if (!error) throw new Error("No error message found");
        const url = await UserApps.terminateLoginRequest(
          [externalLoginRequest],
          "url",
          error,
          {
            callbackOrigin: externalLoginRequest.getPayload().origin,
            callbackPath: externalLoginRequest.getPayload().callbackPath,
          }
        );

        window.location.href = url;
      } else {
        const base64UrlPayload = objToBase64Url(
          loginRequestResponsePayload
        );

        window.location.replace("/callback?payload=" + base64UrlPayload);
      }
    }, LoginRequestResponseMessage.getType());
  }

  // sends the login request to Tonomy ID, via URL or communication server
  async function sendRequestToMobile(
    requests: LoginRequest[],
    loginToCommunication: AuthenticationMessage
  ) {
    try {
      if (isMobile()) {
        await redirectToMobileAppUrl(requests);
      } else {
        const logInMessage = new LoginRequest(requests[1]);
        const did = logInMessage.getIssuer();

        setShowQR(did);

        await connectToTonomyId(requests, loginToCommunication);
        await subscribeToLoginRequestResponse();
      }
    } catch (e) {
      console.error(JSON.stringify(e, null, 2));
      alert(e);
    }
  }

  // check if user is already logged in
  async function checkLoggedIn() {
    const user = await api.ExternalUser.getUser();
    setStatus("connecting");
    setUser(user);
    const username = await user.getUsername()
    setUsername(username.getBaseUsername());
  }

  // on load, check if user logged in and if not starts login process from URL parameters
  async function onLoad() {
    try {
      await checkLoggedIn();
    } catch (e) {
      if (
        e instanceof SdkError &&
        (e.code === SdkErrors.AccountNotFound ||
          e.code === SdkErrors.UserNotLoggedIn)
      ) {
        // if the user is not logged in, then send the login requests to Tonomy ID
        const { loginRequest, loginToCommunication } =
          (await api.ExternalUser.loginWithTonomy({
            callbackPath: "/callback",
            redirect: false,
          })) as LoginWithTonomyMessages;

        const externalLoginRequest = await UserApps.onRedirectLogin();

        sendRequestToMobile(
          [externalLoginRequest, loginRequest],
          loginToCommunication
        );
      } else {
        console.error(JSON.stringify(e, null, 2));
        // TODO handle error
      }
    }
  }

  function renderQROrLoading() {
    if (!isMobile()) {
      return (
        <>
          <TP>Scan the QR code with the Tonomy ID app</TP>
          <fieldset className="fieldset-view">
            <legend className="legend-view">
              {" "}
              <TButton
                startIcon={<ContentCopyIcon></ContentCopyIcon>}
                onClick={() => navigation("/download")}
              >
                Copy request link
              </TButton>
            </legend>
            {!showQR && <TProgressCircle />}
            {showQR && <QRCode value={showQR}></QRCode>}
          </fieldset>
        </>
      );
    } else {
      return (
        <>
          <TP>Loading QR code request</TP>
          <TProgressCircle />
        </>
      );
    }
  }

  return (
    <div style={styles.container}>
      <TImage height={62} src={logo} alt="Tonomy Logo" />
      <TH3>Login with Tonomy</TH3>
      {status === "qr" && renderQROrLoading()}
      {status === "connecting" || status === "app" && (
        <>
          {user && <TH4>{username}</TH4>}
        </>
      )}
      {status === "connecting" && (
        <>
          <LinkingPhone />
        </>
      )}
      {status === "connecting" || status === "app" && (
        <>
          <div>
            <TContainedButton
              onClick={async () => {
                await cancelRequest();
              }}
            >
              Cancel
            </TContainedButton>
          </div>
          {user && (
            <TButton
              className="logout margin-top"
              onClick={logout}
              startIcon={<LogoutIcon></LogoutIcon>}
            >
              Logout
            </TButton>
        </>
      )}
    </div>
  ) as any;
}

export default Login;
