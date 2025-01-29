import * as fs from "fs";
import * as path from "path";

let appId;

try {
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
  } else {
    appId = "tonomyiddevelopment";
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
        components: [
          {
            "/": "/help",

            "?": {
              screen: "SSO",
              payload: "*",
            },
            comment: "Matches /help/ with screen=SSO and any payload",
          },
        ],

        // components: [
        //   // {
        //   //   "#": "no_universal_links",
        //   //   exclude: true,
        //   //   comment:
        //   //     "Matches any URL whose fragment equals no_universal_links and instructs the system not to open it as a universal link",
        //   // },
        //   // {
        //   //   "/": "/login/*",
        //   //   "?": { payload: "*", screen: "SSO" },
        //   //   comment:
        //   //     "Matches any URL with a path that starts with /login/ and that has a query item with name 'payload' and a value of any.",
        //   // },
        //   // {
        //   //   "/": "/login",
        //   //   "?": { payload: "*", screen: "SSO" },
        //   //   comment:
        //   //     "Matches any URL with a path that starts with /login/ and that has a query item with name 'payload' and a value of any.",
        //   // },
        //   // {
        //   //   "/": "/login/*",
        //   //   query: {
        //   //     payload: "*",
        //   //     screen: "SSO",
        //   //   },
        //   //   comment:
        //   //     "Matches any URL with a path that starts with /login/ and has 'payload' and 'ismobile' as query parameters",
        //   // },
        //   {
        //     "/": "/help/*",
        //     "?": {
        //       screen: "???",
        //       payload: "*",
        //     },
        //     comment:
        //       "Matches any URL whose path starts with /help/ and which has a query item with name 'screenName' and a value of exactly 4 characters",
        //   },
        // ],
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
