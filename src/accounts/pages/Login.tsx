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
import { TH2, TH3, TH4, TP } from "../../common/atoms/THeadings";
import TImage from "../../common/atoms/TImage";
import settings from "../../common/settings";
import { isMobile } from "../utils/IsMobile";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import LinkingPhone from "../molecules/LinkingPhone";
import { useUserStore } from "../../common/stores/user.store";
import QROrLoading from "../molecules/ShowQr";
import useErrorStore from "../../common/stores/errorStore";
import { useWalletRequestsStore } from "../stores/loginStore";
import ConnectionError from "../molecules/ConnectionError";
import Debug from "debug";
import { Box, Button, ButtonBase } from "@mui/material";
import { ArrowCircleLeftOutlined } from "@mui/icons-material";
import TSpinner from "../atoms/TSpinner";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import LightBulbIcon from "../assets/icon-light-bulb.png";

const debug = Debug("tonomy-app-websites:accounts:pages:Login");

const styles = {
  container: {
    flex: 1,
    textAlign: "center" as const,
    alignSelf: "center",
  },
  detailContainer: {
    marginTop: "30px",
    padding: "55px 35px 35px",
    border: "1px solid var(--grey-border)",
    borderRadius: "20px",
    backgroundColor: "#FFF",
  },
  titleContainer: {
    padding: "0 2rem",
    gap: '15px',
    display: "flex",
    justifyContent: 'center',
    flexDirection: "column" as const,
    alignItems: 'center'
  },
  titleContent: {
    display: "flex",
    flexDirection: "column" as const,
    gap: 8,
    width: "60%"
  },
  title: {
    fontSize: 28,
    lineHeight: "28.7px",
    fontWeight: 700,
  },
  description: {
    letterSpacing: 0.5,
    fontSize: 22,
    lineHeight: "22.55px",
    fontWeight: 400,
  },
  titleDescription: {
    letterSpacing: 0.5,
    fontSize: 24,
    lineHeight: "28.7px",
    fontWeight: 600,
    marginTop: 10
  },
  secureInfoButton: {
    fontSize: 16,
    lineHeight: "16.4px",
    gap: 8,
    textAlign: "left" as "left",
    marginTop: 24,
    fontFamily: '"Epilogue", Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
  },
  secondaryButton: {
    letterSpacing: 0.16,
    color: 'var(--secondary-text)',
    textTransform: 'none' as const,
    fontSize: 20,
    fontWeight: '400',
    fontFamily: '"Epilogue", Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
  }
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

  // Update CSS variable dynamically
  useEffect(() => {
    if (status === "qr") {
      document.documentElement.style.setProperty("--offWhite", "#F3F6F3");
      document.body.style.backgroundColor = "var(--offWhite)";
    } else {
      document.documentElement.style.setProperty("--white", "#FFFFFF");
      document.body.style.backgroundColor = "var(--white)";
    }
  }, [status, app]);

  const sliders = ["With Pangea ID you own your data! Your phone stores all your credentials in secure storage", "Your data isn't in a database like Google's, so it's safe from server breaches", "With portable data, you'll never have to re-fill the same information again"];

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

    // Attempt to open the app using window.location.replace
    const appUrl = `${settings.config.tonomyIdSchema}SSO?payload=${base64UrlPayload}`;
    // Create an invisible iframe to attempt to open the app
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = appUrl;
    document.body.appendChild(iframe);

    const urlParams = new URLSearchParams(window.location.search);
    const urlPayload = urlParams.get("payload");

    setTimeout(() => {
      document.body.removeChild(iframe);
      navigation(`/download?payload=${urlPayload}`);
    }, 1000);
    if (/android/i.test(navigator.userAgent)) {
      window.location.replace(appUrl);
    }
  }

  // connects to the communication server, waits for Tonomy ID to connect via QR code and then sends the login request
  async function connectToTonomyId(
    requests: LoginRequest[],
    loginToCommunication: AuthenticationMessage,
    user?: ExternalUser
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

          const jwkIssuer = await getDidKeyIssuerFromStorage();
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
        debug("subscribeToLoginRequestResponse()");

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
            "loginToTonomyAndSendRequests() using accountsLogin from store"
          );
          loginWithTonomyMessage = accountsLogin;
        } else {
          debug(
            "loginToTonomyAndSendRequests() calling ExternalUser.loginWithTonomy"
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

  const renderQRSection = () => (
    <>
      {app && (
        <div style={styles.titleContainer}>
          <TImage height={94} src={app.logoUrl} alt={`${app.appName} Logo`} />
          <div style={styles.titleContent}>
            <TH2 style={styles.title}>{app.appName}</TH2>
            <TP style={styles.description}>
              {app.appName} uses {settings.config.appName} to give you control of your identity and data
            </TP>
          </div>
        </div>
      )}
      <QROrLoading showQr={showQR} />
      <ButtonBase style={styles.secureInfoButton}>
        <TImage
          height={22}
          width={22}
          src={"/src/accounts/assets/icon-secure.svg"}
          alt={`Secure icon`}
        />
        Pangea uses end-to-end cryptography. We cannot see your personal data
      </ButtonBase>
    </>
  );

  const renderConnectingSection = () => (
    <Box justifyContent="center" alignItems="center" display="flex">
      <Box maxWidth="sm">
        <HeaderSection />
        <div style={styles.detailContainer}>
          {connectionError
            ? <ConnectionError username={username} tryAgainLink={window.document.referrer} />
            : <LinkingPhone />}
        </div>
        <SliderSection />
      </Box>
    </Box>
  );

  const renderAppSection = () => (
    <Box justifyContent="center" alignItems="center" display="flex">
      <Box maxWidth="sm">
        <HeaderSection />
        <div style={styles.detailContainer}>
          {app ? (
            <>
              <TImage width={80} src={app.logoUrl} />
              <TH3 style={styles.titleDescription}>
                <span style={{ color: '#4CAF50' }}>{app.appName}</span> wants<br /> you to login to the website
              </TH3>
              <TP style={{ color: "#6E84A3" }}>
                Use {settings.config.appName} app to complete your login
              </TP>
              <TSpinner />
            </>
          ) : (
            <div className="detail-container">
              <TH4>Loading app details</TH4>
              <TSpinner />
            </div>
          )}
        </div>
        <SliderSection />
      </Box>
    </Box>
  );

  const HeaderSection = () => (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      textAlign="left"
      sx={{ marginBottom: 10 }}
    >
      <Button
        onClick={async () => {
          await onCancel();
        }}
        variant="text"
        style={styles.secondaryButton}
        startIcon={<ArrowCircleLeftOutlined />}
      >
        Back
      </Button>
      {username && (
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontSize: 20
        }}>
          <TImage
            height={20}
            src={settings.config.images.logo48}
            alt={`${settings.config.appName} Logo`}
          />
          @{username}
        </div>
      )}
      {user && (
        <Button
          onClick={onLogout}
          variant="text"
          style={styles.secondaryButton}
          startIcon={<LogoutIcon />}
        >
          Logout
        </Button>
      )}
    </Box>
  );

  const SliderSection = () => (
    <>
      <Swiper
        modules={[Pagination]}
        pagination={{ clickable: true }}
        loop
        spaceBetween={10}
        slidesPerView={1}
        style={{
          width: "100%",
          textAlign: "center",
          marginTop: 60,
          marginBottom: 20
        }}
        className="custom-swiper"
      >
        {sliders.map((text, index) => (
          <SwiperSlide
            key={index}
            style={{
              fontSize: 20,
              fontWeight: "400",
              padding: 20,
              backgroundColor: "#F6F9FB",
              backgroundImage: `url(${LightBulbIcon})`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "left",
              borderRadius: 12,
            }}
          >
            {text}
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="swiper-pagination"></div>
    </>
  );

  return (
    <div style={styles.container}>

      {status === "qr" && renderQRSection()}
      {status === "connecting" && renderConnectingSection()}
      {status === "app" && renderAppSection()}

    </div>
  );
}
