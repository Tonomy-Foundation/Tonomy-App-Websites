import React, { useEffect, useState } from "react";
import LogoutIcon from "@mui/icons-material/Logout";
import {
  Message,
  LoginRequest,
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
  getDidKeyIssuerFromStorage,
  getLoginRequestFromUrl,
  onRedirectLogin,
  RequestsManager,
  ResponsesManager,
} from "@tonomy/tonomy-id-sdk";
import { TH3, TH4, TP } from "../../common/atoms/THeadings";
import TImage from "../../common/atoms/TImage";
import TProgressCircle from "../../common/atoms/TProgressCircle";
import settings from "../../common/settings";
import { isMobile } from "../utils/IsMobile";
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
import Debug from "debug";

const debug = Debug("tonomy-app-websites:accounts:pages:Login");

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
  const { requests, accountsLogin, setPayload, setRequests, setAccountsLogin } =
    useWalletRequestsStore();
  const [connectionError, setConnectionError] = useState<boolean>(false);

  let rendered = false;

  /*
  useEffect()
  --> onLoad()
      ----> checkLoggedIn() 
          if logged in:
          ----> loginToTonomyAndSendRequests(user)
          if not logged in:
          ----> loginToTonomyAndSendRequests()
              ----> getAppDetails()
              if mobile:
              ----> redirectToMobileAppUrl()
              else:
              ----> setShowQR()
              ----> subscribeToLoginRequestResponse()
                  if success:
                  ----> window.location.replace()
                  if failed:
                  ----> terminateLoginRequest()
              ----> connectToTonomyId()
                  if logged in already:
                  ----> communication.sendMessage(requests)
                  else:
                  ----> communication.subscribeMessage()
                      ----> communication.sendMessage(requests)
   */

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
    debug("redirectToMobileAppUrl()", requests.length);
    // Update the current URL to add query param mobile=true

    const payload = {
      requests,
    };
    const base64UrlPayload = objToBase64Url(payload);

    // Set a timeout to redirect to the fallback URL if the app is not opened

    // Attempt to open the app using window.location.replace
    const appUrl = `${settings.config.tonomyIdSchema}SSO?payload=${base64UrlPayload}`; //same for ios redirect
    // Create an invisible iframe to attempt to open the app
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = appUrl;
    document.body.appendChild(iframe);
    setTimeout(() => {
      document.body.removeChild(iframe);
      navigation("/download");
    }, 1000);
    if (/android/i.test(navigator.userAgent)) {
      window.location.replace(appUrl);
    }
  }

  // connects to the communication server, waits for Tonomy ID to connect via QR code and then sends the login request
  async function connectToTonomyId(
    requests: LoginRequest[],
    loginToCommunication: AuthenticationMessage,
    user?: ExternalUser,
  ) {
    debug("connectToTonomyId()", requests.length, typeof user);
    // Login to the communication server
    await communication.login(loginToCommunication);

    if (user) {
      setStatus("connecting");

      const tonomyIDDid = await user.getWalletDid();

      if (!tonomyIDDid)
        throw new Error(`No ${settings.config.appName} DID found`);

      const issuer = await user.getIssuer();

      const requestMessage = await LoginRequestsMessage.signMessage(
        {
          requests,
        },
        issuer,
        tonomyIDDid,
      );

      await communication.sendMessage(requestMessage);

      setStatus("app");
    } else {
      // subscribe for connection from Tonomy ID, which will then send login request
      communication.subscribeMessage(async (message) => {
        try {
          setStatus("connecting");

          const identifyMessage = new IdentifyMessage(message);

          const jwkIssuer = await getDidKeyIssuerFromStorage();
          const requestMessage = await LoginRequestsMessage.signMessage(
            {
              requests,
            },
            jwkIssuer,
            identifyMessage.getSender(),
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
        debug("subscribeToLoginRequestResponse()");

        const loginRequestResponsePayload = new LoginRequestResponseMessage(
          message,
        ).getPayload();

        if (loginRequestResponsePayload.success !== true) {
          const error = loginRequestResponsePayload.error;

          if (!error) throw new Error("No error found");
          const managedRequests = new RequestsManager(error.requests);
          const externalRequests =
            managedRequests.getRequestsDifferentOriginOrThrow();

          const managedExternalResponses = new ResponsesManager(
            new RequestsManager(externalRequests),
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
            },
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
    debug("getAppDetails()", loginRequest.getPayload().origin);

    const app = await App.getApp(loginRequest.getPayload().origin);

    setApp(app);
  }

  // creates SSO login request and sends the login request to Tonomy ID, via URL or communication server
  async function loginToTonomyAndSendRequests(user?: ExternalUser) {
    try {
      debug("loginToTonomyAndSendRequests()", typeof user, typeof requests);

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
        let loginWithTonomyMessage: LoginWithTonomyMessages;
        if (accountsLogin) {
          debug(
            "loginToTonomyAndSendRequests() using accountsLogin from store",
          );
          loginWithTonomyMessage = accountsLogin;
        } else {
          debug(
            "loginToTonomyAndSendRequests() calling ExternalUser.loginWithTonomy",
          );
          loginWithTonomyMessage = (await ExternalUser.loginWithTonomy({
            callbackPath: "/callback",
            redirect: false,
            dataRequest: {
              username: true,
            },
          })) as LoginWithTonomyMessages;
          setAccountsLogin(loginWithTonomyMessage);
        }
        const {
          loginRequest,
          dataSharingRequest,
          loginToCommunication: loginToCommunicationVal,
        } = loginWithTonomyMessage;

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
          issuer,
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
            "Please try again and do not refresh this website during login",
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
    debug("checkLoggedIn()");

    // only clear state if the accountsLogin is not set (i.e. they are not navigating from other part of the website)
    const user = await ExternalUser.getUser({
      autoLogout: accountsLogin ? false : true,
    });

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
      const urlParams = new URLSearchParams(window.location.search);
      const payload = urlParams.get("payload");

      if (payload) {
        setPayload(payload);
      }
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
      <TImage
        height={58}
        src={settings.config.images.logo48}
        alt={`${settings.config.appName} Logo`}
      />
      <TH3>Login with {settings.config.appName}</TH3>
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
                  Please proceed to login to {settings.config.appName} app on
                  your phone.
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
          {`Don't have ${settings.config.appName} yet?`}
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
