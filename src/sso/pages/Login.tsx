import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
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
} from "@tonomy/tonomy-id-sdk";
import QRCode from "react-qr-code";
import { TH3, TP } from "../components/THeadings";
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
  const [showQR, setShowQR] = useState<string>();
  const navigation = useNavigate();
  const communication = useCommunicationStore((state) => state.communication);
  let rendered = false;
  const location = useLocation();

  useEffect(() => {
    // Prevent useEffect from running twice which causes a race condition of the
    // async handleRequests() between which publicKey is sent in the request and this
    // conflicts in the publicKey that is saved in localStorage
    if (!rendered) {
      rendered = true;
    } else {
      return;
    }

    handleRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function sendRequestToMobile(
    requests: LoginRequest[],
    loginToCommunication: AuthenticationMessage
  ) {
    try {
      if (isMobile()) {
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
      } else {
        const logInMessage = new LoginRequest(requests[1]);
        const did = logInMessage.getIssuer();

        setShowQR(did);

        // Login to the communication server
        await communication.login(loginToCommunication);

        // subscribe for connection from Tonomy ID, which will then send login request
        communication.subscribeMessage(async (message) => {
          const identifyMessage = new IdentifyMessage(message);

          const jwkIssuer = await api.ExternalUser.getJwkIssuerFromStorage();
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
        }, IdentifyMessage.getType());

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
    } catch (e) {
      console.error(JSON.stringify(e, null, 2));
      alert(e);
    }
  }

  async function handleRequests() {
    try {
      // check if user is already logged in
      await api.ExternalUser.getUser();
      navigation("/loading" + location.search);
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
      {renderQROrLoading()}
    </div>
  ) as any;
}

export default Login;
