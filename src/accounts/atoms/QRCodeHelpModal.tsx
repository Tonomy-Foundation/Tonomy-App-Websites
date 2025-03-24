import { Box, ButtonBase, Modal } from "@mui/material";
import TImage from "../../common/atoms/TImage";
import TScanner from "../atoms/TScanner";
import { TP } from "../../common/atoms/THeadings";
import { Link } from "react-router-dom";
import settings from "../../common/settings";
import "./QRCodeHelpModal.css";
export default function QRCodeHelpModal({ open, onClose }: { open: boolean; onClose: () => void }) {
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
                <div className="qrContainerModal">
                    <div className="qrModalHeader" >
                        <h2 className="qrModalTitle">QR Code Login Tips</h2>
                        <ButtonBase onClick={onClose}> <TImage height={20} width={20} src={"/src/accounts/assets/icon-close.png"} alt={`Close icon`} /></ButtonBase>
                    </div>
                    <div style={{ backgroundColor: "#F6F9FB", borderRadius: 15 }}>
                        <TScanner height={267} width={267} />
                    </div>

                    <div>
                        <TP className="qrModalSectionTitle">Scanning Tips</TP>
                        <ol className="qrModalList">
                            <li>Ensure good lighting</li>
                            <li>Keep your phone steady to avoid focus issues</li>
                            <li>Hold your phone 10–15 cm away from the QR code</li>
                        </ol>
                    </div>
                    <div>
                        <TP className="qrModalSectionTitle">Troubleshooting</TP>
                        <ol className="qrModalList">
                            <li>Ensure the app has camera access permission</li>
                            <li>
                                Make sure you are using the latest version of {settings.config.appName} from the{" "}
                                <Link className="commonLink"
                                    to={settings.config.links.appleStoreDownload}>
                                    App Store
                                </Link>
                                {" "}or {" "}
                                <Link className="commonLink"
                                    to={settings.config.links.playStoreDownload}>
                                    Google Play</Link>
                            </li>
                        </ol>
                    </div>
                </div>
                <div>
                    <ButtonBase className="qrModalHelp"
                        onClick={() => window.open("https://discord.com/invite/8zDf8AF3ja")}>
                        Get help on Discord
                        <TImage height={12} width={12} src={"/src/accounts/assets/icon-arrow.svg"} alt={`Get help on Discord`} />
                    </ButtonBase>
                </div>
            </Box>
        </Modal>
    );
}
