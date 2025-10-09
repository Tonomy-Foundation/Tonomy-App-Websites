import React from "react";
import IDIcon from "../../tonomyAppList/assets/appSwitcherIcons/ID.png";
import GOVPlusIcon from "../../tonomyAppList/assets/appSwitcherIcons/gov+.png";
import DAOIcon from "../../tonomyAppList/assets/appSwitcherIcons/DAO.png";
import BuildIcon from "../../tonomyAppList/assets/appSwitcherIcons/Build.png";
import BanklessIcon from "../../tonomyAppList/assets/appSwitcherIcons/Bankless.png";
import DemoIcon from "../../tonomyAppList/assets/appSwitcherIcons/demo.png";
import LaunchpadIcon from "../../tonomyAppList/assets/appSwitcherIcons/launchpad.png";
import TonomyLogo from "../../tonomyAppList/assets/appSwitcherIcons/tonomy.png";
import FiddleArtIcon from "../../tonomyAppList/assets/appSwitcherIcons/fiddleart.png";
import CXCWorldIcon from "../../tonomyAppList/assets/appSwitcherIcons/cxcworld.png"; // add new icon

import "./AppSwitcher.css";
import settings from "../settings";

const availableApps = [
  { name: "ID", icon: IDIcon, link: "https://tonomy.io/tonomy-id" },
  {
    name: "Launchpad",
    icon: LaunchpadIcon,
    link: "https://launchpad.tonomy.io",
  },
  {
    name: "Bankless",
    icon: BanklessIcon,
    link: settings.config.tonomyAppsOrigin + "/bankless",
  },
  {
    name: "Explorer",
    icon: TonomyLogo,
    link: settings.config.blockExplorerUrl,
  },
  { name: "Demo", icon: DemoIcon, link: settings.config.demoWebsiteOrigin },
  { name: "Fiddle.art", icon: FiddleArtIcon, link: "https://fiddl.art" },
];

const comingSoonApps = [
  { name: "GOV+", icon: GOVPlusIcon },
  { name: "DAO", icon: DAOIcon },
  { name: "Build", icon: BuildIcon },
  { name: "CXC World", icon: CXCWorldIcon },
];

export default function AppSwitcher() {
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

      {/* Divider */}
      <div
        style={{
          gridColumn: "1 / -1",
          borderTop: "1px solid #e0e0e0",
          margin: "10px 0",
        }}
      />

      {/* Coming Soon Section */}
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
