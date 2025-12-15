import React from "react";
import "./LoginPreview.css";
import { AppFormData } from "./CreateAppForm";
import QRExampleImage from "../assets/qr-example.png";

export type LoginPreviewProps = {
    appData: AppFormData;
};

const LoginPreview = (props: LoginPreviewProps) => {
    const { appName, logoUrl, description, backgroundColor, accentColor } = props.appData;

    const displayDescription = `${appName || "Your app"} uses Tonomy ID to give you control of your identity and data`;

    return (
        <div className="login-preview-container" style={{
            backgroundColor: backgroundColor,
        }}>
            <div className="preview-content">
                {/* App Details Section */}
                <div className="preview-title-container">
                    {logoUrl ? (
                        <img
                            src={logoUrl}
                            alt={appName || "App"}
                            className="preview-app-logo"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = "https://via.placeholder.com/94?text=Logo";
                            }}
                        />
                    ) : (
                        <div className="preview-app-logo-placeholder">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="2" />
                                <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
                                <path d="M21 15l-5-5L5 21" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    )}
                    <div className="preview-title-content">
                        <h2 className="preview-title">{appName || "Your App Name"}</h2>
                        <p className="preview-description">{displayDescription}</p>
                    </div>
                </div>

                {/* QR Container - Grey Background */}
                <div className="preview-detail-container" style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.05)',
                }}>
                    <div className="preview-qr-section">
                        <div className="preview-qr-sub-container">
                            <h3 className="preview-qr-title">
                                Log in with Tonomy ID
                            </h3>
                        </div>

                        <hr className="preview-divider" style={{
                            borderColor: `${accentColor}33`
                        }} />

                        <ol className="preview-qr-list">
                            <li>Download <span style={{ color: accentColor }}>Tonomy ID</span></li>
                            <li>Create an account</li>
                            <li>Scan <span style={{ color: accentColor }}>QR code</span></li>
                        </ol>
                    </div>

                    <div className="preview-qr-display">
                        <img
                            src={QRExampleImage}
                            alt="QR Code"
                            className="preview-qr-image"
                        />
                    </div>
                </div>

                {/* Security Info */}
                <div className="preview-secure-info">
                    <svg width="14" height="18" viewBox="0 0 14 18" fill="none">
                        <path
                            d="M11 9H12.4C12.7314 9 13 9.2686 13 9.6V16.4C13 16.7314 12.7314 17 12.4 17H1.6C1.26863 17 1 16.7314 1 16.4V9.6C1 9.2686 1.26863 9 1.6 9H3M11 9V5C11 3.66667 10.2 1 7 1C3.8 1 3 3.66667 3 5V9M11 9H3"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                    <span>Tonomy uses end-to-end cryptography. We cannot see your personal data</span>
                </div>
            </div>
        </div>
    );
};

export default LoginPreview;


