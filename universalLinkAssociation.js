import * as fs from "fs";
import * as path from "path";

let appId;
let sha256_cert_fingerprints;

const env =
  // eslint-disable-next-line no-undef
  process?.env.VITE_APP_NODE_ENV ||
  import.meta.env?.VITE_APP_NODE_ENV ||
  "development";

console.log("environment variable", env);

if (env === "production") {
  appId = "unitedwallet";
  sha256_cert_fingerprints = [
    "02:AE:D4:C2:77:0E:63:08:9E:C1:B9:AB:BF:52:69:44:FA:F7:C5:B6:C6:33:C3:93:1F:49:DC:E0:24:99:38:35",
  ];
} else if (env === "testnet") {
  appId = "pangeatestnet";
  sha256_cert_fingerprints = [
    "24:8A:15:4B:BC:84:4C:D8:8F:F8:20:86:80:DC:08:65:75:5D:79:3C:20:CB:D9:EA:49:96:A8:D6:EC:C4:10:FD",
  ];
} else if (env === "staging") {
  appId = "tonomyidstaging";
  sha256_cert_fingerprints = [
    "B3:23:E8:23:FC:B7:2A:82:14:3C:43:20:DC:C6:61:CC:3A:FC:9D:1D:15:DE:7D:E7:A0:84:90:BD:D8:5D:4E:0D",
    "05:37:B7:5E:0A:6F:D2:07:89:A2:B1:4D:F1:8B:D2:C7:99:56:DB:71:D0:9B:39:4C:EE:64:95:87:FE:0F:DF:E9",
  ];
} else if (env === "development") {
  appId = "tonomyiddevelopment";
  sha256_cert_fingerprints = [
    "00:E5:7D:E1:DA:75:7C:DD:06:1F:9B:D8:35:02:4B:A9:7E:35:9B:EA:54:4F:52:7E:81:8E:62:B3:3A:5C:99:D7",
  ];
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

//Android App Links
const androidSiteAssociation = {
  relation: ["delegate_permission/common.handle_all_urls"],
  target: {
    namespace: "android_app",
    package_name: "foundation.tonomy.projects." + appId,
    sha256_cert_fingerprints: [sha256_cert_fingerprints],
  },
};

// Define the file path
const androidDirectoryPath = path.join("public", ".well-known");
const androidFilePath = path.join(directoryPath, "assetlinks.json");

// Check if the directory exists
if (!fs.existsSync(androidDirectoryPath)) {
  // If not, create it
  fs.mkdirSync(androidDirectoryPath, { recursive: true });
  console.log(`Directory created: ${androidDirectoryPath}`);
}

// Write to the file
fs.writeFileSync(
  androidFilePath,
  JSON.stringify(androidSiteAssociation, null, 2),
);
console.log(`File written successfully to ${androidFilePath}`);
