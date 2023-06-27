import defaultConfig from "./config/config.json";
import stagingConfig from "./config/config.staging.json";
import demoConfig from "./config/config.demo.json";

// cannot use NODE_ENV as it is always "production" on `npm run build`
const env = import.meta.env.VITE_APP_NODE_ENV || "development";

console.log(import.meta.env);
console.log(`VITE_APP_NODE_ENV=${env}`);

export type ConfigType = {
  theme: {
    primaryColor: string;
    secondaryColor: string;
    tertiaryColor: string;
    linkColor: string;
  };
  appLogoUrl: string;
  appName: string;
  ecosystemName: string;
  appSlogan: string;
  images: {
    logo48: string;
    logo1024: string;
  };
  links: {
    readMoreDownload: string;
    appleStoreDownload: string;
    playStoreDownload: string;
  };
  tonomyIdLink: string;
  communicationUrl: string;
  ssoWebsiteOrigin: string;
  blockchainUrl: string;
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
  case "demo":
    config = demoConfig;
    break;
  case "production":
    throw new Error("Production environment is not supported yet");
  default:
    throw new Error("Unknown environment: " + env);
}

if (import.meta.env.VITE_BLOCKCHAIN_URL) {
  console.log(
    `Using BLOCKCHAIN_URL from env:  ${import.meta.env.VITE_BLOCKCHAIN_URL}`
  );
  config.blockchainUrl = import.meta.env.VITE_BLOCKCHAIN_URL;
}

if (import.meta.env.VITE_SSO_WEBSITE_ORIGIN) {
  console.log(
    `Using SSO_WEBSITE_ORIGIN from env:  ${import.meta.env.VITE_SSO_WEBSITE_ORIGIN
    }`
  );
  config.ssoWebsiteOrigin = import.meta.env.VITE_SSO_WEBSITE_ORIGIN;
}

if (import.meta.env.VITE_COMMUNICATION_URL) {
  console.log(
    `Using VITE_COMMUNICATION_URL from env:  ${import.meta.env.VITE_COMMUNICATION_URL
    }`
  );
  config.communicationUrl = import.meta.env.VITE_COMMUNICATION_URL;
}

settings.config = config;

export default settings;
