import React from "react";
import IDIcon from "../../tonomyAppList/assets/appSwitcherIcons/ID.png";
import GOVPlusIcon from "../../tonomyAppList/assets/appSwitcherIcons/gov+.png";
import DAOIcon from "../../tonomyAppList/assets/appSwitcherIcons/DAO.png";
import BuildIcon from "../../tonomyAppList/assets/appSwitcherIcons/Build.png";
import BanklessIcon from "../../tonomyAppList/assets/appSwitcherIcons/Bankless.png";
import DemoIcon from "../../tonomyAppList/assets/appSwitcherIcons/demo.png";
import LaunchpadIcon from "../../tonomyAppList/assets/appSwitcherIcons/launchpad.png";
import "./AppSwitcher.css";
import settings from "../settings";

const apps = [
  { name: "ID", icon: IDIcon, link: "https://tonomy.io/tonomy-id" },
  { name: "GOV+", icon: GOVPlusIcon, link: "https://tonomy.io" },
  { name: "DAO", icon: DAOIcon, link: "https://tonomy.io" },
  { name: "Build", icon: BuildIcon, link: "https://tonomy.io" },
  {
    name: "Bankless",
    icon: BanklessIcon,
    link: settings.config.tonomyAppsOrigin,
  },
  { name: "Demo", icon: DemoIcon, link: settings.config.demoWebsiteOrigin },
  {
    name: "Launchpad",
    icon: LaunchpadIcon,
    link: "https://launchpad.tonomy.io",
  },
];

export default function AppSwitcher() {
  return (
    <div className="app-switcher">
      {apps.map((app) => (
        // <div className="app-item" >
        <a
          key={app.name}
          href={`${app.link}`}
          className="app-item"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={app.icon} alt={app.name} className="app-icon" />
          <span className="app-label">{app.name}</span>
        </a>
        // </div>
      ))}
    </div>
  );
}
