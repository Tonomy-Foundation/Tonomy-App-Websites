import React from "react";
import "./Home.css";
import Share from "../assets/share.svg";
import TImage from "../../common/atoms/TImage";
import { getCoreApps, getEcosystemApps, getComingSoonApps } from "../../common/data/apps";

export default function Home() {
  const origin = window.location.origin;
  const coreApps = getCoreApps(origin);
  const ecosystemApps = getEcosystemApps();
  const comingSoonApps = getComingSoonApps();

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
        {coreApps.map((service, index) => (
          <div className="service-card" key={index}>
            <a
              href={`${service.link}`}
              className="service-link card-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="card-content">
                <a
                  href={`${service.link}`}
                  className="service-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="service-url">
                    {new URL(service.link!).hostname}
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
                  src={service.icon}
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

      <div className="services-intro">Ecosystem apps</div>

      <div className="services-grid">
        {ecosystemApps.map((service, index) => (
          <div className="service-card" key={index}>
            <a
              href={`${service.link}`}
              className="service-link card-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="card-content">
                <a
                  href={`${service.link}`}
                  className="service-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="service-url">
                    {new URL(service.link!).hostname}
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
                  src={service.icon}
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
        {comingSoonApps.map((service, index) => (
          <div className="service-card" key={index}>
            <div className="card-content">
              <TImage
                src={service.icon}
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
