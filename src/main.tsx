import ReactDOM from "react-dom/client";
import "./index.css";
import { runTests } from "./common/utils/runtime-tests";
import settings from "./common/settings";
import { setSettings, setFetch } from "@tonomy/tonomy-id-sdk";
import Debug from "debug";

Debug.enable(import.meta.env.VITE_DEBUG);

setSettings({
  ...settings.config,
});
setFetch(window.fetch.bind(window));

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
    import("./accounts/module-index.js").then((module) => {
      const accounts = module.default;

      accounts(root);
    });
  } else if (
    parseInt(window.location.port) === 3002 ||
    subdomain === "console"
  ) {
    import("./developersConsole/module-index.js").then((module) => {
      const developersConsole = module.default;

      developersConsole(root);
    });
  } else {
    throw new Error("Domain not supported");
  }

  if (!settings.isProduction()) runTests();
} catch (e) {
  console.error(e);
}
