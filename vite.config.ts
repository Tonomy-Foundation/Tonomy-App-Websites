import { defineConfig, UserConfigExport } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/

export default defineConfig(({ command, mode, ssrBuild }) => {
  const config: UserConfigExport = {
    plugins: [react()],
    server: {
      port: 5174,
      strictPort: true
    }
  };

  if (process.env.VITE_APP_NODE_ENV == "local") {
    config.resolve = {
      alias: {
        "tonomy-id-sdk": __dirname + "/../Tonomy-ID-SDK",
      },
    };
  }

  return config;
});
