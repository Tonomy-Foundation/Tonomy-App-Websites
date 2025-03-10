import React, { useEffect, useState } from "react";
import { TH2, TH3, TP } from "../../common/atoms/THeadings";
import { ButtonBase, Tooltip } from "@mui/material";
import { Link } from "react-router-dom";

import TImage from "../../common/atoms/TImage";
import QRCodeHelpModal from "../atoms/QRCodeHelpModal";

import appStoreImage from "../assets/app-store.svg";
import playStoreBadge from "../assets/google-play-badge.png";
import settings from "../../common/settings";

import "./DownloadApp.css"; // Assuming this has common styles
import { useWalletRequestsStore } from "../stores/loginStore";
import Debug from "debug";
import { App, AuthenticationMessage, CommunicationError, ExternalUser, getLoginRequestFromUrl, JsKeyManager, KeyManagerLevel, LoginRequest, LoginRequestPayload, LoginWithTonomyMessages, onRedirectLogin, randomString, RequestsManager, ResponsesManager, SdkError, SdkErrors, terminateLoginRequest, WalletRequest } from "@tonomy/tonomy-id-sdk";
import useErrorStore from "../../common/stores/errorStore";
import { useUserStore } from "../../common/stores/user.store";
const debug = Debug("tonomy-app-websites:accounts:pages:Login");

export default function DownloadApp() {
  const [openHelpModal, setOpenHelpModal] = useState(false);
  const [status, setStatus] = useState<"qr" | "connecting" | "app">("qr");
  const { requests, accountsLogin, setPayload, setRequests, setAccountsLogin } =
    useWalletRequestsStore();
  const [app, setApp] = useState<App>();

  const [connectionError, setConnectionError] = useState<boolean>(false);
  const errorStore = useErrorStore();

  const handleOpenHelpModal = () => setOpenHelpModal(true);
  const handleCloseHelpModal = () => setOpenHelpModal(false);

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

  // check if user is already logged in
  async function checkLoggedIn() {
    debug("checkLoggedIn()");

    // only clear state if the accountsLogin is not set (i.e. they are not navigating from other part of the website)
    const user = await ExternalUser.getUser({
      autoLogout: accountsLogin ? false : true,
    });

    setStatus("connecting");

    loginToTonomyAndSendRequests(user);
  }

  async function getAppDetails(loginRequest: LoginRequest) {
    debug("getAppDetails()", loginRequest.getPayload().origin);

    const app = await App.getApp(loginRequest.getPayload().origin);

    setApp(app);
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

  const appName = settings.config.appName;

  const {
    appleStoreDownload,
    playStoreDownload
  } = settings.config.links;

  return (
    <div style={styles.container}>

      {/* App Logo, Title and Description */}
      {
        app && (
          <>
            <TImage
              height={64}
              width={64}
              src={app.logoUrl}
              alt={`${app.appName} Logo`}
            />
            <div style={styles.titleContainer}>
              <TH2 style={styles.title}>{app.appName}</TH2>
              <TP style={styles.description}>
                {app.appName} uses {appName} to give you control of your identity and data.
              </TP>
            </div>
          </>
        )
      }


      {/* QR Section */}
      <div style={styles.qrWrapper}>
        <div style={styles.qrContent}>
          {/* QR Title */}
          <div style={styles.qrTitleWrapper}>
            <TH3 style={styles.qrTitle}>
              Log in with{" "}
              <Tooltip
                title="Learn more about Pangea ID"
                placement="top"
                arrow
                slotProps={{
                  popper: {
                    modifiers: [
                      {
                        name: 'offset',
                        options: {
                          offset: [0, 10],
                        },
                      },
                    ],
                  },
                }}
              >
                <Link
                  to="https://pangea.web4.world/technology/pangea-passport"
                  style={styles.highlightedLink}
                  onMouseUp={(e) =>
                    (e.currentTarget.style.borderBottom = "2px solid #388E3C")
                  }
                >
                  {appName}
                </Link>
              </Tooltip>
            </TH3>

            <TP style={styles.qrDescription}>
              You'll need the {appName} app for a secure, one-tap login that streamlines your access.
            </TP>
          </div>

          {/* Store Badges */}
          <div style={styles.storeBadges}>
            <Link to={appleStoreDownload}>
              <img
                alt="Get it on Apple store"
                src={appStoreImage}
                style={styles.storeBadgeImage}
              />
            </Link>
            <Link to={playStoreDownload}>
              <img
                alt="Get it on Google Play"
                src={playStoreBadge}
                style={styles.storeBadgeImage}
              />
            </Link>
          </div>

          {/* Assistance Button */}
          <ButtonBase onClick={handleOpenHelpModal} style={styles.assistanceButton}>
            Get assistance
            <TImage
              height={12}
              width={12}
              src="/src/accounts/assets/icon-arrow.svg"
              alt="Arrow icon"
            />
          </ButtonBase>
        </div>
      </div>

      {/* Secure Info */}
      <ButtonBase style={styles.secureInfoButton}>
        <TImage
          height={22}
          width={22}
          src="/src/accounts/assets/icon-secure.svg"
          alt="Secure icon"
        />
        Pangea uses end-to-end cryptography. We cannot see your personal data.
      </ButtonBase>

      {/* Help Modal */}
      <QRCodeHelpModal open={openHelpModal} onClose={handleCloseHelpModal} />
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center" as const,
    justifyContent: "flex-start" as const,
    marginTop: "2rem"
  },
  titleContainer: {
    display: "flex",
    flexDirection: "column" as const,
    gap: 8,
    textAlign: "center" as const,
    marginTop: 16,
  },
  title: {
    fontSize: 22,
    lineHeight: "22.55px",
    fontWeight: 700,
  },
  description: {
    fontSize: 16,
    lineHeight: "18.45px",
    fontWeight: 400,
    letterSpacing: 0.5,
  },
  qrWrapper: {
    marginTop: "4rem",
    padding: "25px 16px",
    width: "100%",
    border: "1px solid var(--grey-border)",
    borderRadius: 20,
    backgroundColor: "#FFF",
  },
  qrContent: {
    display: "flex",
    flexDirection: "column" as const,
    gap: 25,
  },
  qrTitleWrapper: {
    display: "flex",
    flexDirection: "column" as const,
    gap: 12,
  },
  qrTitle: {
    fontSize: 20,
    lineHeight: "24.6px",
    fontWeight: 600,
    letterSpacing: 0.5,
    textAlign: "left" as const,
  },
  qrDescription: {
    fontSize: 16,
    lineHeight: "16.4px",
    letterSpacing: 0.5,
    textAlign: "left" as const,
  },
  highlightedLink: {
    color: "#000000",
    borderBottom: "2px solid #4CAF50",
    textDecoration: "none",
  },
  storeBadges: {
    display: "flex",
    alignItems: "center",
    gap: 3,
  },
  storeBadgeImage: {
    width: 120,
    height: 40,
  },
  assistanceButton: {
    color: "#4CAF50",
    fontSize: 16,
    lineHeight: "16.4px",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    fontFamily: '"Epilogue", Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
    gap: 8,
  },
  secureInfoButton: {
    display: "flex",
    fontFamily: '"Epilogue", Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
    alignItems: "center" as const,
    gap: 8,
    fontSize: 16,
    lineHeight: "16.4px",
    textAlign: "left" as const,
    marginTop: 24,
    margin: "24px 10px"
  },
};
