import React, { useEffect, useState } from "react";
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
  App,
} from "@tonomy/tonomy-id-sdk";
import { TH3, TH4, TP } from "../../common/atoms/THeadings";
import TImage from "../../common/atoms/TImage";
import TProgressCircle from "../../common/atoms/TProgressCircle";
import settings from "../../common/settings";
import { isMobile } from "../utils/IsMobile";
import logo from "/tonomy-logo1024.png";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { TButton } from "../../common/atoms/TButton";
import { TContainedButton } from "../../common/atoms/TContainedButton";
import LinkingPhone from "../molecules/LinkingPhone";
import { useUserStore } from "../stores/user.store";
import QROrLoading from "../molecules/ShowQr";
import { log } from "console";

const styles = {
  container: {
    flex: 1,
    textAlign: "center" as const,
    alignSelf: "center",
  },
  detailContainer: {
    marginTop: "20px",
    padding: "40px 10px",
    border: "2px solid #EFF1F7",
    borderRadius: "20px",
  },
};

export default function Login() {
  const [status, setStatus] = useState<"qr" | "connecting" | "app">("qr");
  const [username, setUsername] = useState<string>();
  const [showQR, setShowQR] = useState<string>();
  const [app, setApp] = useState<App>();
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

    if (userStore.isLoggedIn()) {
      setStatus("connecting");
      const tonomyIDDid = localStorage.getItem(
        STORAGE_NAMESPACE + ".tonomy.id.did"
      );

      if (!tonomyIDDid) throw new Error("No Tonomy ID DID found");

      const jwkIssuer = await api.ExternalUser.getDidJwkIssuerFromStorage();
      const requestMessage = await LoginRequestsMessage.signMessage(
        {
          requests,
        },
        jwkIssuer,
        tonomyIDDid
      );

      await communication.sendMessage(requestMessage);

      setStatus("app");
    } else {
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

          await communication.sendMessage(requestMessage);

          setStatus("app");
        } catch (e) {
          console.error(e);
          alert(e);
        }
      }, IdentifyMessage.getType());
    }
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

  async function getAppDetails(loginRequest: LoginRequest) {
    const app = await App.getApp(loginRequest.getPayload().origin);

    setApp(app);
  }

  // creates SSO login request and sends the login request to Tonomy ID, via URL or communication server
  async function loginToTonomyAndSendRequests(
    loggedIn = false,
    user?: ExternalUser
  ) {
    try {
      const externalLoginRequest = await UserApps.onRedirectLogin();

      getAppDetails(externalLoginRequest);
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
        if (!user) throw new Error("No user found");
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
        await subscribeToLoginRequestResponse();
        await connectToTonomyId(requests, loginToCommunication);
      }
    } catch (e) {
      console.error(e);
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

    loginToTonomyAndSendRequests(true, user);
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

  const onLogout = async () => {
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

      if (userStore.user) await userStore.user.logout();

      window.location.href = callbackUrl;
    } catch (e) {
      console.error(e);
    }
  };

  const onCancel = async () => {
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

      if (userStore.user) {
        // TODO send a message to Tonomy ID telling it the request is cancelled
      }

      window.location.href = callbackUrl;
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={styles.container}>
      <TImage height={62} src={logo} alt="Tonomy Logo" />
      <TH3>Login with Tonomy</TH3>
      {(status === "connecting" || status === "app") && (
        <>{username && <TH4>{username}</TH4>}</>
      )}

      <div
        style={{
          ...styles.detailContainer,
        }}
      >
        {status === "qr" && <QROrLoading showQr={showQR} />}

        {status === "connecting" && (
          <>
            <LinkingPhone />
          </>
        )}
        {status === "app" && (
          <>
            {app && (
              <>
                <TImage src={app.logoUrl}></TImage>
                <TH3>{app.appName}</TH3>
                <TH4>wants you to log in to their application</TH4>
                <TP style={{ margin: "10px" }}>
                  Please proceed to login to Tonomy ID app on your phone.
                </TP>
              </>
            )}
            {!app && (
              <div className="detail-container">
                <TH4>Loading app details</TH4>
                <TProgressCircle />
              </div>
            )}
          </>
        )}
      </div>
      {status === "qr" && (
        <TContainedButton onClick={() => navigation("/download")}>
          Don't have Tonomy ID yet?
        </TContainedButton>
      )}
      {(status === "connecting" || status === "app") && (
        <>
          <div>
            <TContainedButton
              onClick={async () => {
                await onCancel();
              }}
            >
              Cancel
            </TContainedButton>
          </div>
          {userStore.user && (
            <TButton
              className="logout margin-top"
              onClick={onLogout}
              startIcon={<LogoutIcon></LogoutIcon>}
            >
              Logout
            </TButton>
          )}
        </>
      )}
    </div>
  );
}
