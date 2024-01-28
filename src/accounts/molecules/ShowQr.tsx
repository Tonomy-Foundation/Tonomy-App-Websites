import QRCode from "react-qr-code";
import TProgressCircle from "../../common/atoms/TProgressCircle";
import { TP } from "../../common/atoms/THeadings";
import { isMobile } from "../utils/IsMobile";

export default function QROrLoading({
  showQr,
}: {
  showQr: string | undefined;
}) {
  return (
    <>
      {!isMobile() && (
        <>
          <TP>Scan the QR code with the Tonomy ID app</TP>
          {!showQr && <TProgressCircle />}
          {showQr && <QRCode value={showQr}></QRCode>}
        </>
      )}
      {isMobile() && (
        <>
          <TP>Redirecting to Tonomy ID</TP>
          <TProgressCircle />
        </>
      )}
    </>
  );
}
