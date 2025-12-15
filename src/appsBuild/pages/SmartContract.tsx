import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useApps } from "../context/AppsContext";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import { formatAppUsername } from "../common/formatUsername";
import "./SmartContract.css";
import "./PlanBilling.css";

export default function SmartContract() {
    const { username } = useParams();
    const { getAppByUsername, updateAppPlan, deploySmartContract, updateSmartContract, updateSmartContractRAM, sellSmartContractRAM } = useApps();
    const app = username ? getAppByUsername(username) : undefined;

    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [showDeployForm, setShowDeployForm] = useState(false);
    const [showUpgradeForm, setShowUpgradeForm] = useState(false);
    const [wasmFile, setWasmFile] = useState<File | null>(null);
    const [abiFile, setAbiFile] = useState<File | null>(null);
    const [sourceCodeUrl, setSourceCodeUrl] = useState("");
    const [ramAmount, setRamAmount] = useState(500);

    const currentPlan = app?.plan || "basic";
    const smartContract = app?.smartContract;

    const handleUpgradeToPro = async () => {
        if (username && app) {
            await updateAppPlan(username, "pro");
            setShowUpgradeModal(false);
        }
    };

    const handleDeploy = async () => {
        if (username && wasmFile && abiFile) {
            await deploySmartContract(username, wasmFile, abiFile, sourceCodeUrl || undefined);
            setShowDeployForm(false);
            setWasmFile(null);
            setAbiFile(null);
            setSourceCodeUrl("");
        }
    };

    const handleUpgradeContract = async () => {
        if (username && wasmFile && abiFile) {
            await updateSmartContract(username, wasmFile, abiFile, sourceCodeUrl || undefined);
            setShowUpgradeForm(false);
            setWasmFile(null);
            setAbiFile(null);
            setSourceCodeUrl("");
        }
    };

    const handlePurchaseRAM = async () => {
        if (username && smartContract && ramAmount > 0) {
            await updateSmartContractRAM(username, smartContract.ramPurchasedMB + ramAmount);
        }
    };

    const handleSellRAM = async () => {
        if (username && smartContract && ramAmount > 0) {
            const maxSellable = smartContract.ramPurchasedMB - smartContract.ramUsedMB;
            if (ramAmount <= maxSellable) {
                await sellSmartContractRAM(username, ramAmount);
            }
        }
    };

    const ramUsagePercent = smartContract
        ? (smartContract.ramUsedMB / smartContract.ramPurchasedMB) * 100
        : 0;

    // Show upgrade modal if trying to access on basic plan
    if (currentPlan === "basic") {
        return (
            <>
                <div className="smart-contract">
                    <section className="sc-section sc-intro">
                        <h3>Smart Contracts</h3>
                        <p>
                            Deploy and manage smart contracts on the Tonomy blockchain using the Tonomy ID SDK.
                        </p>
                        <button className="upgrade-needed-btn" onClick={() => setShowUpgradeModal(true)}>
                            <WorkspacePremiumIcon /> Upgrade to PRO Required
                        </button>
                    </section>
                </div>

                <Dialog open={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} maxWidth="sm" fullWidth>
                    <div className="upgrade-modal">
                        <button className="modal-close" onClick={() => setShowUpgradeModal(false)}>
                            <CloseIcon />
                        </button>
                        <h2 className="modal-title">Billing plan</h2>
                        <p className="modal-description">
                            Smart contract deployment is only available for PRO users. Please update your billing plan to
                            deploy your first smart contract
                        </p>

                        {/* Pro Plan Card - matching PlanBilling design */}
                        <div className="pricing-card pricing-card-pro">
                            <div className="plan-header">
                                <div className="plan-icon plan-icon-pro">
                                    <WorkspacePremiumIcon />
                                </div>
                                <div className="plan-info">
                                    <h3 className="plan-name">Pro</h3>
                                    <p className="plan-description">Perfect for scaling apps and growing businesses</p>
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
                            </ul>

                            <div className="plan-footer">
                                <button className="upgrade-button" onClick={handleUpgradeToPro}>
                                    Upgrade to PRO
                                </button>
                            </div>
                        </div>
                    </div>
                </Dialog>
            </>
        );
    }

    return (
        <div className="smart-contract">
            <section className="sc-section sc-intro">
                <h3>Smart Contract</h3>
                <p>
                    Manage your app's smart contract lifecycle. Power your app with on-chain logic, ensure security, and
                    streamline upgrades
                </p>
            </section>

            {smartContract ? (
                <>
                    {/* Active Contract Card */}
                    <section className="sc-section">
                        <div className="contract-card">
                            <div className="contract-header">
                                <span className="contract-badge">✦ Active Smart Contract</span>
                            </div>
                            <h4 className="contract-name">Contract v{smartContract.version}</h4>
                            <div className="contract-details">
                                <div className="detail-row">
                                    <span className="detail-label">Deployed on:</span>
                                    <span className="detail-value">
                                        {smartContract.deployedOn.toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Owner:</span>
                                    <span className="detail-value">{formatAppUsername(app.ownerUsername)}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Account name:</span>
                                    <span className="detail-value">
                                        {app.accountName}
                                        <IconButton
                                            size="small"
                                            onClick={() => window.open(`https://explorer.tonomy.io/account/${app.accountName}`, '_blank')}
                                            style={{ marginLeft: '8px', padding: '4px' }}
                                        >
                                            <OpenInNewIcon fontSize="small" />
                                        </IconButton>
                                    </span>
                                </div>
                            </div>
                            {smartContract.sourceCodeUrl && (
                                <a href={smartContract.sourceCodeUrl} target="_blank" rel="noopener noreferrer" className="contract-link">
                                    View the contract source code <OpenInNewIcon fontSize="small" style={{ marginLeft: '4px', verticalAlign: 'middle' }} />
                                </a>
                            )}
                            <div className="contract-actions">
                                <button className="btn-primary" onClick={() => setShowUpgradeForm(true)}>
                                    Update Contract
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* RAM Usage Section */}
                    <section className="sc-section ram-section">
                        <h4>Storage Management</h4>
                        <div className="ram-card">
                            <div className="ram-info">
                                <span className="ram-label">RAM Usage</span>
                                <span className="ram-values">
                                    {smartContract.ramUsedMB} MB / {smartContract.ramPurchasedMB} MB
                                </span>
                            </div>
                            <div className="ram-progress-bar">
                                <div className="ram-progress-fill" style={{ width: `${ramUsagePercent}%` }} />
                            </div>

                            <div className="ram-adjust">
                                <label className="ram-adjust-label">Storage Capacity (MB)</label>
                                <div className="ram-adjust-row">
                                    <input
                                        type="number"
                                        value={ramAmount}
                                        onChange={(e) => setRamAmount(Number(e.target.value))}
                                        min="100"
                                        step="100"
                                    />
                                    <button className="btn-primary" onClick={handlePurchaseRAM}>
                                        Buy RAM
                                    </button>
                                    <button
                                        className="btn-secondary"
                                        onClick={handleSellRAM}
                                        disabled={ramAmount > smartContract.ramPurchasedMB - smartContract.ramUsedMB}
                                    >
                                        Sell RAM
                                    </button>
                                </div>
                                <div className="ram-adjust-price">
                                    <strong>${((ramAmount / 1000) * 50).toFixed(2)}/month</strong> • $50 per GB/month
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Deployment History */}
                    <section className="sc-section">
                        <h4>Deployment History</h4>
                        <div className="deployment-table">
                            <div className="table-header-row">
                                <span>Version</span>
                                <span>Deployed on</span>
                            </div>
                            <div className="table-row">
                                <span>Contract v3</span>
                                <span>Jan 12, 2025</span>
                            </div>
                            <div className="table-row">
                                <span>Contract v2</span>
                                <span>Jan 12, 2025</span>
                            </div>
                            <div className="table-row">
                                <span>Contract v1</span>
                                <span>Jan 12, 2025</span>
                            </div>
                        </div>
                    </section>
                </>
            ) : (
                /* No Contract Deployed */
                <section className="sc-section">
                    <div className="no-contract-card">
                        <p>No smart contract deployed yet.</p>
                        <button className="btn-primary" onClick={() => setShowDeployForm(true)}>
                            Deploy Smart Contract
                        </button>
                    </div>
                </section>
            )}

            {/* Deploy/Upgrade Form */}
            {(showDeployForm || showUpgradeForm) && (
                <div className="deploy-form-overlay">
                    <div className="deploy-form">
                        <h4>{showDeployForm ? "Deploy Smart Contract" : "Upgrade Smart Contract"}</h4>
                        <div className="file-upload-group">
                            <label>
                                <UploadFileIcon /> WASM File (.wasm)
                                <input
                                    type="file"
                                    accept=".wasm"
                                    onChange={(e) => setWasmFile(e.target.files?.[0] || null)}
                                />
                            </label>
                            {wasmFile && <span className="file-name">{wasmFile.name}</span>}
                        </div>
                        <div className="file-upload-group">
                            <label>
                                <UploadFileIcon /> ABI File (.abi)
                                <input
                                    type="file"
                                    accept=".abi,.json"
                                    onChange={(e) => setAbiFile(e.target.files?.[0] || null)}
                                />
                            </label>
                            {abiFile && <span className="file-name">{abiFile.name}</span>}
                        </div>
                        <div className="file-upload-group">
                            <label htmlFor="sourceCodeUrl" style={{ cursor: 'default', border: 'none', padding: '0' }}>
                                Source Code URL (optional)
                            </label>
                            <input
                                id="sourceCodeUrl"
                                type="url"
                                placeholder="https://github.com/..."
                                value={sourceCodeUrl}
                                onChange={(e) => setSourceCodeUrl(e.target.value)}
                                style={{ display: 'block', width: '100%', padding: '10px', border: '1px solid var(--gray-300)', borderRadius: '6px' }}
                            />
                        </div>
                        <div className="form-actions">
                            <button
                                className="btn-secondary"
                                onClick={() => {
                                    setShowDeployForm(false);
                                    setShowUpgradeForm(false);
                                    setWasmFile(null);
                                    setAbiFile(null);
                                    setSourceCodeUrl("");
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn-primary"
                                onClick={showDeployForm ? handleDeploy : handleUpgradeContract}
                                disabled={!wasmFile || !abiFile}
                            >
                                {showDeployForm ? "Deploy" : "Upgrade"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
