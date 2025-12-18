import IDIcon from "../../apps/assets/appSwitcherIcons/ID.png";
import GOVPlusIcon from "../../apps/assets/appSwitcherIcons/gov+.png";
import DAOIcon from "../../apps/assets/appSwitcherIcons/DAO.png";
import BuildIcon from "../../apps/assets/appSwitcherIcons/Build.png";
import BanklessIcon from "../../apps/assets/appSwitcherIcons/Bankless.png";
import DemoIcon from "../../apps/assets/appSwitcherIcons/demo.png";
import LaunchpadIcon from "../../apps/assets/appSwitcherIcons/launchpad.png";
import TonomyLogo from "../../apps/assets/appSwitcherIcons/tonomy.png";
import FiddleArtIcon from "../../apps/assets/appSwitcherIcons/fiddleart.png";
import CXCWorldIcon from "../../apps/assets/appSwitcherIcons/cxcworld.png";
import settings from "../settings";

export interface App {
  name: string;
  icon: string;
  link?: string;
  description?: string;
}

export function getCoreApps(origin: string): App[] {
  return [
    {
      name: "ID",
      icon: IDIcon,
      link: "https://tonomy.io/tonomy-id",
      description: "Own your identity everywhere and keep full control of it",
    },
    {
      name: "Bankless",
      icon: BanklessIcon,
      link: `${origin}/bankless`,
      description:
        "Manage your TONO tokens as easily as any neo-banking application. Full control without compromise",
    },
    {
      name: "Build",
      icon: BuildIcon,
      link: `${origin}/build`,
      description:
        "Build anything with our Low-Code/No-Code suite, empowering next-generation secure and seamless app development",
    },
    {
      name: "Launchpad",
      icon: LaunchpadIcon,
      link: "https://launchpad.tonomy.io",
      description: "The platform to join Tonomy early and get your tokens",
    },
    {
      name: "Explorer",
      icon: TonomyLogo,
      link: settings.config.blockExplorerUrl,
      description:
        "A tool to explore, track, and verify transactions across the Tonomy blockchain network",
    },
  ];
}

export function getEcosystemApps(): App[] {
  return [
    {
      name: "Demo",
      icon: DemoIcon,
      link: settings.config.demoWebsiteOrigin,
      description:
        "Search, view, and track your Tonomy Blockchain transactions and activities in real-time",
    },
    {
      name: "Fiddl.art",
      icon: FiddleArtIcon,
      link: "https://fiddl.art",
      description:
        "A vibrant creative platform where artists showcase their work, connect with others, and collaborate globally",
    },
    {
      name: "Tonoscan",
      icon: TonomyLogo,
      link: "https://tonomyscan.io/",
      description:
        "Tonomyscan allows you to explore and search the Tonomy blockchain (TONO)",
    },
  ];
}

export function getComingSoonApps(): App[] {
  return [
    {
      name: "GOV+",
      icon: GOVPlusIcon,
      description:
        "Participate actively in the liquid democracy governance and help shape the future of the Tonomy ecosystem",
    },
    {
      name: "DAO",
      icon: DAOIcon,
      description:
        "Incorporate businesses and manage employee access and controls. Fully decentralised",
    },
    {
      name: "CXC World",
      icon: CXCWorldIcon,
      description:
        "Step into CXC World, the hub where innovation, community, and the Tonomy vision come together",
    },
  ];
}
