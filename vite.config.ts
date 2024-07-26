import { defineConfig, UserConfigExport } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/

export default defineConfig((env) => {
  const config: UserConfigExport = {
    plugins: [react()],
    server: {
      port: 5174,
      strictPort: true,
    },
    resolve: {
      alias: {},
    },
  };

  if (process.env.VITE_APP_NODE_ENV === "local") {
    console.log("Running in local mode and linking to local ../Tonomy-ID-SDK");
    config.resolve.alias["@tonomy/tonomy-id-sdk"] =
      __dirname + "/../Tonomy-ID-SDK";
  }

  // fix for https://github.com/decentralized-identity/ethr-did-resolver/issues/186
  if (env.mode === "development") {
    config.resolve.alias["ethr-did-resolver"] = path.resolve(
      "./node_modules/ethr-did-resolver/src/index.ts",
    ),
  }
}

  return config;
});
