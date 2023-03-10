const env = import.meta.env.VITE_APP_NODE_ENV || "development";

import defaultConfig from "./config/config.json";
import stagingConfig from "./config/config.staging.json";

type ConfigType = {
  blockchainUrl: string;
  theme: {
    primaryColor: string;
    secondaryColor: string;
    tertiaryColor: string;
  };
  appName: string;
  ecosystemName: string;
  appSlogan: string;
  images: {
    logo48: string;
    logo1024: string;
  };
  links: {
    readMoreDownload: string;
    playStoreDownload: string;
    appleStoreDownload: string;
  };
  tonomyIdLink: string;
  communicationUrl: string;
};

type SettingsType = {
  env: string;
  config: ConfigType;
  isProduction: () => boolean;
};

let config: ConfigType;
const settings: SettingsType = {
  env,
  isProduction: () => settings.env === "production",
} as SettingsType;

switch (env) {
  case "test":
  case "local":
  case "development":
    config = defaultConfig;
    break;
  case "staging":
    config = stagingConfig;
    break;
  case "production":
    config = defaultConfig;
    // TODO add production config when ready
    break;
  default:
    throw new Error("Unknown environment: " + env);
}

if (import.meta.env.VITE_APP_BLOCKCHAIN_URL) {
  console.log(
    `Using BLOCKCHAIN_URL from env:  ${import.meta.env.VITE_APP_BLOCKCHAIN_URL}`
  );
  config.blockchainUrl = import.meta.env.VITE_APP_BLOCKCHAIN_URL;
}

if (import.meta.env.VITE_APP_TONOMY_ID_LINK) {
  console.log(
    `Using TONOMY_ID_LINK from env:  ${import.meta.env.VITE_APP_TONOMY_ID_LINK}`
  );
  config.tonomyIdLink = import.meta.env.VITE_APP_TONOMY_ID_LINK;
}

if (import.meta.env.VITE_APP_COMMUNICATION_URL) {
  console.log(
    `Using communication microService from env: ${
      import.meta.env.VITE_APP_COMMUNICATION_URL
    }`
  );
  config.communicationUrl = import.meta.env.VITE_APP_COMMUNICATION_URL;
}

settings.config = config;

export default settings;
