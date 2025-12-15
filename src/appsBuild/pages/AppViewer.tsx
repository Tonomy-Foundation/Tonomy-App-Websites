import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApps } from "../context/AppsContext";
import SettingsIcon from "@mui/icons-material/Settings";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import IconButton from "@mui/material/IconButton";
import LoginSetup from "./LoginSetup";
import SmartContract from "./SmartContract";
import PlanBilling from "./PlanBilling";
import AccountKeys from "./AccountKeys";
import { formatAppUsername, formatOwnerUsername } from "../common/formatUsername";
import "./AppViewer.css";

export default function AppViewer() {
    const { username } = useParams();
    const navigate = useNavigate();
    const { getAppByUsername } = useApps();
    const app = username ? getAppByUsername(username) : undefined;
    const [activeNav, setActiveNav] = useState("Overview");

    const formattedAppUsername = app ? formatAppUsername(app.appUsername) : "";
    const formattedOwnerUsername = app ? formatOwnerUsername(app.ownerUsername) : "";

    if (!app) {
        return (
            <div className="viewer-wrapper">
                <div className="viewer-content">
                    <div className="viewer-card">
                        <h2>App not found</h2>
                        <p>The requested application could not be found.</p>
                    </div>
                </div>
            </div>
        );
    }

    const handleOpenAccount = () => {
        window.open(`https://explorer.tonomy.io/account/${app.accountName}`, '_blank');
    };

    const handleOpenWebsite = () => {
        window.open(app.domain, '_blank');
    };

    return (
        <div className="viewer-wrapper">
            <aside className="viewer-sidebar">
                <nav className="sidebar-nav">
                    <button
                        className={`nav-item ${activeNav === "Overview" ? "active" : ""}`}
                        onClick={() => setActiveNav("Overview")}
                    >
                        Overview
                    </button>
                    <button
                        className={`nav-item ${activeNav === "Login Setup" ? "active" : ""}`}
                        onClick={() => setActiveNav("Login Setup")}
                    >
                        Login Setup
                    </button>
                    <button
                        className={`nav-item ${activeNav === "Plan & Billing" ? "active" : ""}`}
                        onClick={() => setActiveNav("Plan & Billing")}
                    >
                        Plan & Billing
                    </button>
                    <button
                        className={`nav-item ${activeNav === "Smart Contract" ? "active" : ""}`}
                        onClick={() => setActiveNav("Smart Contract")}
                    >
                        Smart Contract
                    </button>
                    <button
                        className={`nav-item ${activeNav === "Signing Keys" ? "active" : ""}`}
                        onClick={() => setActiveNav("Signing Keys")}
                    >
                        Signing Keys
                    </button>
                </nav>
            </aside>
            <div className="viewer-content">
                {activeNav === "Overview" && (
                    <div className="viewer-card">
                        <div className="viewer-card-header">
                            <img src={app.logoUrl} alt="logo" className="viewer-logo" />
                            <div className="viewer-titles">
                                <h2 className="viewer-app-name">{app.appName}</h2>
                                <div className="viewer-subtitle">{formattedAppUsername}</div>
                            </div>
                            <IconButton
                                className="viewer-settings-btn"
                                onClick={() => navigate(`/build/apps/${app.appUsername}/edit`)}
                                size="small"
                            >
                                <SettingsIcon />
                            </IconButton>
                        </div>

                        <div className="viewer-account-info">
                            <div className="info-row">
                                <span className="info-label">Owner:</span>
                                <div className="info-with-icon">
                                    <span className="info-value">{formattedOwnerUsername}</span>
                                </div>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Account:</span>
                                <div className="info-with-icon">
                                    <span className="info-value">{app.accountName}</span>
                                    <IconButton
                                        size="small"
                                        onClick={handleOpenAccount}
                                        className="open-icon-btn"
                                    >
                                        <OpenInNewIcon fontSize="small" />
                                    </IconButton>
                                </div>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Domain:</span>
                                <div className="info-with-icon">
                                    <span className="info-value">{app.domain}</span>
                                    <IconButton
                                        size="small"
                                        onClick={handleOpenWebsite}
                                        className="open-icon-btn"
                                    >
                                        <OpenInNewIcon fontSize="small" />
                                    </IconButton>
                                </div>
                            </div>
                        </div>

                        <div className="viewer-colors">
                            <div className="color-item">
                                <span className="color-label">Background Color</span>
                                <div className="color-display">
                                    <div
                                        className="color-swatch"
                                        style={{ backgroundColor: app.backgroundColor }}
                                    />
                                    <span className="color-value">{app.backgroundColor}</span>
                                </div>
                            </div>
                            <div className="color-item">
                                <span className="color-label">Accent Color</span>
                                <div className="color-display">
                                    <div
                                        className="color-swatch"
                                        style={{ backgroundColor: app.accentColor }}
                                    />
                                    <span className="color-value">{app.accentColor}</span>
                                </div>
                            </div>
                        </div>

                        <p className="viewer-description">{app.description}</p>
                    </div>
                )}

                {activeNav === "Login Setup" && (
                    <div className="viewer-card">
                        <LoginSetup onNavigate={setActiveNav} />
                    </div>
                )}

                {activeNav === "Plan & Billing" && (
                    <div className="viewer-card">
                        <PlanBilling />
                    </div>
                )}

                {activeNav === "Smart Contract" && (
                    <div className="viewer-card">
                        <SmartContract />
                    </div>
                )}

                {activeNav === "Signing Keys" && (
                    <div className="viewer-card">
                        <AccountKeys />
                    </div>
                )}
            </div>
        </div>
    );
}