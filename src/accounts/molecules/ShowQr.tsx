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
import MuiLink from '@mui/material/Link';
import "./ShowQr.css";
export default function QROrLoading({
  showQr,
}: {
  showQr: string | undefined;
}) {
  console.log("showQr", showQr)
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <>
      {!isMobile() && (
        <Box className="detailContainer">
          <Grid container spacing={2}>
            {/* Left side */}
            <Grid item xs={12} md={8}>
              <Box className="qrContainer">
                <Box className="qrSubContainer">
                  <TH3 className="qrTitle">
                    Log in with{" "}
                    <Tooltip
                      title="Learn more about Pangea ID"
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
                        to="https://pangea.web4.world/technology/pangea-passport"
                        className="highlightedLink"
                        title="Learn more about Pangea ID"
                      >
                        {settings.config.appName}
                      </Link>
                    </Tooltip>
                  </TH3>
                  <TP className="qrDescription">
                    You'll need the {settings.config.appName} app for a secure, one-tap login that streamlines your access.
                  </TP>
                </Box>

                <Divider sx={{ borderColor: "#E4EBF6" }} />

                <ol className="qrList" >
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
                        to={settings.config.links.appleStoreDownload}
                        className="commonLink"
                      >
                        iOS
                      </Link>{" "}
                      or{" "}
                      <Link
                        to={settings.config.links.playStoreDownload}
                        className="commonLink"
                      >
                        Android
                      </Link>
                    </Box>
                  </li>

                  <li>Create an account in {settings.config.appName}</li>

                  <li>
                    <Box className="linksWrapper">
                      Press the scan QR button
                      <MuiLink component={Link} to="">
                        <TImage height={18} width={18} src="/src/accounts/assets/icon-qr.svg" alt="QR icon" />
                      </MuiLink>
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
                    <TImage height={12} width={12} src="/src/accounts/assets/icon-arrow.svg" alt="Arrow icon" />
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
              {!showQr ? <TSpinner /> : <QRCode value={showQr} />}
            </Grid>
          </Grid>
        </Box>
      )}
      <QRCodeHelpModal open={open} onClose={handleClose} />
    </>
  );
}
