import React, { useEffect, useState } from "react";
import LogoutIcon from "@mui/icons-material/Logout";
import {
  Message,
  LoginRequest,
  api,
  LoginWithTonomyMessages,
  AuthenticationMessage,
  IdentifyMessage,
  LoginRequestsMessage,
  terminateLoginRequest,
  LoginRequestResponseMessage,
  objToBase64Url,
  SdkError,
  SdkErrors,
  createLoginQrCode,
  ExternalUser,
  App,
  LoginRequestPayload,
  randomString,
  KeyManagerLevel,
  JsKeyManager,
  CommunicationError,
  WalletRequest,
  getJwkIssuerFromStorage,
  getLoginRequestFromUrl,
  onRedirectLogin,
  RequestsManager,
  ResponsesManager,
  getSettings,
} from "@tonomy/tonomy-id-sdk";
import { TH3, TH4, TP } from "../../common/atoms/THeadings";
import TImage from "../../common/atoms/TImage";
import TProgressCircle from "../../common/atoms/TProgressCircle";
import settings from "../../common/settings";
import { isMobile } from "../utils/IsMobile";
import logo from "/pangea-large-logo.png";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { TButton } from "../../common/atoms/TButton";
import { TContainedButton } from "../../common/atoms/TContainedButton";
import LinkingPhone from "../molecules/LinkingPhone";
import { useUserStore } from "../../common/stores/user.store";
import QROrLoading from "../molecules/ShowQr";
import useErrorStore from "../../common/stores/errorStore";
import { useWalletRequestsStore } from "../stores/loginStore";
import ConnectionError from "../molecules/ConnectionError";

const styles = {
  container: {
    flex: 1,
    textAlign: "center" as const,
    alignSelf: "center",
  },
  detailContainer: {
    marginTop: "20px",
    padding: "40px 10px",
    border: "2px solid var(--grey-border)",
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
  const errorStore = useErrorStore();
  const { user, setUser, isLoggedIn, logout } = useUserStore();
  const { requests, setRequests } = useWalletRequestsStore();
  const [connectionError, setConnectionError] = useState<boolean>(false);

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
  async function redirectToMobileAppUrl(requests: WalletRequest[]) {
    if (getSettings().loggerLevel === "debug")
      console.log("redirectToMobileAppUrl()", requests.length);

    const payload = {
      requests,
    };

    const base64UrlPayload = objToBase64Url(payload);

    window.location.replace(
      `${settings.config.tonomyIdSchema}SSO?payload=${base64UrlPayload}`
    );

    // wait 1 second
    // if this code runs then the redirect didn't work
    setTimeout(() => {
      throw new Error("Redirect to Pangea failed");
    }, 1000);
  }

  // connects to the communication server, waits for Tonomy ID to connect via QR code and then sends the login request
  async function connectToTonomyId(
    requests: LoginRequest[],
    loginToCommunication: AuthenticationMessage,
    user?: ExternalUser
  ) {
    if (getSettings().loggerLevel === "debug")
      console.log("connectToTonomyId()", requests.length, typeof user);
    // Login to the communication server
    await communication.login(loginToCommunication);

    if (user) {
      setStatus("connecting");

      const tonomyIDDid = await user.getWalletDid();

      if (!tonomyIDDid) throw new Error("No Pangea DID found");

      const issuer = await user.getIssuer();

      const requestMessage = await LoginRequestsMessage.signMessage(
        {
          requests,
        },
        issuer,
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

          const jwkIssuer = await getJwkIssuerFromStorage();
          const requestMessage = await LoginRequestsMessage.signMessage(
            {
              requests,
            },
            jwkIssuer,
            identifyMessage.getSender()
          );

          await communication.sendMessage(requestMessage);

          setStatus("app");
        } catch (e) {
          if (
            e instanceof CommunicationError &&
            e.exception.status === 400 &&
            e.exception.message.startsWith("Recipient not connected")
          ) {
            setConnectionError(true);
          } else {
            errorStore.setError({ error: e, expected: false });
          }
        }
      }, IdentifyMessage.getType());
    }
  }

  // waits for the login request response from Tonomy ID then redirects to the callback url
  async function subscribeToLoginRequestResponse() {
    communication.subscribeMessage(async (message: Message) => {
      try {
        if (getSettings().loggerLevel === "debug")
          console.log("subscribeToLoginRequestResponse()");

        const loginRequestResponsePayload = new LoginRequestResponseMessage(
          message
        ).getPayload();

        if (loginRequestResponsePayload.success !== true) {
          const error = loginRequestResponsePayload.error;

          if (!error) throw new Error("No error found");
          const managedRequests = new RequestsManager(error.requests);
          const externalRequests =
            managedRequests.getRequestsDifferentOriginOrThrow();

          const managedExternalResponses = new ResponsesManager(
            new RequestsManager(externalRequests)
          );
          const externalLoginRequest =
            managedRequests.getLoginRequestWithDifferentOriginOrThrow();

          const externalError = {
            ...error,
            requests: externalRequests,
          };
          const url = await terminateLoginRequest(
            managedExternalResponses,
            "mobile",
            externalError,
            {
              callbackOrigin: externalLoginRequest.getPayload().origin,
              callbackPath: externalLoginRequest.getPayload().callbackPath,
            }
          );

          window.location.href = url as string;
        } else {
          if (!loginRequestResponsePayload.response)
            throw new Error("No response found");

          const base64UrlPayload = objToBase64Url(loginRequestResponsePayload);

          window.location.replace("/callback?payload=" + base64UrlPayload);
        }
      } catch (e) {
        errorStore.setError({ error: e, expected: false });
      }
    }, LoginRequestResponseMessage.getType());
  }

  async function getAppDetails(loginRequest: LoginRequest) {
    if (getSettings().loggerLevel === "debug")
      console.log("getAppDetails()", loginRequest.getPayload().origin);

    const app = await App.getApp(loginRequest.getPayload().origin);

    setApp(app);
  }

  // creates SSO login request and sends the login request to Tonomy ID, via URL or communication server
  async function loginToTonomyAndSendRequests(user?: ExternalUser) {
    try {
      if (getSettings().loggerLevel === "debug")
        console.log(
          "loginToTonomyAndSendRequests()",
          typeof user,
          typeof requests
        );

      let managedRequests = requests;

      if (!managedRequests) {
        managedRequests = await onRedirectLogin();
        setRequests(managedRequests);
      }

      const externalLoginRequest =
        managedRequests.getLoginRequestWithDifferentOriginOrThrow();

      getAppDetails(externalLoginRequest);

      const requestsToSend: WalletRequest[] = [
        ...managedRequests.getRequests(),
      ];

      let loginToCommunication: AuthenticationMessage;

      if (!user) {
        const {
          loginRequest,
          dataSharingRequest,
          loginToCommunication: loginToCommunicationVal,
        } = (await api.ExternalUser.loginWithTonomy({
          callbackPath: "/callback",
          redirect: false,
          dataRequest: {
            username: true,
          },
        })) as LoginWithTonomyMessages;

        requestsToSend.push(loginRequest);
        if (dataSharingRequest) requestsToSend.push(dataSharingRequest);

        loginToCommunication = loginToCommunicationVal;
      } else {
        if (!user) throw new Error("No user found");

        const issuer = await user.getIssuer();

        const publicKey = await new JsKeyManager().getKey({
          level: KeyManagerLevel.BROWSER_LOCAL_STORAGE,
        });

        const loginRequestPayload: LoginRequestPayload = {
          randomString: randomString(32),
          origin: window.location.origin,
          publicKey: publicKey,
          callbackPath: "/callback",
        };

        const loginRequest = await LoginRequest.signRequest(
          loginRequestPayload,
          issuer
        );

        requestsToSend.push(loginRequest);

        loginToCommunication =
          await AuthenticationMessage.signMessageWithoutRecipient({}, issuer);
      }

      const managedRequestsToSend = new RequestsManager(requestsToSend);

      if (isMobile()) {
        await redirectToMobileAppUrl(requestsToSend);
      } else {
        const did = managedRequestsToSend
          .getLoginRequestWithSameOriginOrThrow()
          .getIssuer();

        setShowQR(createLoginQrCode(did));
        await subscribeToLoginRequestResponse();
        await connectToTonomyId(requestsToSend, loginToCommunication, user);
      }
    } catch (e) {
      if (
        e instanceof SdkError &&
        (e.code === SdkErrors.ReferrerEmpty ||
          e.code === SdkErrors.MissingParams)
      ) {
        errorStore.setError({
          error: new Error(
            "Please try again and do not refresh this website during login"
          ),
          expected: true,
          title: "Login unsuccessful",
          onClose: async () => onRefresh(),
        });
      } else if (
        e instanceof CommunicationError &&
        e.exception.status === 400 &&
        e.exception.message.startsWith("Recipient not connected")
      ) {
        setConnectionError(true);
      } else {
        errorStore.setError({ error: e, expected: false });
      }
    }
  }

  // check if user is already logged in
  async function checkLoggedIn() {
    if (getSettings().loggerLevel === "debug") console.log("checkLoggedIn()");

    const user = await api.ExternalUser.getUser();

    setStatus("connecting");
    setUser(user);
    const username = await user.getUsername();

    if (!username) throw new Error("No username found");
    setUsername(username.getBaseUsername());

    loginToTonomyAndSendRequests(user);
  }

  // check if user logged in and if not starts login process from URL parameters
  async function onLoad() {
    try {
      await checkLoggedIn();
    } catch (e) {
      if (
        e instanceof SdkError &&
        (e.code === SdkErrors.AccountNotFound ||
          e.code === SdkErrors.UserNotLoggedIn ||
          e.code === SdkErrors.AccountDoesntExist)
      ) {
        loginToTonomyAndSendRequests();
      } else {
        errorStore.setError({ error: e, expected: false });
      }
    }
  }

  async function terminateLogin(error): Promise<string> {
    const { requests } = await getLoginRequestFromUrl();
    const managedRequests = new RequestsManager(requests);

    const externalLoginRequest =
      managedRequests.getLoginRequestWithDifferentOriginOrThrow();

    const managedResponses = new ResponsesManager(managedRequests);

    return (await terminateLoginRequest(managedResponses, "mobile", error, {
      callbackOrigin: externalLoginRequest.getPayload().origin,
      callbackPath: externalLoginRequest.getPayload().callbackPath,
    })) as string;
  }

  const onLogout = async () => {
    try {
      const callbackUrl = await terminateLogin({
        code: SdkErrors.UserLogout,
        reason: "User logged out",
      });

      if (isLoggedIn()) await logout();

      window.location.href = callbackUrl;
    } catch (e) {
      errorStore.setError({ error: e, expected: false });
    }
  };

  const onCancel = async () => {
    try {
      console.log("here");
      const callbackUrl = await terminateLogin({
        code: SdkErrors.UserCancelled,
        reason: "User cancelled login",
      });

      if (isLoggedIn()) {
        // TODO send a message to Tonomy ID telling it the request is cancelled
      }

      window.location.href = callbackUrl;
    } catch (e) {
      errorStore.setError({ error: e, expected: false });
    }
  };

  const onRefresh = async () => {
    try {
      const callbackUrl = await terminateLogin({
        code: SdkErrors.UserRefreshed,
        reason: "User refreshed during login",
      });

      window.location.href = callbackUrl;
    } catch (e) {
      errorStore.setError({ error: e, expected: false });
    }
  };

  return (
    <div style={styles.container}>
      <TImage height={62} src={logo} alt="Tonomy Logo" />
      <TH3>Login with Pangea</TH3>
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
            {connectionError ? (
              <ConnectionError
                username={username}
                tryAgainLink={window.document.referrer}
              />
            ) : (
              <LinkingPhone />
            )}
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
                  Please proceed to login to Pangea app on your phone.
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
          {`Don't have Pangea yet?`}
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
          {user && (
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
