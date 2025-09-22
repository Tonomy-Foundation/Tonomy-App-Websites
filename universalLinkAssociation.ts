import fs from "fs";
import path from "path";
import settings from "./src/common/settings";

const appId = settings.config.appId;
const sha256_cert_fingerprints = settings.config.sha256CertFingerprints;
// IOS universal link setup
const appleAppSiteAssociation: {
  applinks: {
    details: { appIDs: string[]; paths: string[] }[];
  };
  appclips: { apps: string[] };
  webcredentials: { apps: string[] };
} = {
  applinks: {
    details: [
      {
        appIDs: [],
        paths: ["/login/*"],
      },
    ],
  },
  appclips: {
    apps: [],
  },
  webcredentials: {
    apps: [],
  },
};

const tonomyAppId: string = `6BLD42QR78.foundation.tonomy.projects.${appId}`;

appleAppSiteAssociation.applinks.details[0].appIDs.push(tonomyAppId);
appleAppSiteAssociation.appclips.apps.push(tonomyAppId);
appleAppSiteAssociation.webcredentials.apps.push(tonomyAppId);

const directoryPath = path.join("public", ".well-known");
const filePath = path.join(directoryPath, "apple-app-site-association");

if (!fs.existsSync(directoryPath)) {
  fs.mkdirSync(directoryPath, { recursive: true });
  console.log(`Directory created: ${directoryPath}`);
}

fs.writeFileSync(filePath, JSON.stringify(appleAppSiteAssociation, null, 2));
console.log(`File written successfully to ${filePath}`);

//Android Universal Link Setup
const androidSiteAssociation = [
  {
    relation: ["delegate_permission/common.handle_all_urls"],
    target: {
      namespace: "android_app",
      package_name: `foundation.tonomy.projects.${appId}`,
      sha256_cert_fingerprints: [sha256_cert_fingerprints],
    },
  },
];

const androidDirectoryPath = path.join("public", ".well-known");
const androidFilePath = path.join(directoryPath, "assetlinks.json");

if (!fs.existsSync(androidDirectoryPath)) {
  fs.mkdirSync(androidDirectoryPath, { recursive: true });
  console.log(`Directory created: ${androidDirectoryPath}`);
}

fs.writeFileSync(
  androidFilePath,
  JSON.stringify(androidSiteAssociation, null, 2),
);
console.log(`File written successfully to  ${androidFilePath}`);
