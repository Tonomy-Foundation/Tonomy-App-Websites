import React, { useContext, useEffect } from "react";
import { ExternalUser, isErrorCode, SdkErrors } from "@tonomy/tonomy-id-sdk";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import useErrorStore from "../../common/stores/errorStore";
import { AuthContext } from "../providers/AuthProvider";
import HyphaDAO from "../assets/hypha-dao.svg";
import FiddleArt from "../assets/fiddle-art.svg";
import Share from "../assets/share.svg";
import TImage from "../../common/atoms/TImage";
import settings from "../../common/settings";

export default function Home() {
  const { signin } = useContext(AuthContext);
  const navigation = useNavigate();
  const errorStore = useErrorStore();
  // const {isConnected, address, } = useAccount();

  // console.log("isConnected", isConnected, "address", address);
  async function onRender() {
    try {
      const user = await ExternalUser.getUser({ autoLogout: false });

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
      name: "Hypha DAO",
      url: "https://hypha.earth",
      description:
        "A decentralized platform empowering communities to collaborate, govern, and grow together seamlessly",
      logo: HyphaDAO,
      icon: Share,
    },
    {
      name: "Fiddle Art",
      url: "https://tonomy.io",
      description:
        "A vibrant creative platform where artists showcase their work, connect with others, and collaborate globally",
      logo: FiddleArt,
      icon: Share,
    },
    {
      name: "Demo website",
      url: settings.config.demoWebsiteOrigin,
      description:
        "Search, view, and track your Tonomy Blockchain transactions and activities in real-time",
      logo: FiddleArt,
      icon: Share,
    },
    {
      name: "Tonomy Block Explorer",
      url: settings.config.blockExplorerUrl,
      description:
        "A tool to explore, track, and verify transactions across the Tonomy blockchain network",
      logo: FiddleArt,
      icon: Share,
    },
    {
      name: "Tonomy Bankless",
      url: settings.config.tonomyAppsOrigin,
      description:
        "Manage your TONO tokens as easily as any neo-banking application. Full control without compromise",
      logo: FiddleArt,
      icon: Share,
    },
  ];

  const MoreServices = [
    {
      name: "Tonomy DAO",
      url: "https://tonomy.io",
      description:
        "Incorporate businesses and manage employee access and controls. Fully decentralised",
      logo: FiddleArt,
      icon: Share,
    },
    {
      name: "Tonomy Gov+",
      url: "https://tonomy.io",
      description:
        "Participate actively in the liquid democracy governance and help shape the future of the Tonomy ecosystem",
      logo: FiddleArt,
      icon: Share,
    },
    {
      name: "Tonomy Build",
      url: "https://tonomy.io",
      description:
        "Build anything with our Low-Code/No-Code suite, empowering next-generation secure and seamless app development",
      logo: FiddleArt,
      icon: Share,
    },
  ];

  return (
    <div className="services-container">
      <div className="services-intro-head">
        {/* <w3m-button /> */}
        <h2>Your Tonomy apps, all in one place</h2>
        <p className="intro-subtext">
          Access all your Tonomy apps in one hub. Manage tokens, explore the
          blockchain, create, collaborate, and build — it’s all at your
          fingertips
        </p>
      </div>

      <div className="services-grid">
        {services.map((service, index) => (
          <div className="service-card" key={index}>
            <div className="card-content">
              <a
                href={`${service.url}`}
                className="service-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="service-url">{service.url}</span>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M5 2H3C2.73478 2 2.48043 2.10536 2.29289 2.29289C2.10536 2.48043 2 2.73478 2 3V9C2 9.26522 2.10536 9.51957 2.29289 9.70711C2.48043 9.89464 2.73478 10 3 10H9C9.26522 10 9.51957 9.89464 9.70711 9.70711C9.89464 9.51957 10 9.26522 10 9V7M6 6L10 2M10 2V4.5M10 2H7.5"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
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
          </div>
        ))}
      </div>

      <div className="services-intro">More apps available soon</div>

      <div className="services-grid">
        {MoreServices.map((service, index) => (
          <div className="service-card" key={index}>
            <div className="card-content">
              <a
                href={`${service.url}`}
                className="service-link"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "var(--app-accent)" }}
              >
                <span className="service-url">{service.url}</span>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M5 2H3C2.73478 2 2.48043 2.10536 2.29289 2.29289C2.10536 2.48043 2 2.73478 2 3V9C2 9.26522 2.10536 9.51957 2.29289 9.70711C2.48043 9.89464 2.73478 10 3 10H9C9.26522 10 9.51957 9.89464 9.70711 9.70711C9.89464 9.51957 10 9.26522 10 9V7M6 6L10 2M10 2V4.5M10 2H7.5"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
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
          </div>
        ))}
      </div>
    </div>
  );
}
