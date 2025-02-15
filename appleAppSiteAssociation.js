import * as fs from "fs";
import * as path from "path";

let appId;

const env =
  // eslint-disable-next-line no-undef
  process?.env.VITE_APP_NODE_ENV ||
  import.meta.env?.VITE_APP_NODE_ENV ||
  "development";

console.log("environment variable", env);

if (env === "production") {
  appId = "unitedwallet";
} else if (env === "testnet") {
  appId = "pangeatestnet";
} else if (env === "staging") {
  appId = "tonomyidstaging";
} else if (env === "development") {
  appId = "tonomyiddevelopment";
} else {
  throw new Error("Unsupported environment");
}

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
  // This section enables Apple Handoff
  appclips: {
    apps: [],
  },
  // This section enable Shared Web Credentials
  webcredentials: {
    apps: [],
  },
};

// Dynamically set appID

const tonomyAppId = "6BLD42QR78.foundation.tonomy.projects." + appId;

// Update appIDs dynamically
appleAppSiteAssociation.applinks.details[0].appIDs.push(tonomyAppId);
appleAppSiteAssociation.appclips.apps.push(tonomyAppId);
appleAppSiteAssociation.webcredentials.apps.push(tonomyAppId);

console.log("Updated appleAppSiteAssociation", tonomyAppId);

// Define the file path
const directoryPath = path.join("public", ".well-known");
const filePath = path.join(directoryPath, "apple-app-site-association");

// Check if the directory exists
if (!fs.existsSync(directoryPath)) {
  // If not, create it
  fs.mkdirSync(directoryPath, { recursive: true });
  console.log(`Directory created: ${directoryPath}`);
}

// Write to the file
fs.writeFileSync(filePath, JSON.stringify(appleAppSiteAssociation, null, 2));
console.log(`File written successfully to ${filePath}`);
