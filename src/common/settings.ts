import ReactDOM from "react-dom/client";
import defaultConfig from "./config/config.json";
import stagingConfig from "./config/config.staging.json";
import testnetConfig from "./config/config.testnet.json";
import productionConfig from "./config/config.production.json";

// cannot use NODE_ENV as it is always "production" on `npm run build`
const env = import.meta.env.VITE_APP_NODE_ENV || "development";

console.log(import.meta.env);
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
  loggerLevel: "debug" | "error";
  blockExplorerUrl: string;
  documentationLink: string;
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

type FixLoggerLevelEnumType<T> = Omit<T, "loggerLevel"> & {
  loggerLevel: "debug" | "error";
};

switch (env) {
  case "test":
  case "local":
  case "development":
    config = defaultConfig as FixLoggerLevelEnumType<typeof defaultConfig>;

    break;
  case "staging":
    config = stagingConfig as FixLoggerLevelEnumType<typeof stagingConfig>;

    break;
  case "testnet":
    config = testnetConfig as FixLoggerLevelEnumType<typeof testnetConfig>;

    break;
  case "production":
    config = productionConfig as FixLoggerLevelEnumType<
      typeof productionConfig
    >;

    break;
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
    `Using SSO_WEBSITE_ORIGIN from env:  ${
      import.meta.env.VITE_SSO_WEBSITE_ORIGIN
    }`
  );
  config.ssoWebsiteOrigin = import.meta.env.VITE_SSO_WEBSITE_ORIGIN;
}

if (import.meta.env.VITE_COMMUNICATION_URL) {
  console.log(
    `Using VITE_COMMUNICATION_URL from env:  ${
      import.meta.env.VITE_COMMUNICATION_URL
    }`
  );
  config.communicationUrl = import.meta.env.VITE_COMMUNICATION_URL;
}

if (import.meta.env.VITE_LOG === "true") {
  console.log(`Using VITE_LOG from env:  ${import.meta.env.VITE_LOG}`);
  config.loggerLevel = "debug";
}

// Add title
settings.config = config;
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

export default settings;
