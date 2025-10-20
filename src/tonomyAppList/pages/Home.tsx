import React, { useContext, useEffect } from "react";
import {
  AppsExternalUser,
  isErrorCode,
  SdkErrors,
} from "@tonomy/tonomy-id-sdk";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import useErrorStore from "../../common/stores/errorStore";
import { AuthContext } from "../providers/AuthProvider";
import Share from "../assets/share.svg";
import TImage from "../../common/atoms/TImage";
import settings from "../../common/settings";
import TonomyLogo from "../assets/appSwitcherIcons/tonomy.png";
import GOVPlusIcon from "../assets/appSwitcherIcons/gov+.png";
import DAOIcon from "../assets/appSwitcherIcons/DAO.png";
import BuildIcon from "../assets/appSwitcherIcons/Build.png";
import BanklessIcon from "../assets/appSwitcherIcons/Bankless.png";
import DemoIcon from "../assets/appSwitcherIcons/demo.png";
import IDIcon from "../assets/appSwitcherIcons/ID.png";
import LaunchpadIcon from "../assets/appSwitcherIcons/launchpad.png";
import FiddleArtIcon from "../assets/appSwitcherIcons/fiddleart.png";
import CXCWorldIcon from "../assets/appSwitcherIcons/cxcworld.png";

export default function Home() {
  const { signin } = useContext(AuthContext);
  const navigation = useNavigate();
  const errorStore = useErrorStore();

  async function onRender() {
    try {
      const user = await AppsExternalUser.getUser({ autoLogout: false });

      if (user) {
        signin(user);
      }
    } catch (e) {
      if (
        isErrorCode(e, [
          SdkErrors.AccountNotFound,
          SdkErrors.AccountDoesntExist,
          SdkErrors.UserNotLoggedIn,
        ])
      ) {
        // User not logged in
        navigation("/");
        return;
      }

      errorStore.setError({ error: e, expected: false });
    }
  }

  useEffect(() => {
    onRender();
  }, []);

  const services = [
    {
      name: "ID",
      url: "https://tonomy.io/tonomy-id",
      description: "Own your identity everywhere and keep full control of it",
      logo: IDIcon,
      icon: Share,
    },
    {
      name: "Launchpad",
      url: "https://tonomy.io",
      description: "The platform to join Tonomy early and get your tokens",
      logo: LaunchpadIcon,
      icon: Share,
    },
    {
      name: "Tonomy Bankless",
      url: settings.config.tonomyAppsOrigin + "/bankless",
      description:
        "Manage your TONO tokens as easily as any neo-banking application. Full control without compromise",
      logo: BanklessIcon,
      icon: Share,
      noredirect: true,
    },

    {
      name: "Tonomy Block Explorer",
      url: settings.config.blockExplorerUrl,
      description:
        "A tool to explore, track, and verify transactions across the Tonomy blockchain network",
      logo: TonomyLogo,
      icon: Share,
    },
    {
      name: "Demo website",
      url: settings.config.demoWebsiteOrigin,
      description:
        "Search, view, and track your Tonomy Blockchain transactions and activities in real-time",
      logo: DemoIcon,
      icon: Share,
    },
    {
      name: "Fiddle.art",
      url: "https://fiddl.art",
      description:
        "A vibrant creative platform where artists showcase their work, connect with others, and collaborate globally",
      logo: FiddleArtIcon,
      icon: Share,
    },
  ];

  const MoreServices = [
    {
      name: "Tonomy Build",
      description:
        "Build anything with our Low-Code/No-Code suite, empowering next-generation secure and seamless app development",
      logo: BuildIcon,
    },
    {
      name: "Tonomy Gov+",
      description:
        "Participate actively in the liquid democracy governance and help shape the future of the Tonomy ecosystem",
      logo: GOVPlusIcon,
    },

    {
      name: "Tonomy DAO",
      description:
        "Incorporate businesses and manage employee access and controls. Fully decentralised",
      logo: DAOIcon,
    },
    {
      name: "CXC World",
      description:
        "Step into CXC World, the hub where innovation, community, and the Tonomy vision come together",
      logo: CXCWorldIcon,
    },
  ];

  return (
    <div className="services-container">
      <div className="services-intro-head">
        <h2 className="landing-title">Your Tonomy apps, all in one place</h2>
        <p className="intro-subtext">
          Access all your Tonomy apps in one hub. Manage tokens, explore the
          blockchain, create, collaborate, and build — it’s all at your
          fingertips
        </p>
      </div>

      <div className="services-grid">
        {services.map((service, index) => (
          <div className="service-card" key={index}>
            <a
              href={`${service.url}`}
              className="service-link card-link"
              target={service.noredirect ? "_self" : "_blank"}
              rel="noopener noreferrer"
            >
              <div className="card-content">
                <a
                  href={`${service.url}`}
                  className="service-link"
                  target={service.noredirect ? "_self" : "_blank"}
                  rel="noopener noreferrer"
                >
                  <span className="service-url">
                    {new URL(service.url).hostname}
                  </span>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5 2H3C2.73478 2 2.48043 2.10536 2.29289 2.29289C2.10536 2.48043 2 2.73478 2 3V9C2 9.26522 2.10536 9.51957 2.29289 9.70711C2.48043 9.89464 2.73478 10 3 10H9C9.26522 10 9.51957 9.89464 9.70711 9.70711C9.89464 9.51957 10 9.26522 10 9V7M6 6L10 2M10 2V4.5M10 2H7.5"
                      stroke="#5833BC"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </a>
                <TImage
                  src={service.logo}
                  alt={service.name}
                  className="service-logo"
                />
                <h3 className="service-name">{service.name}</h3>
                <p className="service-description">{service.description}</p>
              </div>
            </a>
          </div>
        ))}
      </div>

      <div className="services-intro">More apps available soon</div>

      <div className="services-grid more-services">
        {MoreServices.map((service, index) => (
          <div className="service-card" key={index}>
            <div className="card-content">
              <TImage
                src={service.logo}
                alt={service.name}
                className="service-logo"
              />
              <h3 className="service-name">{service.name}</h3>
              <p className="service-description">{service.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
