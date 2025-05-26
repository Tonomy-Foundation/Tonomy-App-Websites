import QRCode from "react-qr-code";
import { TH3, TP } from "../../common/atoms/THeadings";
import { isMobile } from "../utils/IsMobile";
import settings from "../../common/settings";
import TSpinner from "../atoms/TSpinner";
import { Box, Grid, Divider, Tooltip, ButtonBase } from "@mui/material";
import { Link } from "react-router-dom";
import TImage from "../../common/atoms/TImage";
import { useState } from "react";
import QRCodeHelpModal from "../atoms/QRCodeHelpModal";
import MuiLink from "@mui/material/Link";
import "./ShowQr.css";
import IconQR from "../assets/icon-qr.svg";
export default function QROrLoading({
  showQr,
}: {
  showQr: string | undefined;
}) {
  console.log("showQr", showQr);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <>
      {!isMobile() && (
        <Box className="detailContainer">
          <Grid container spacing={10}>
            {/* Left side */}
            <Grid item xs={12} md={8}>
              <Box className="qrContainer">
                <Box className="qrSubContainer">
                  <TH3 className="qrTitle">
                    Log in with{" "}
                    <Tooltip
                      title="Learn more about Tonomy ID"
                      placement="top"
                      arrow
                      componentsProps={{
                        tooltip: {
                          sx: {
                            bgcolor: "#3F3F40",
                            color: "#fff",
                            fontSize: 14,
                            lineHeight: "15px",
                          },
                        },
                      }}
                    >
                      <Link
                        to="https://tonomy.io/"
                        className="highlightedLink"
                        title="Learn more about Tonomy ID"
                      >
                        {settings.config.appName}
                      </Link>
                    </Tooltip>
                  </TH3>
                  <TP className="qrDescription">
                    You'll need the {settings.config.appName} app for a secure,
                    one-tap login that streamlines your access.
                  </TP>
                </Box>

                <Divider sx={{ borderColor: "rgba(var(--accent-rgb),0.2)" }} />

                <ol className="qrList">
                  <li>
                    <Box className="linksWrapper">
                      Download
                      <TImage
                        width={24}
                        height={24}
                        src={settings.config.images.mobileLogo}
                        alt={`${settings.config.appName} Logo`}
                      />
                      {settings.config.appName} for{" "}
                      <Link
                        target="_blank"
                        to={settings.config.links.appleStoreDownload}
                        className="commonLink"
                      >
                        iOS
                      </Link>{" "}
                      or{" "}
                      <Link
                        target="_blank"
                        to={settings.config.links.playStoreDownload}
                        className="commonLink"
                      >
                        Android
                      </Link>
                    </Box>
                  </li>

                  <li>Create an account in {settings.config.appName}</li>

                  <li>
                    <Box className="linksWrapper" alignItems="center">
                      Press the scan QR button
                      <svg
                        width="26"
                        height="26"
                        viewBox="0 0 28 28"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect
                          x="0.5"
                          y="1"
                          width="27"
                          height="27"
                          rx="4.75"
                          stroke="var(--accent)"
                        />
                        <path
                          d="M6.125 10.5625V8.59375C6.125 8.07161 6.33242 7.57085 6.70163 7.20163C7.07085 6.83242 7.57161 6.625 8.09375 6.625H10.0625M6.125 18.4375V20.4062C6.125 20.9284 6.33242 21.4292 6.70163 21.7984C7.07085 22.1676 7.57161 22.375 8.09375 22.375H10.0625M17.9375 6.625H19.9062C20.4284 6.625 20.9292 6.83242 21.2984 7.20163C21.6676 7.57085 21.875 8.07161 21.875 8.59375V10.5625M17.9375 22.375H19.9062C20.4284 22.375 20.9292 22.1676 21.2984 21.7984C21.6676 21.4292 21.875 20.9284 21.875 20.4062V18.4375M9.07812 14.5H18.9219"
                          stroke="var(--accent)"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </Box>
                  </li>

                  <li>Point your phone at the QR code</li>
                </ol>

                <div>
                  <ButtonBase
                    onClick={handleOpen}
                    className="qrAssistanceButton"
                  >
                    Get assistance{" "}
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
              </Box>
            </Grid>

            {/* Right side */}
            <Grid
              item
              xs={12}
              md={4}
              display="flex"
              justifyContent="flex-end"
              sx={{ paddingLeft: "0 !important" }}
            >
              {!showQr ? (
                <TSpinner />
              ) : (
                <QRCode
                  fgColor="var(--accent)"
                  bgColor="var(--app-background-active)"
                  value={showQr}
                  style={{ height: "auto", maxWidth: "100%", width: "90%" }}
                />
              )}
            </Grid>
          </Grid>
        </Box>
      )}
      <QRCodeHelpModal open={open} onClose={handleClose} />
    </>
  );
}
