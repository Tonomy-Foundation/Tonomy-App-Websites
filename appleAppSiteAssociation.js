import * as fs from "fs";
import * as path from "path";

let appId;

try {
  const env =
    // eslint-disable-next-line no-undef
    process?.env.VITE_APP_NODE_ENV ||
    import.meta.env.VITE_APP_NODE_ENV ||
    "development";

  console.log("environment variable", env);

  if (env === "production") {
    appId = "united-wallet";
  } else if (env === "testnet") {
    appId = "pangea-testnet";
  } else if (env === "staging") {
    appId = "tonomy-id-staging";
  } else {
    appId = "tonomy-id-development";
  }
} catch (error) {
  console.error("Failed to get branch:", error.message);
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
};

// Dynamically set appID

const tonomyAppId = "6BLD42QR78.foundation.tonomy.projects." + appId;

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
