import ReactDOM from "react-dom/client";
import defaultConfig from "./config/config.json";
import stagingConfig from "./config/config.staging.json";
import testnetConfig from "./config/config.testnet.json";
import productionConfig from "./config/config.production.json";
import Debug from "debug";
import * as fs from "fs";
import * as path from "path";

const debug = Debug("tonomy-app-websites:common:settings");

const environmentVariables = import.meta.env;
// cannot use NODE_ENV as it is always "production" on `npm run build`
const env = environmentVariables.VITE_APP_NODE_ENV || "development";

debug(environmentVariables);
debug(`VITE_APP_NODE_ENV=${env}`);

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
  currencySymbol: string;
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

const appleAppSiteAssociation: {
  applinks: {
    details: {
      appIDs: string[];
      paths: string[];
    }[];
  };
} = {
  applinks: {
    details: [
      {
        appIDs: [],
        paths: ["/login/*"],
      },
    ],
  },
};

// Dynamically set appID
const slug = settings.config.tonomyIdSchema.replace("://", "");

const tonomyAppId = "6BLD42QR78.foundation.tonomy.projects." + slug;

// Update appIDs dynamically
appleAppSiteAssociation.applinks.details[0].appIDs.push(tonomyAppId);
console.log("Updated appleAppSiteAssociation", tonomyAppId);

// Define the file path
const directoryPath = path.join("public", ".well-known");
const filePath = path.join(directoryPath, "apple-app-site-association");

try {
  // Check if the directory exists
  if (!fs.existsSync(directoryPath)) {
    // If not, create it
    fs.mkdirSync(directoryPath, { recursive: true });
    console.log(`Directory created: ${directoryPath}`);
  }

  // Write to the file
  fs.writeFileSync(filePath, JSON.stringify(appleAppSiteAssociation, null, 2));
  console.log(`File written successfully to ${filePath}`);
} catch (error) {
  console.error("Error handling file or directory:", error);
}

export default settings;
