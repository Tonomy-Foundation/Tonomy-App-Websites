import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import CloseIcon from "@mui/icons-material/Close";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import CheckIcon from "@mui/icons-material/Check";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useApps } from "../context/AppsContext";
import "./AccountKeys.css";
import "./PlanBilling.css";

export default function AccountKeys() {
  const { username } = useParams();
  const { getAppByUsername, updateAppPlan, addAccountKey, removeAccountKey } =
    useApps();
  const app = username ? getAppByUsername(username) : undefined;

  const [lastPrivateKey, setLastPrivateKey] = useState<string | null>(null);
  const [loadingKey, setLoadingKey] = useState<string | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);

  if (!app) {
    return (
      <div className="signing-keys">
        <p>App not found.</p>
      </div>
    );
  }

  const currentPlan = app.plan || "basic";

  const handleUpgradeToPro = async () => {
    if (username && app) {
      await updateAppPlan(username, "pro");
      setShowUpgradeModal(false);
    }
  };

  const keys = app.accountKeys || [];

  const handleAdd = async () => {
    setLoadingKey("add");
    const result = await addAccountKey(app.appUsername);
    if (result) {
      setLastPrivateKey(result.privateKey);
    }
    setLoadingKey(null);
  };

  const handleRemove = async (publicKey: string) => {
    setLoadingKey(publicKey);
    await removeAccountKey(app.appUsername, publicKey);
    setLoadingKey(null);
  };

  const handleCopyKey = () => {
    if (lastPrivateKey) {
      navigator.clipboard.writeText(lastPrivateKey);
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    }
  };

  // Show upgrade prompt if trying to access on basic plan
  if (currentPlan === "basic") {
    return (
      <>
        <div className="signing-keys">
          <section className="sc-section sc-intro">
            <h3>Signing Keys</h3>
            <p>Add and manage cryptographic signing keys for your app.</p>
            <button
              className="upgrade-needed-btn"
              onClick={() => setShowUpgradeModal(true)}
            >
              <WorkspacePremiumIcon /> Upgrade to PRO Required
            </button>
          </section>
        </div>

        <Dialog
          open={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          maxWidth="sm"
          fullWidth
        >
          <div className="upgrade-modal">
            <button
              className="modal-close"
              onClick={() => setShowUpgradeModal(false)}
            >
              <CloseIcon />
            </button>
            <h2 className="modal-title">Billing plan</h2>
            <p className="modal-description">
              Signing keys are only available for PRO users. Please update your
              billing plan to manage signing keys
            </p>

            {/* Pro Plan Card - matching PlanBilling design */}
            <div className="pricing-card pricing-card-pro">
              <div className="plan-header">
                <div className="plan-icon plan-icon-pro">
                  <WorkspacePremiumIcon />
                </div>
                <div className="plan-info">
                  <h3 className="plan-name">Pro</h3>
                  <p className="plan-description">
                    Perfect for scaling apps and growing businesses
                  </p>
                </div>
              </div>

              <div className="plan-price">
                <span className="price-amount price-amount-pro">$0.05</span>
                <span className="price-period">/ user / month</span>
              </div>

              <ul className="plan-features">
                <li>
                  <CheckIcon className="feature-check feature-check-pro" />
                  <span>Everything from Basic</span>
                </li>
                <li>
                  <CheckIcon className="feature-check feature-check-pro" />
                  <span>Web3 Transactions</span>
                </li>
                <li>
                  <CheckIcon className="feature-check feature-check-pro" />
                  <span>Smart Contracts</span>
                </li>
                <li>
                  <CheckIcon className="feature-check feature-check-pro" />
                  <span>Signing Keys</span>
                </li>
              </ul>

              <button className="upgrade-button" onClick={handleUpgradeToPro}>
                Upgrade to PRO
              </button>
            </div>
          </div>
        </Dialog>
      </>
    );
  }

  return (
    <div className="signing-keys">
      <div className="keys-header">
        <div>
          <h3>Signing Keys</h3>
          <p className="keys-subtitle">
            Add or remove signing keys for this app.
          </p>
        </div>
        <button
          className="btn-primary"
          onClick={handleAdd}
          disabled={loadingKey === "add"}
        >
          {loadingKey === "add" ? "Generating..." : "Generate Key"}
        </button>
      </div>

      {/* Usage Context */}
      <div className="keys-usage-info">
        <h4>What can you do with signing keys?</h4>
        <ul>
          <li>
            Sign automated transactions from a server with your own smart
            contract
          </li>
          <li>
            Interact with tokens or other on-chain contracts programmatically
          </li>
          <li>
            Automate Tonomy Build operations via on-chain transactions (e.g.,
            deploying contracts)
          </li>
        </ul>
      </div>

      {lastPrivateKey && (
        <div className="key-alert">
          <strong>⚠ Save this private key now:</strong>
          <div className="private-key-wrapper">
            <div className="private-key">{lastPrivateKey}</div>
            <button
              className="copy-key-btn"
              onClick={handleCopyKey}
              title="Copy to clipboard"
            >
              {copiedKey ? (
                <CheckIcon fontSize="small" />
              ) : (
                <ContentCopyIcon fontSize="small" />
              )}
            </button>
          </div>
          <div className="alert-hint">
            This secret key is shown only once. Store it securely.
          </div>
        </div>
      )}

      {keys.length === 0 ? (
        <div className="no-keys">
          <p>No keys yet.</p>
          <button
            className="btn-secondary"
            onClick={handleAdd}
            disabled={loadingKey === "add"}
          >
            Generate First Key
          </button>
        </div>
      ) : (
        <div className="keys-table">
          {keys.map((key) => (
            <div className="key-row" key={key.publicKey}>
              <div className="key-info">
                <div className="key-label">Public Key</div>
                <div className="key-value">{key.publicKey}</div>
                <div className="key-meta">
                  Updated {key.updatedAt.toLocaleDateString()}
                </div>
              </div>
              <div className="key-actions">
                <button
                  className="btn-text"
                  onClick={() => handleRemove(key.publicKey)}
                  disabled={loadingKey === key.publicKey}
                >
                  {loadingKey === key.publicKey ? "Removing..." : "Remove"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
