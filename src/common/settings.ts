import ReactDOM from "react-dom/client";
import defaultConfig from "./config/config.json";
import stagingConfig from "./config/config.staging.json";
import testnetConfig from "./config/config.testnet.json";
import productionConfig from "./config/config.production.json";
import Debug from "debug";

const debug = Debug("tonomy-app-websites:common:settings");

// cannot use NODE_ENV as it is always "production" on `npm run build`
const environmentVariables = import.meta.env || process?.env;
const env = environmentVariables.VITE_APP_NODE_ENV || "development";

console.log(`VITE_APP_NODE_ENV=${env}`);

export type ConfigType = {
  appLogoUrl: string;
  appName: string;
  ecosystemName: string;
  appSlogan: string;
  themeFile: string;
  images: {
    logo48: string;
    logo1024: string;
    mobileLogo: string;
  };
  links: {
    readMoreDownload: string;
    readMoreFoundation: string;
    appleStoreDownload: string;
    playStoreDownload: string;
  };
  accountSuffix: string;
  tonomyIdSchema: string;
  communicationUrl: string;
  ssoWebsiteOrigin: string;
  blockchainUrl: string;
  demoWebsiteOrigin: string;
  tonomyAppsOrigin: string;
  loggerLevel: "debug" | "error";
  blockExplorerUrl: string;
  documentationLink: string;
  currencySymbol: string;
  appId: string;
  sha256CertFingerprints: string;
  reownProjectId: string;
  baseNetwork: "localhost" | "base" | "base-sepolia";
  baseTokenAddress: string;
  baseRpcUrl: string;
  basePrivateKey: string;
};

type SettingsType = {
  env: string;
  config: ConfigType;
  isProduction: () => boolean;
};
let config: ConfigType;
const settings: SettingsType = {
  env,
  isProduction: () =>
    ["production", "testnet", "staging"].includes(settings.env),
} as SettingsType;

switch (env) {
  case "test":
  case "local":
  case "development":
    config = defaultConfig as ConfigType;
    break;
  case "staging":
    config = stagingConfig as ConfigType;
    break;
  case "testnet":
    config = testnetConfig as ConfigType;
    break;
  case "production":
    config = productionConfig as ConfigType;
    break;
  default:
    throw new Error("Unknown environment: " + env);
}

if (environmentVariables.VITE_BLOCKCHAIN_URL) {
  debug(
    `Using BLOCKCHAIN_URL from env:  ${environmentVariables.VITE_BLOCKCHAIN_URL}`,
  );
  config.blockchainUrl = environmentVariables.VITE_BLOCKCHAIN_URL;
}

if (environmentVariables.VITE_SSO_WEBSITE_ORIGIN) {
  debug(
    `Using SSO_WEBSITE_ORIGIN from env:  ${environmentVariables.VITE_SSO_WEBSITE_ORIGIN}`,
  );
  config.ssoWebsiteOrigin = environmentVariables.VITE_SSO_WEBSITE_ORIGIN;
}

if (environmentVariables.VITE_COMMUNICATION_URL) {
  debug(
    `Using VITE_COMMUNICATION_URL from env: ${environmentVariables.VITE_COMMUNICATION_URL}`,
  );
  config.communicationUrl = environmentVariables.VITE_COMMUNICATION_URL;
}

config.baseRpcUrl += environmentVariables.INFURA_API_KEY;
config.basePrivateKey += environmentVariables.ETHEREUM_PRIVATE_KEY;

// Add title
settings.config = config;

if (typeof document !== "undefined") {
  document.title = settings.config.appName;

  // Add favicon
  const faviconLink = document.createElement("link");

  faviconLink.type = "image/svg+xml";
  faviconLink.rel = "icon";
  faviconLink.href = settings.config.images.logo48;
  document.head.appendChild(faviconLink);

  // Add stylesheet
  const stylesheetLink = document.createElement("link");

  stylesheetLink.rel = "stylesheet";
  stylesheetLink.href = "/theme/" + settings.config.themeFile;
  document.head.appendChild(stylesheetLink);

  ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
}

export default settings;
