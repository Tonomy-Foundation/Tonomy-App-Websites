import React, { useState } from "react";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import "./LoginSetup.css";
import { getSettings, isProduction } from "@tonomy/tonomy-id-sdk";

interface LoginSetupProps {
  onNavigate?: (section: string) => void;
}

export default function LoginSetup({ onNavigate }: LoginSetupProps) {
  const [activeInstallTab, setActiveInstallTab] = useState("npm");
  const [copiedInstall, setCopiedInstall] = useState(false);
  const [copiedConfig, setCopiedConfig] = useState(false);
  const settings = getSettings();
  const isProd = isProduction();

  const installCommand = activeInstallTab === "npm"
    ? "npm install @tonomy/tonomy-id-sdk"
    : "yarn add @tonomy/tonomy-id-sdk";

  const configCode = `import { ExternalUser } from '@tonomy/tonomy-id-sdk';

ExternalUser.setSettings({
    ssoWebsiteOrigin: '${settings.ssoWebsiteOrigin}',
    blockchainUrl: '${settings.blockchainUrl}',
    communicationUrl: '${settings.communicationUrl}',
    currencySymbol: '${settings.currencySymbol}',
});`;

  const handleCopyInstall = () => {
    navigator.clipboard.writeText(installCommand);
    setCopiedInstall(true);
    setTimeout(() => setCopiedInstall(false), 2000);
  };

  const handleCopyConfig = () => {
    navigator.clipboard.writeText(configCode);
    setCopiedConfig(true);
    setTimeout(() => setCopiedConfig(false), 2000);
  };

  const handleSmartContractClick = () => {
    if (onNavigate) {
      onNavigate("Smart Contract");
    }
  };

  const handleSigningKeysClick = () => {
    if (onNavigate) {
      onNavigate("Signing Keys");
    }
  };

  return (
    <div className="login-setup">
      {/* Intro Section */}
      <section className="setup-section setup-intro">
        <h3>Tonomy ID SDK Integration</h3>
        <p>
          Integrate Tonomy's Single Sign-On (SSO) to enable passwordless login
          for your users. Follow the steps below to get started with the Tonomy
          ID SDK.
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

        <div className="code-block-wrapper">
          <div className="code-block">
            {activeInstallTab === "npm" ? (
              <pre>
                <code>{`npm install @tonomy/tonomy-id-sdk`}</code>
              </pre>
            ) : (
              <pre>
                <code>{`yarn add @tonomy/tonomy-id-sdk`}</code>
              </pre>
            )}
          </div>
          <button className="copy-btn" onClick={handleCopyInstall} title="Copy to clipboard">
            {copiedInstall ? <CheckIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
          </button>
        </div>

        <p className="warning-note">
          <strong>⚠ Note:</strong> The Tonomy ID SDK is ESM-only. If you
          encounter module issues, refer to the{" "}
          <a
            href="https://docs.tonomy.io/build-web4-apps/troubleshooting"
            target="_blank"
            rel="noopener noreferrer"
          >
            troubleshooting guide
          </a>
          .
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

        <div className="code-block-wrapper">
          <div className="code-block">
            <pre>
              <code>{configCode}</code>
            </pre>
          </div>
          <button className="copy-btn" onClick={handleCopyConfig} title="Copy to clipboard">
            {copiedConfig ? <CheckIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
          </button>
        </div>

        {isProd ? (
          <p className="info-note">
            <strong>ℹ Testing:</strong> A full testing environment is available on testnet. Visit{" "}
            <a href="https://testnet.tonomy.foundation/build" target="_blank" rel="noopener noreferrer">
              Tonomy Build Testnet
            </a>{" "}
            to test your integration before going live.
          </p>
        ) : (
          <p className="info-note">
            <strong>ℹ Development:</strong> You can immediately test your app running on{" "}
            <code>localhost:3000</code> connected to the Testnet network.
          </p>
        )}
      </section>

      {/* Starter Templates Section */}
      <section className="setup-section">
        <h4>3. Starter Templates</h4>
        <p>Get started quickly with our example applications:</p>
        <div className="template-links">
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="template-link"
          >
            <OpenInNewIcon fontSize="small" />
            <span>React Template</span>
          </a>
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="template-link"
          >
            <OpenInNewIcon fontSize="small" />
            <span>Vue Template</span>
          </a>
        </div>
      </section>

      {/* What's Next Section */}
      <section className="setup-section setup-features">
        <h4>What's Next?</h4>
        <p>Explore more features and capabilities of the Tonomy ID SDK:</p>

        <div className="features-grid">
          <a
            href="https://docs.tonomy.io/build-web4-apps/usage/single-sign-on"
            target="_blank"
            rel="noopener noreferrer"
            className="feature-card"
          >
            <OpenInNewIcon className="feature-icon" />
            <span>Login a user to your app</span>
          </a>

          <a
            href="https://docs.tonomy.io/build-web4-apps/usage/usage"
            target="_blank"
            rel="noopener noreferrer"
            className="feature-card"
          >
            <OpenInNewIcon className="feature-icon" />
            <span>Access login data and logout</span>
          </a>

          <a
            href="https://docs.tonomy.io/build-web4-apps/usage/sign-verifiable-credentials"
            target="_blank"
            rel="noopener noreferrer"
            className="feature-card"
          >
            <OpenInNewIcon className="feature-icon" />
            <span>Sign private data (verifiable credentials)</span>
          </a>

          <a
            href="https://docs.tonomy.io/build-web4-apps/usage/smart-contracts"
            target="_blank"
            rel="noopener noreferrer"
            className="feature-card"
          >
            <OpenInNewIcon className="feature-icon" />
            <span>Sign on-chain transactions</span>
            <WorkspacePremiumIcon className="feature-premium-icon" />
          </a>

          <button
            onClick={handleSmartContractClick}
            className="feature-card feature-card-button"
          >
            <OpenInNewIcon className="feature-icon" />
            <span>Deploy and manage smart contracts</span>
            <WorkspacePremiumIcon className="feature-premium-icon" />
          </button>

          <button
            onClick={handleSigningKeysClick}
            className="feature-card feature-card-button"
          >
            <OpenInNewIcon className="feature-icon" />
            <span>Add a Signing Key</span>
            <WorkspacePremiumIcon className="feature-premium-icon" />
          </button>

          <a
            href="https://docs.tonomy.io/build-web4-apps/usage/reusable-kyc"
            target="_blank"
            rel="noopener noreferrer"
            className="feature-card"
          >
            <OpenInNewIcon className="feature-icon" />
            <span>Verify user identity with Reusable KYC</span>
            <WorkspacePremiumIcon className="feature-premium-icon" />
          </a>

          <a
            href="https://docs.tonomy.io/build-web4-apps/usage/server-authentication"
            target="_blank"
            rel="noopener noreferrer"
            className="feature-card"
          >
            <OpenInNewIcon className="feature-icon" />
            <span>Authenticate securely with your server</span>
          </a>

          <a
            href="https://docs.tonomy.io/build-web4-apps/usage/send-p2p-messages"
            target="_blank"
            rel="noopener noreferrer"
            className="feature-card"
          >
            <OpenInNewIcon className="feature-icon" />
            <span>Send peer-to-peer messages to other users</span>
          </a>
        </div>
      </section>
    </div>
  );
}
