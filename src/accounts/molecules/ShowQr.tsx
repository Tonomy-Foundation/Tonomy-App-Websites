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

export default function QROrLoading({
  showQr,
}: {
  showQr: string | undefined;
}) {
  console.log("showQr", showQr)
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleMouseEnter = (e) => {
    e.currentTarget.style.borderBottom = "2px solid #66BB6A";
  };
  const handleMouseLeave = (e) => {
    e.currentTarget.style.borderBottom = "none";
  };
  const handleMouseDown = (e) => {
    e.currentTarget.style.color = "#388E3C";
  };
  const styles = {
    detailContainer: {
      marginTop: "30px",
      padding: "35px",
      border: "1px solid var(--grey-border)",
      borderRadius: "20px",
      backgroundColor: "#FFF",
    },
    qrContainer: {
      display: "flex",
      flexDirection: "column" as const,
      gap: 25,
    },
    qrSubContainer: {
      display: "flex",
      flexDirection: "column" as const,
      gap: 12
    },
    qrTitle: {
      fontWeight: 600,
      lineHeight: "24.6px",
      letterSpacing: 0.5,
    },
    qrDescription: {
      lineHeight: "20.5px",
      fontSize: 20,
      letterSpacing: 0.5
    },
    qrList: {
      fontSize: 20,
      letterSpacing: 0.5,
      paddingLeft: 23,
      paddingTop: 12,
    },
    qrAssistanceButton: {
      color: "#4CAF50",
      fontSize: 20,
      lineHeight: '20.5px',
      display: "flex",
      alignItems: "center",
      gap: 12,
      fontFamily: '"Epilogue", Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
    },
    commonLink: {
      color: "#4CAF50",
      textDecoration: "none",
    },
    highlightedLink: {
      color: "#000000",
      borderBottom: "2px solid #4CAF50",
      textDecoration: "none",
    },
    linksWrapper: {
      display: "flex",
      alignItems: "center",
      gap: 5,
      flexWrap: "wrap" as "wrap",
      lineHeight: "20.5px"
    },
  };
  return (
    <>
      {!isMobile() && (
        <Box sx={styles.container}>
          <Grid container spacing={2}>
            {/* Left side */}
            <Grid item xs={12} md={8}>
              <Box sx={styles.qrContainer}>
                <Box sx={styles.qrSubContainer}>
                  <TH3 style={styles.qrTitle}>
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
                        style={styles.highlightedLink}
                        title="Learn more about Pangea ID"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        onMouseDown={handleMouseDown}
                      >
                        {settings.config.appName}
                      </Link>
                    </Tooltip>
                  </TH3>
                  <TP style={styles.qrDescription}>
                    You'll need the {settings.config.appName} app for a secure, one-tap login that streamlines your access.
                  </TP>
                </Box>

                <Divider sx={{ borderColor: "#E4EBF6" }} />

                <ol style={styles.qrList}>
                  <li>
                    <Box sx={styles.linksWrapper}>
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
                        style={styles.link}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        onMouseDown={handleMouseDown}
                      >
                        iOS
                      </Link>{" "}
                      or{" "}
                      <Link
                        to={settings.config.links.playStoreDownload}
                        style={styles.link}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        onMouseDown={handleMouseDown}
                      >
                        Android
                      </Link>
                    </Box>
                  </li>

                  <li>Create an account in {settings.config.appName}</li>

                  <li>
                    <Box sx={styles.linksWrapper}>
                      Press the scan QR button
                      <MuiLink component={Link} to="">
                        <TImage height={18} width={18} src="/src/accounts/assets/icon-qr.svg" alt="QR icon" />
                      </MuiLink>
                    </Box>
                  </li>

                  <li>Point your phone at the QR code</li>
                </ol>

                <ButtonBase
                  onClick={handleOpen}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  onMouseDown={handleMouseDown}
                  sx={styles.qrAssistanceButton}
                >
                  Get assistance{" "}
                  <TImage height={12} width={12} src="/src/accounts/assets/icon-arrow.svg" alt="Arrow icon" />
                </ButtonBase>
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

      {/* Mobile version — add logic/content as needed */}
      {isMobile() && (
        <Box>
          {/* Add your mobile logic here */}
        </Box>
      )}

      <QRCodeHelpModal open={open} onClose={handleClose} />
    </>
  );
}
