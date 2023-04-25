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
  strToBase64Url,
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

        const base64UrlPayload = strToBase64Url(JSON.stringify(payload));

        window.location.replace(
          `${settings.config.tonomyIdLink}?payload=${base64UrlPayload}`
        );

        // TODO
        // wait 1-2 seconds
        // if this code runs then the link didnt work
        setTimeout(() => {
          alert("link didn't work");
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
        }, IdentifyMessage.getType());

        // subscribe for login request response
        communication.subscribeMessage(async (message: Message) => {
          const loginRequestResponsePayload = new LoginRequestResponseMessage(
            message
          ).getPayload();

          if (!loginRequestResponsePayload.success) {
            // TODO redirect back to external website and tell them what happened
          }

          const requests = loginRequestResponsePayload.requests;
          const externalLoginRequest = requests?.find((r: LoginRequest) => {
            return r.getPayload().origin !== window.location.origin;
          });

          if (!externalLoginRequest) {
            throw new Error("No external login request found");
          }

          let callbackPath = externalLoginRequest.getPayload().callbackPath;

          const base64UrlPayload = strToBase64Url(
            JSON.stringify(loginRequestResponsePayload)
          );

          callbackPath += "?payload=" + base64UrlPayload;

          window.location.href = callbackPath;
        }, LoginRequestResponseMessage.getType());
      }
    } catch (e) {
      console.error(JSON.stringify(e, null, 2));
      alert(e);
    }
  }

  async function handleRequests() {
    try {
      const externalLoginRequest = await UserApps.onRedirectLogin();

      try {
        await api.ExternalUser.getUser();
        //TODO: send to the connect screen
        navigation("/loading" + location.search);
      } catch (e) {
        const { loginRequest, loginToCommunication } =
          (await api.ExternalUser.loginWithTonomy({
            callbackPath: "/callback",
            redirect: false,
          })) as LoginWithTonomyMessages;

        sendRequestToMobile(
          [externalLoginRequest, loginRequest],
          loginToCommunication
        );
      }
    } catch (e) {
      console.error(JSON.stringify(e, null, 2));
      alert(e);
      // TODO handle error
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
