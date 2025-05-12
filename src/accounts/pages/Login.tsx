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
import { useThemeContext } from "../../theme/ThemeContext";

const debug = Debug("tonomy-app-websites:accounts:pages:Login");

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

  const { updateThemeColors } = useThemeContext();

  // Update CSS variable dynamically
  useEffect(() => {
    if (app) {
      updateThemeColors(app.accentColor, app.backgroundColor);
    }
  }, [status, app]);

  const sliders = [
    "With Tonomy ID you own your data! Your phone stores all your credentials in secure storage",
    "Your data isn't in a database like Google's, so it's safe from server breaches",
    "With portable data, you'll never have to re-fill the same information again",
  ];

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
              ----> redirectToMobileAppUsingUniversalRedirect()
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

  useEffect(() => {
    const userAgent = navigator.userAgent;

    // Set a timeout to redirect to the app store if app isn't opened
    const fallbackTimeout = setTimeout(() => {
      if (/android/i.test(userAgent)) {
        window.location.href = settings.config.links.playStoreDownload;
      } else if (/iPad|iPhone|iPod/.test(userAgent)) {
        navigation("/download");
      }
    }, 2000); // 2 seconds

    // Clear the timeout if the user navigates away (edge case)
    return () => clearTimeout(fallbackTimeout);
  }, []);

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

      const did = managedRequestsToSend
        .getLoginRequestWithSameOriginOrThrow()
        .getIssuer();

      setShowQR(createLoginQrCode(did));
      await subscribeToLoginRequestResponse();
      await connectToTonomyId(requestsToSend, loginToCommunication, user);
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
        // TODO: send a message to Tonomy ID telling it the request is cancelled
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

  const renderAppDetailsSection = () =>
    app ? (
      <div className="titleContainer">
        <TImage height={94} src={app.logoUrl} alt={`${app.appName} Logo`} />
        <div className="titleContent">
          <TH2 className="title">{app.appName}</TH2>
          <TP className="description">
            {app.appName} uses {settings.config.appName} to give you control of
            your identity and data
          </TP>
        </div>
      </div>
    ) : null;

  const renderQRSection = () => (
    <>
      {renderAppDetailsSection()}
      <QROrLoading showQr={showQR} />
      <div className="secureInfoButtonContainer">
        <ButtonBase className="secureInfoButton">
          <svg
            width="14"
            height="18"
            viewBox="0 0 14 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11 9H12.4C12.7314 9 13 9.2686 13 9.6V16.4C13 16.7314 12.7314 17 12.4 17H1.6C1.26863 17 1 16.7314 1 16.4V9.6C1 9.2686 1.26863 9 1.6 9H3M11 9V5C11 3.66667 10.2 1 7 1C3.8 1 3 3.66667 3 5V9M11 9H3"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          Tonomy uses end-to-end cryptography. We cannot see your personal data
        </ButtonBase>
      </div>
    </>
  );

  const renderConnectingSection = () => (
    <Box justifyContent="center" alignItems="center" display="flex">
      <Box maxWidth="md">
        <HeaderSection />
        <div className="detailContainer">
          {connectionError ? (
            <ConnectionError
              username={username}
              tryAgainLink={window.document.referrer}
            />
          ) : (
            <LinkingPhone />
          )}
        </div>
        <SliderSection />
      </Box>
    </Box>
  );

  const renderAppSection = () => (
    <Box justifyContent="center" alignItems="center" display="flex">
      <Box maxWidth="sm">
        <HeaderSection />
        <div className="detailContainer app-details">
          {app ? (
            <>
              <TImage style={{ marginTop: 15 }} width={80} src={app.logoUrl} />
              <TH3 className="titleDescription">
                <span style={{ color: "var(--app-accent)" }}>
                  {app.appName}
                </span>{" "}
                wants
                <br /> you to login to the website
              </TH3>
              <TP style={{ color: "var(--text-secondary)" }}>
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
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        textAlign="left"
      >
        <Button
          onClick={async () => {
            await onCancel();
          }}
          className="secondaryButton"
          variant="text"
          startIcon={<ArrowCircleLeftOutlined />}
        >
          Back
        </Button>
        <Box
          display="flex"
          gap={5}
          alignItems="center"
          justifyContent="space-between"
        >
          {username && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: 20,
              }}
            >
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
              className="secondaryButton"
              startIcon={<LogoutIcon />}
            >
              Logout
            </Button>
          )}
        </Box>
      </Box>
      {status !== "app" && renderAppDetailsSection()}
    </>
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
          marginBottom: 20,
        }}
        className="custom-swiper"
      >
        {sliders.map((text, index) => (
          <SwiperSlide key={index}>
            <div
              style={{
                fontSize: 18,
                fontWeight: "400",
                padding: 20,
                backgroundColor: "var(--app-background-active)",
                backgroundImage: `url(${LightBulbIcon})`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "left",
                borderRadius: 12,
              }}
            >
              {text}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="swiper-pagination"></div>
    </>
  );

  return (
    <div className="container">
      {status === "qr" && renderQRSection()}
      {status === "connecting" && renderConnectingSection()}
      {status === "app" && renderAppSection()}
    </div>
  );
}
