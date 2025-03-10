import { Box, ButtonBase, Modal } from "@mui/material";
import TImage from "../../common/atoms/TImage";
import TScanner from "../atoms/TScanner";
import { TP } from "../../common/atoms/THeadings";
import { Link } from "react-router-dom";
import settings from "../../common/settings";

export default function QRCodeHelpModal({ open, onClose }: { open: boolean; onClose: () => void }) {
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
        qrContainerModal: {
            display: "flex",
            flexDirection: "column" as const,
            gap: window.innerWidth < 768 ? 15 : 30,
        },
        qrModalHeader: {
            display: "flex",
            justifyContent: "space-between",
        },
        qrModalTitle: {
            fontSize: window.innerWidth < 768 ? 22 : 30,
            lineHeight: window.innerWidth < 768 ? "22.55px" : "30.75px",
            fontWeight: 600
        },
        qrModalSectionTitle: {
            fontWeight: 600,
            fontSize: window.innerWidth < 768 ? 16 : 18,
            lineHeight: window.innerWidth < 768 ? "5px" : "18.45px",
        },
        qrModalList: {
            paddingLeft: 23,
            paddingTop: 10,
            fontSize: window.innerWidth < 768 ? 16 : 18,
        },
        qrModalHelp: {
            color: "#4CAF50",
            marginTop: 24,
            display: "flex",
            gap: 12,
            textDecoration: "none",
            fontSize: window.innerWidth < 768 ? 16 : 20,
            lineHeight: window.innerWidth < 768 ? "5px" : "20.5px",
        },
        commonLink: {
            color: "#4CAF50",
            textDecoration: "none",
        },
    }
    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: "90%",
                    maxWidth: "600px",
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    p: 4,
                }}>
                <div style={styles.qrContainerModal}>
                    <div style={styles.qrModalHeader} >
                        <h2 style={styles.qrModalTitle}>QR Code Login Tips</h2>
                        <ButtonBase onClick={onClose}> <TImage height={20} width={20} src={"/src/accounts/assets/icon-close.png"} alt={`Close icon`} /></ButtonBase>
                    </div>
                    <div style={{ backgroundColor: "#F6F9FB", borderRadius: 15 }}>
                        <TScanner height={267} width={267} />
                    </div>

                    <div>
                        <TP style={styles.qrModalSectionTitle}>Scanning Tips</TP>
                        <ol style={styles.qrModalList}>
                            <li>Ensure good lighting</li>
                            <li>Keep your phone steady to avoid focus issues</li>
                            <li>Hold your phone 10–15 cm away from the QR code</li>
                        </ol>
                    </div>
                    <div>
                        <TP style={styles.qrModalSectionTitle}>Troubleshooting</TP>
                        <ol style={styles.qrModalList}>
                            <li>Ensure the app has camera access permission</li>
                            <li>
                                Make sure you are using the latest version of {settings.config.appName} from the{" "}
                                <Link style={styles.commonLink}
                                    onMouseEnter={handleMouseEnter}
                                    onMouseLeave={handleMouseLeave}
                                    onMouseDown={handleMouseDown}
                                    to={settings.config.links.appleStoreDownload}>
                                    App Store
                                </Link>
                                {" "}or {" "}
                                <Link style={styles.commonLink}
                                    onMouseEnter={handleMouseEnter}
                                    onMouseLeave={handleMouseLeave}
                                    onMouseDown={handleMouseDown}
                                    to={settings.config.links.playStoreDownload}>
                                    Google Play</Link>
                            </li>
                        </ol>
                    </div>
                </div>
                <div>
                    <ButtonBase style={styles.qrModalHelp}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        onMouseDown={handleMouseDown}
                        onClick={() => window.open("https://discord.com/invite/8zDf8AF3ja")}>
                        Get help on Discord
                        <TImage height={12} width={12} src={"/src/accounts/assets/icon-arrow.svg"} alt={`Get help on Discord`} />
                    </ButtonBase>
                </div>
            </Box>
        </Modal>
    );
}
