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
import {
  App,
  AuthenticationMessage,
  CommunicationError,
  ExternalUser,
  getLoginRequestFromUrl,
  JsKeyManager,
  KeyManagerLevel,
  LoginRequest,
  LoginRequestPayload,
  LoginWithTonomyMessages,
  onRedirectLogin,
  randomString,
  RequestsManager,
  ResponsesManager,
  SdkError,
  SdkErrors,
  terminateLoginRequest,
  WalletRequest,
} from "@tonomy/tonomy-id-sdk";
import useErrorStore from "../../common/stores/errorStore";
import { useUserStore } from "../../common/stores/user.store";
import { useThemeContext } from "../../theme/ThemeContext";
import IconSecure from "../assets/icon-secure.svg";
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

  const { updateThemeColors } = useThemeContext();

  // Update CSS variable dynamically
  useEffect(() => {
    if (app) {
      updateThemeColors(app.accentColor, app.backgroundColor);
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

  const { appleStoreDownload, playStoreDownload } = settings.config.links;

  return (
    <div className="container">
      {/* App Logo, Title and Description */}
      {app && (
        <>
          <TImage
            height={64}
            width={64}
            src={app.logoUrl}
            alt={`${app.appName} Logo`}
          />
          <div className="titleContainer">
            <TH2 className="title">{app.appName}</TH2>
            <TP className="description">
              {app.appName} uses {appName} to give you control of your identity
              and data.
            </TP>
          </div>
        </>
      )}

      {/* QR Section */}
      <div className="qrWrapper">
        <div className="qrContent">
          {/* QR Title */}
          <div className="qrTitleWrapper">
            <TH3 className="qrTitle">
              Log in with{" "}
              <Tooltip
                title="Learn more about Tonomy ID"
                placement="top"
                arrow
                slotProps={{
                  popper: {
                    modifiers: [
                      {
                        name: "offset",
                        options: {
                          offset: [0, 10],
                        },
                      },
                    ],
                  },
                }}
              >
                <Link
                  to="https://tonomy.io"
                  className="highlightedLink"
                  onMouseUp={(e) => {
                    e.currentTarget.style.borderBottom =
                      "2px solid var(--app-accent-active)";
                  }}
                >
                  {appName}
                </Link>
              </Tooltip>
            </TH3>

            <TP className="qrDescription">
              You'll need the {appName} app for a secure, one-tap login that
              streamlines your access.
            </TP>
          </div>

          {/* Store Badges */}
          <div className="storeBadges">
            <Link to={appleStoreDownload}>
              <img
                alt="Get it on Apple store"
                src={appStoreImage}
                className="storeBadgeImage"
              />
            </Link>
            <Link to={playStoreDownload}>
              <img
                alt="Get it on Google Play"
                src={playStoreBadge}
                className="storeBadgeImage"
              />
            </Link>
          </div>

          {/* Assistance Button */}
          <ButtonBase
            onClick={handleOpenHelpModal}
            className="assistanceButton"
          >
            Get assistance
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1.00005 14L14 1M14 1V13.48M14 1H1.52005"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </ButtonBase>
        </div>
      </div>

      {/* Secure Info */}
      <ButtonBase className="secureInfoButton">
        <TImage height={22} width={22} src={IconSecure} alt="Secure icon" />
        Tonomy uses end-to-end cryptography. We cannot see your personal data.
      </ButtonBase>

      {/* Help Modal */}
      <QRCodeHelpModal open={openHelpModal} onClose={handleCloseHelpModal} />
    </div>
  );
}
