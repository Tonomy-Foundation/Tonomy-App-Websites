import { defineConfig, UserConfigExport } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/

export default defineConfig(({ command, mode, ssrBuild }) => {
  const config: UserConfigExport = {
    plugins: [react()],
    server: {
      proxy: {
        "/": {
          target: "http://localhost:5173",
          changeOrigin: false,
          configure: (proxy, _options) => {
            proxy.on("error", (err, _req, _res) => {
              console.log("proxy error", err);
            });
            proxy.on("proxyReq", (proxyReq, req, _res) => {
              // Get the subdomain from the request hostname
              const subdomain = req.headers.host?.split(".")[0];
              // proxyReq.setHeader(
              //   "referer",
              //   `http://${subdomain}.localhost:1756`
              // );
              // proxyReq.setHeader(
              //   "origin",
              //   `http://${subdomain}.localhost:1756`
              // );
              proxyReq.path = `/${subdomain}${req.url}`;
            });
          },
          rewrite: (path) => path.replace(/^\/\w+/, ""),
        },
        
      },
    
    },
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
