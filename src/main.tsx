import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./theme.css";
import { runTests } from "./common/utils/runtime-tests";
import settings from "./common/settings";
import { api } from "@tonomy/tonomy-id-sdk";

api.setSettings({
  ssoWebsiteOrigin: settings.config.ssoWebsiteOrigin,
  blockchainUrl: settings.config.blockchainUrl,
  communicationUrl: settings.config.communicationUrl,
  tonomyIdSchema: settings.config.tonomyIdSchema,
  loggerLevel: settings.config.loggerLevel,
});

/**
 * using dynamic import to have less code depending on the subdomain
 *
 * this solution can also be done using multiple servers in vite to load root based on subdomain
 */

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const subdomain = window.location.host.split(".")[1]
  ? window.location.host.split(".")[0]
  : null;

try {
  if (parseInt(window.location.port) === 3001 || subdomain === "demo") {
    import("./demo/module-index.js").then((module) => {
      const demo = module.default;

      demo(root);
    });
  } else if (
    parseInt(window.location.port) === 3000 ||
    subdomain === "accounts"
  ) {
    import("./sso/module-index.js").then((module) => {
      const sso = module.default;

      sso(root);
    });
  } else {
    throw new Error("Domain not supported");
  }

  if (!settings.isProduction()) runTests();
} catch (e) {
  console.error(e);
}
