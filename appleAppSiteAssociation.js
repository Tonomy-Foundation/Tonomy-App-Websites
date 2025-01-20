import * as fs from "fs";

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

console.log("appID", tonomyAppId);

// Update appIDs dynamically
appleAppSiteAssociation.applinks.details[0].appIDs.push(tonomyAppId);
console.log("Updated appleAppSiteAssociation", appleAppSiteAssociation);

// Write to a JSON file
fs.writeFileSync(
  "public/.well-known/apple-app-site-association",
  JSON.stringify(appleAppSiteAssociation, null, 2),
);
