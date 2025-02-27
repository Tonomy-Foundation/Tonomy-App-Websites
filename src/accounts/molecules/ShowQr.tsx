import QRCode from "react-qr-code";
import { TH3, TH4, TP } from "../../common/atoms/THeadings";
import { isMobile } from "../utils/IsMobile";
import settings from "../../common/settings";
import TSpinner from "../atoms/TSpinner";
import { Box, Grid, Divider } from "@mui/material";
import { Link } from "react-router-dom";
import TImage from "../../common/atoms/TImage";

export default function QROrLoading({
  showQr,
}: {
  showQr: string | undefined;
}) {
  return (
    <>
      {!isMobile() && (
        <Box sx={{ flexGrow: 1, textAlign: "left" }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <TH3 style={{ fontWeight: 600 }}>Log in with Pangea ID</TH3>
              <TP style={{ lineHeight: "21px", marginTop: 2 }}>
                You'll need the {settings.config.appName} app for a secure,
                one-tap login that streamlines your access
              </TP>
              <Divider sx={{ borderColor: "#E4EBF6", marginTop: 3 }} />
              <ol style={{ paddingLeft: "1rem", marginTop: 15, lineHeight: '28px' }}>
                <li>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 5 }}
                  >
                    Download{" "}
                    <TImage
                      width={22}
                      height={22}
                      src={settings.config.images.mobileLogo}
                      alt={`${settings.config.appName} Logo`}
                    />{" "}
                    Pangea ID for{" "}
                    <Link
                      style={{ color: "#4CAF50", textDecoration: "none" }}
                      to=""
                    >
                      iOS
                    </Link>{" "}
                    or{" "}
                    <Link
                      to=""
                      style={{ color: "#4CAF50", textDecoration: "none" }}
                    >
                      Android
                    </Link>
                  </div>
                </li>
                <li>Create an account in Pangea ID</li>
                <li>Press the scan QR button</li>
                <li>Point your phone at the QR code</li>
              </ol>
            </Grid>
            <Grid item xs={12} md={4} display="flex" justifyContent="center">
              {!showQr && <TSpinner />}
              {showQr && <QRCode value={showQr}></QRCode>}
            </Grid>
          </Grid>
        </Box>
      )}
      {isMobile() && (
        <>
          <TP>Redirecting to {settings.config.appName}</TP>
          <TSpinner />
        </>
      )}
    </>
  );
}
