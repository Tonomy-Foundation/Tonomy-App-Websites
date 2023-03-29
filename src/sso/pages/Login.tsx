import React, { useEffect, useState } from "react";
import {
  UserApps,
  setSettings,
  ExternalUser,
  Communication,
  Message,
  KeyManagerLevel,
} from "@tonomy/tonomy-id-sdk";
import QRCode from "react-qr-code";
import { TH1, TP } from "../components/THeadings";
import TImage from "../components/TImage";
import TProgressCircle from "../components/TProgressCircle";
import settings from "../settings";
import { isMobile } from "../utills/IsMobile";
import JsKeyManager from "../keymanager";
import logo from "../assets/tonomy/tonomy-logo1024.png";
import { redirect, useNavigate } from "react-router-dom";
import { useCommunicationStore } from "../stores/communication.store";

setSettings({
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

  useEffect(() => {
    handleRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function sendRequestToMobile(jwtRequests: string[]) {
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

      /**
       * sending login requests flow
       * at first the website logins and wait for the login results
       * then it subscribe for new messages from the server
       * if the message has type ack which means other client is awaiting for message from this client
       * then this client sends the requests to the ack client
       * else means the requests are authenticated and we can redirect back to the callback request
       */
      await communication.login(logInMessage);

      communication.subscribeMessage(async function (responseMessage) {
        const message = new Message(responseMessage);

        console.log("recieved", message);

        if (message.getPayload().type === "ack") {
          const requestMessage = await ExternalUser.signMessage(
            {
              requests: jwtRequests,
            },
            new JsKeyManager(),
            message.getSender()
          );

          localStorage.setItem("did", message.getSender());

          communication.sendMessage(requestMessage);
        } else {
          window.location.replace(
            `/callback?requests=${message.getPayload().requests}&accountName=${
              message.getPayload().accountName
            }&username=nousername`
          );
        }
      });
    }
  }

  async function handleRequests() {
    try {
      const verifiedJwt = await UserApps.onRedirectLogin();
      const keymanager = new JsKeyManager();
      let user: ExternalUser | false;

      try {
        user = await ExternalUser.getUser(keymanager);
      } catch (e) {
        user = false;
      }

      if (user) {
        //TODO: send to the connect screen

        navigation("/loading" + location.search);
      } else {
        const tonomyJwt = (await ExternalUser.loginWithTonomy(
          {
            callbackPath: "/callback",
            redirect: false,
          },
          keymanager
        )) as string;

        sendRequestToMobile([verifiedJwt.jwt, tonomyJwt]);
      }
    } catch (e) {
      console.error(e);
      alert(e);
      // TODO handle error

      return;
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
