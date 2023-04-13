import React, { useEffect, useState } from "react";
import {
  UserApps,
  Message,
  MessageType,
  STORAGE_NAMESPACE,
  api,
  LoginWithTonomyMessages,
} from "@tonomy/tonomy-id-sdk";
import QRCode from "react-qr-code";
import { TH1, TP } from "../components/THeadings";
import TImage from "../components/TImage";
import TProgressCircle from "../components/TProgressCircle";
import settings from "../settings";
import { isMobile } from "../utills/IsMobile";
import logo from "../assets/tonomy/tonomy-logo1024.png";
import { useNavigate } from "react-router-dom";
import { useCommunicationStore } from "../stores/communication.store";

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
    jwtRequests: string[],
    loginMessage: Message
  ) {
    try {
      const requests = JSON.stringify(jwtRequests);

      if (isMobile()) {
        window.location.replace(
          `${settings.config.tonomyIdLink}?requests=${requests}`
        );

        // TODO
        // wait 1-2 seconds
        // if this code runs then the link didnt work
        setTimeout(() => {
          alert("link didn't work");
        }, 1000);
      } else {
        const logInMessage = new Message(jwtRequests[1]);
        const did = logInMessage.getSender();

        setShowQR(did);

        // Login to the communication server
        await communication.login(loginMessage);

        // subscribe for connection from Tonomy ID, which will then send login request
        communication.subscribeMessage(async (message) => {
          const requestMessage = await api.ExternalUser.signMessage(
            {
              requests: jwtRequests,
            },
            {
              recipient: message.getSender(),
              type: MessageType.LOGIN_REQUEST,
            }
          );

          localStorage.setItem(
            STORAGE_NAMESPACE + ".tonomy.id.did",
            message.getSender()
          );

          communication.sendMessage(requestMessage);
        }, MessageType.IDENTIFY);

        // subscribe for login request response
        communication.subscribeMessage(async (message: Message) => {
          window.location.replace(
            `/callback?requests=${message.getPayload().requests}&accountName=${message.getPayload().accountName
            }&username=nousername`
          );
        }, MessageType.LOGIN_REQUEST_RESPONSE);
      }
    } catch (e) {
      console.error(JSON.stringify(e, null, 2));
      alert(e);
    }
  }

  async function handleRequests() {
    try {
      const verifiedJwt = await UserApps.onRedirectLogin();

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
          [verifiedJwt.toString(), loginRequest.toString()],
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
          {!showQR && <TProgressCircle />}
          {showQR && <QRCode value={showQR}></QRCode>}
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
      <TH1>{settings.config.appName}</TH1>
      {renderQROrLoading()}
    </div>
  ) as any;
}

export default Login as any;
