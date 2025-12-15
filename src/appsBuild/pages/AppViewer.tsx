import React from "react";
import { useParams } from "react-router-dom";
import { useApps } from "../context/AppsContext";
import "./AppViewer.css";

export default function AppViewer() {
    const { username } = useParams();
    const { getAppByUsername } = useApps();
    const app = username ? getAppByUsername(username) : undefined;

    if (!app) {
        return (
            <div className="viewer-container">
                <div className="viewer-content">
                    <div className="viewer-card">
                        <h2>App not found</h2>
                        <p>The requested application could not be found.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="viewer-container">
            <aside className="viewer-sidebar">
                <div className="sidebar-header">Tonomy Build</div>
                <nav className="sidebar-nav">
                    <button className="nav-item active">Overview</button>
                    <button className="nav-item">Contracts</button>
                    <button className="nav-item">Credentials</button>
                    <button className="nav-item">Settings</button>
                </nav>
            </aside>
            <div className="viewer-content">
                <div className="viewer-card">
                    <div className="viewer-card-header">
                        <img src={app.logoUrl} alt="logo" className="viewer-logo" />
                        <div className="viewer-titles">
                            <h2 className="viewer-app-name">{app.appName}</h2>
                            <div className="viewer-subtitle">{app.appUsername} • {app.domain}</div>
                        </div>
                    </div>
                    <p className="viewer-description">{app.description}</p>
                    <div className="viewer-actions">
                        <button className="primary">Edit app</button>
                        <button className="secondary">Open website</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
