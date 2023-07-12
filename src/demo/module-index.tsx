import React from "react";
import ReactDOM from "react-dom/client";
import Router from "./routes/root";
import { ProSidebarProvider } from "react-pro-sidebar";
import settings from "../common/settings";
import { api } from "@tonomy/tonomy-id-sdk";
import ErrorHandlerProvider from "../common/providers/ErrorHandler";
import BlockchainTx from "./pages/BlockchainTx";

api.setSettings({
  ssoWebsiteOrigin: settings.config.ssoWebsiteOrigin,
  blockchainUrl: settings.config.blockchainUrl,
  communicationUrl: settings.config.communicationUrl,
  loggerLevel: import.meta.env.LOG === "true" ? "debug" : "error",
});

export default function initiate(root: ReactDOM.Root) {
  return root.render(
    <React.StrictMode>
      <ErrorHandlerProvider />

      <ProSidebarProvider>
        {/* <Router /> */}
        <BlockchainTx />
      </ProSidebarProvider>
    </React.StrictMode>
  );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
