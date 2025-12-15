import React, { useState } from "react";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import "./LoginSetup.css";
import { getSettings } from "@tonomy/tonomy-id-sdk";

interface LoginSetupProps {
    onNavigate?: (section: string) => void;
}

export default function LoginSetup({ onNavigate }: LoginSetupProps) {
    const [activeInstallTab, setActiveInstallTab] = useState("npm");
    const settings = getSettings();

    const handleSmartContractClick = () => {
        if (onNavigate) {
            onNavigate("Smart Contract");
        }
    };

    return (
        <div className="login-setup">
            {/* Intro Section */}
            <section className="setup-section setup-intro">
                <h3>Tonomy ID SDK Integration</h3>
                <p>
                    Integrate Tonomy's Single Sign-On (SSO) to enable passwordless login for your users.
                    Follow the steps below to get started with the Tonomy ID SDK.
                </p>
            </section>

            {/* Installation Section */}
            <section className="setup-section">
                <div className="step-header">
                    <h4>1. Install SDK</h4>
                    <a
                        href="https://docs.tonomy.io/build-web4-apps/installation"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="step-docs-link"
                    >
                        <OpenInNewIcon fontSize="small" />
                    </a>
                </div>
                <div className="tab-switcher">
                    <button
                        className={`tab-btn ${activeInstallTab === "npm" ? "active" : ""}`}
                        onClick={() => setActiveInstallTab("npm")}
                    >
                        npm
                    </button>
                    <button
                        className={`tab-btn ${activeInstallTab === "yarn" ? "active" : ""}`}
                        onClick={() => setActiveInstallTab("yarn")}
                    >
                        yarn
                    </button>
                </div>

                <div className="code-block">
                    {activeInstallTab === "npm" ? (
                        <pre><code>{`npm install @tonomy/tonomy-id-sdk`}</code></pre>
                    ) : (
                        <pre><code>{`yarn add @tonomy/tonomy-id-sdk`}</code></pre>
                    )}
                </div>

                <p className="warning-note">
                    <strong>⚠ Note:</strong> The Tonomy ID SDK is ESM-only. If you encounter module issues,
                    refer to the <a href="https://docs.tonomy.io/build-web4-apps/troubleshooting" target="_blank" rel="noopener noreferrer">
                        troubleshooting guide
                    </a>.
                </p>
            </section>

            {/* Network Configuration Section */}
            <section className="setup-section">
                <div className="step-header">
                    <h4>2. Configure Network</h4>
                    <a
                        href="https://docs.tonomy.io/build-web4-apps/usage/single-sign-on"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="step-docs-link"
                    >
                        <OpenInNewIcon fontSize="small" />
                    </a>
                </div>
                <p>
                    Import and configure the SDK with your preferred network environment:
                </p>

                <div className="code-block">
                    <pre><code>{
                        `import { ExternalUser } from '@tonomy/tonomy-id-sdk';

ExternalUser.setSettings({
    ssoWebsiteOrigin: '${settings.ssoWebsiteOrigin}',
    blockchainUrl: '${settings.blockchainUrl}',
    communicationUrl: '${settings.communicationUrl}',
    currencySymbol: '${settings.currencySymbol}',
});`}
                    </code></pre>
                </div>
            </section>

            {/* What's Next Section */}
            <section className="setup-section setup-features">
                <h4>What's Next?</h4>
                <p>
                    Explore more features and capabilities of the Tonomy ID SDK:
                </p>

                <div className="features-grid">
                    <a href="https://docs.tonomy.io/build-web4-apps/usage/single-sign-on" target="_blank" rel="noopener noreferrer" className="feature-card">
                        <OpenInNewIcon className="feature-icon" />
                        <span>Login a user to your app</span>
                    </a>

                    <a href="https://docs.tonomy.io/build-web4-apps/usage/usage" target="_blank" rel="noopener noreferrer" className="feature-card">
                        <OpenInNewIcon className="feature-icon" />
                        <span>Access login data and logout</span>
                    </a>

                    <a href="https://docs.tonomy.io/build-web4-apps/usage/sign-verifiable-credentials" target="_blank" rel="noopener noreferrer" className="feature-card">
                        <OpenInNewIcon className="feature-icon" />
                        <span>Sign private data (verifiable credentials)</span>
                    </a>

                    <a href="https://docs.tonomy.io/build-web4-apps/usage/smart-contracts" target="_blank" rel="noopener noreferrer" className="feature-card">
                        <OpenInNewIcon className="feature-icon" />
                        <span>Sign on-chain transactions</span>
                    </a>

                    <button onClick={handleSmartContractClick} className="feature-card feature-card-button">
                        <OpenInNewIcon className="feature-icon" />
                        <span>Deploy and manage smart contracts</span>
                    </button>

                    <a href="https://docs.tonomy.io/build-web4-apps/usage/reusable-kyc" target="_blank" rel="noopener noreferrer" className="feature-card">
                        <OpenInNewIcon className="feature-icon" />
                        <span>Verify user identity with Reusable KYC</span>
                    </a>

                    <a href="https://docs.tonomy.io/build-web4-apps/usage/server-authentication" target="_blank" rel="noopener noreferrer" className="feature-card">
                        <OpenInNewIcon className="feature-icon" />
                        <span>Authenticate securely with your server</span>
                    </a>

                    <a href="https://docs.tonomy.io/build-web4-apps/usage/send-p2p-messages" target="_blank" rel="noopener noreferrer" className="feature-card">
                        <OpenInNewIcon className="feature-icon" />
                        <span>Send peer-to-peer messages to other users</span>
                    </a>
                </div>
            </section>
        </div>
    );
}
