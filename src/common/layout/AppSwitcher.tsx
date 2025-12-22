import React from "react";
import "./AppSwitcher.css";
import { getCoreApps, getEcosystemApps, getComingSoonApps } from "../data/apps";

export default function AppSwitcher() {
  const origin = window.location.origin;
  const availableApps = getCoreApps(origin);
  const ecosystemApps = getEcosystemApps();
  const comingSoonApps = getComingSoonApps();

  return (
    <div className="app-switcher">
      {availableApps.map((app) => (
        <a
          key={app.name}
          href={app.link}
          className="app-item"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={app.icon} alt={app.name} className="app-icon" />
          <span className="app-label">{app.name}</span>
        </a>
      ))}

      <div
        style={{
          gridColumn: "1 / -1",
          borderTop: "1px solid #e0e0e0",
          margin: "10px 0",
        }}
      />
      <div
        style={{
          gridColumn: "1 / -1",
          textAlign: "left",
          margin: "5px 18px",
          fontSize: "15px",
          fontWeight: "600",
          color: "var(--black)",
        }}
      >
        Ecosystem apps
      </div>

      {ecosystemApps.map((app) => (
        <a
          key={app.name}
          href={app.link}
          className="app-item"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={app.icon} alt={app.name} className="app-icon" />
          <span className="app-label">{app.name}</span>
        </a>
      ))}

      <div
        style={{
          gridColumn: "1 / -1",
          borderTop: "1px solid #e0e0e0",
          margin: "10px 0",
        }}
      />

      <div
        style={{
          gridColumn: "1 / -1",
          textAlign: "left",
          margin: "5px 18px",
          fontSize: "15px",
          fontWeight: "600",
          color: "var(--black)",
        }}
      >
        More apps available soon
      </div>

      {comingSoonApps.map((app) => (
        <div
          key={app.name}
          className="app-item"
          style={{ opacity: 0.5, cursor: "default" }}
        >
          <img src={app.icon} alt={app.name} className="app-icon" />
          <span className="app-label">{app.name}</span>
        </div>
      ))}
    </div>
  );
}
