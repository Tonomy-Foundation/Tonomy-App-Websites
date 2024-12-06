import QRCode from "react-qr-code";
import TProgressCircle from "../../common/atoms/TProgressCircle";
import { TP } from "../../common/atoms/THeadings";
import { isMobile } from "../utils/IsMobile";
import settings from "../../common/settings";
import { App } from "@tonomy/tonomy-id-sdk";

export default function QROrLoading({
  showQr,
  app,
}: {
  showQr: string | undefined;
  app: App | undefined;
}) {
  
  return (
    <>
      {!isMobile() && (
        <>
        <TP className="app-text">
            {app?.appName}{` `}
            is using the Pangea identity system to improve your security and
            privacy in their application 
          </TP>
          <TP className="learn-more">Learn more</TP>

          {!showQr && <TProgressCircle />}
          {showQr && <QRCode value={showQr}></QRCode>}
          <TP className="bottom-scan-text">
            Scan this QR code using your{" "}
            <span className="app-link-color">{settings.config.appName}</span> to
            continue your process of purchasing
          </TP>
        </>
      )}
      {isMobile() && (
        <>
          <TP>Redirecting to {settings.config.appName}</TP>
          <TProgressCircle />
        </>
      )}
    </>
  );
}