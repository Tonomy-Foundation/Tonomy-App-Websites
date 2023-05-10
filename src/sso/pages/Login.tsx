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
  User,
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
import { useUserStore } from "../stores/user.store";

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
  const [username, setUsername] = useState<string>();
  const [showQR, setShowQR] = useState<string>();
  const navigation = useNavigate();
  const communication = useUserStore((state) => state.communication);
  const userStore = useUserStore();

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
    // Login to the communication server
    await communication.login(loginToCommunication);

    // subscribe for connection from Tonomy ID, which will then send login request
    communication.subscribeMessage(async (message) => {
      try {
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
      } catch (e) {
        console.error(e);
        alert(e);
      }
    }, IdentifyMessage.getType());
  }

  // waits for the login request response from Tonomy ID then redirects to the callback url
  async function subscribeToLoginRequestResponse() {
    communication.subscribeMessage(async (message: Message) => {
      try {
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
          const base64UrlPayload = objToBase64Url(loginRequestResponsePayload);

          window.location.replace("/callback?payload=" + base64UrlPayload);
        }
      } catch (e) {
        console.error(e);
        alert(e);
      }
    }, LoginRequestResponseMessage.getType());
  }

  // creates SSO login request and sends the login request to Tonomy ID, via URL or communication server
  async function loginToTonomyAndSendRequests(loggedIn = false) {
    try {
      const externalLoginRequest = await UserApps.onRedirectLogin();
      const requests = [externalLoginRequest];
      let loginToCommunication: AuthenticationMessage;

      if (loggedIn === false) {
        const { loginRequest, loginToCommunication: loginToCommunicationVal } =
          (await api.ExternalUser.loginWithTonomy({
            callbackPath: "/callback",
            redirect: false,
          })) as LoginWithTonomyMessages;

        requests.push(loginRequest);
        loginToCommunication = loginToCommunicationVal;
      } else {
        const user = userStore.user as ExternalUser;

        const loginRequestPayload = await user.getLoginRequest();

        // get issuer from storage
        const jwkIssuer = await api.ExternalUser.getDidJwkIssuerFromStorage();

        // TODO we do not need to login again if we are already logged in...
        const loginRequest = await LoginRequest.signRequest(
          loginRequestPayload,
          // TODO this should be signed by the did:antelope now
          jwkIssuer
        );

        requests.push(loginRequest);

        loginToCommunication =
          await AuthenticationMessage.signMessageWithoutRecipient(
            {},
            jwkIssuer
          );
      }

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
    userStore.setUser(user);
    const username = await user.getUsername();

    setUsername(username.getBaseUsername());

    loginToTonomyAndSendRequests(true);
  }

  // check if user logged in and if not starts login process from URL parameters
  async function onLoad() {
    try {
      await checkLoggedIn();
    } catch (e) {
      if (
        e instanceof SdkError &&
        (e.code === SdkErrors.AccountNotFound ||
          e.code === SdkErrors.UserNotLoggedIn)
      ) {
        loginToTonomyAndSendRequests(false);
      } else {
        console.error(JSON.stringify(e, null, 2));
        alert(e);
      }
    }
  }

  function renderQROrLoading() {
    if (!isMobile()) {
      return (
        <>
          <TP>Scan the QR code with the Tonomy ID app</TP>
          <fieldset className="fieldset-view">
            {/* <legend className="legend-view">
              {" "}
              <TButton
                startIcon={<ContentCopyIcon></ContentCopyIcon>}
                onClick={() => navigation("/download")}
              >
                Copy request link
              </TButton>
          </legend> */}
            {!showQR && <TProgressCircle />}
            {showQR && <QRCode value={showQR}></QRCode>}
          </fieldset>
          <TContainedButton onClick={() => navigation("/download")}>
            Don't have Tonomy ID yet?
          </TContainedButton>
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

  const logout = async () => {
    try {
      const { requests } = await UserApps.getLoginRequestFromUrl();

      const callbackUrl = await UserApps.terminateLoginRequest(
        requests,
        "url",
        {
          code: SdkErrors.UserLogout,
          reason: "User logged out",
        },
        {
          callbackOrigin: requests[0].getPayload().origin,
          callbackPath: requests[0].getPayload().callbackPath,
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

      const callbackUrl = await UserApps.terminateLoginRequest(
        requests,
        "url",
        {
          code: SdkErrors.UserCancelled,
          reason: "User cancelled login",
        },
        {
          callbackOrigin: requests[0].getPayload().origin,
          callbackPath: requests[0].getPayload().callbackPath,
        }
      );

      if (user) await user.logout();

      window.location.href = callbackUrl;
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={styles.container}>
      <TImage height={62} src={logo} alt="Tonomy Logo" />
      <TH3>Login with Tonomy</TH3>
      {status === "qr" && renderQROrLoading()}
      {(status === "connecting" || status === "app") && (
        <>{username && <TH4>{username}</TH4>}</>
      )}
      {status === "connecting" && (
        <>
          <LinkingPhone />
        </>
      )}
      {(status === "connecting" || status === "app") && (
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
          {userStore.user && (
            <TButton
              className="logout margin-top"
              onClick={logout}
              startIcon={<LogoutIcon></LogoutIcon>}
            >
              Logout
            </TButton>
          )}
        </>
      )}
    </div>
  ) as any;
}

export default Login;
