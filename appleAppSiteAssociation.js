import * as fs from "fs";
import * as path from "path";

const environmentVariables = import.meta.env;
// cannot use NODE_ENV as it is always "production" on `npm run build`
const env = environmentVariables.VITE_APP_NODE_ENV || "development";

// Define the object
const appleAppSiteAssociation = {
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
let appId;

switch (env) {
  case "test":
  case "local":
  case "development":
    appId = "tonomy-id-development";
    break;
  case "staging":
    appId = "tonomy-id-staging";
    break;
  case "testnet":
    appId = "pangea-testnet";
    break;
  case "production":
    appId = "united-wallet";
    break;
  default:
    throw new Error("Unknown environment: " + env);
}

const tonomyAppId = "6BLD42QR78.foundation.tonomy.projects." + appId;

// Update appIDs dynamically
appleAppSiteAssociation.applinks.details[0].appIDs.push(tonomyAppId);
console.log("Updated appleAppSiteAssociation", appleAppSiteAssociation);

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
