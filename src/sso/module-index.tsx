import React from "react";
import ReactDOM from "react-dom/client";
import { Container } from "@mui/material";
import { RouterProvider } from "react-router-dom";
import reportWebVitals from "./reportWebVitals";
import router from "./routes/root";
import ErrorHandlerProvider from "../common/providers/ErrorHandler";
import { api } from "@tonomy/tonomy-id-sdk";
import settings from "../common/settings";

api.setSettings({
  ssoWebsiteOrigin: settings.config.ssoWebsiteOrigin,
  blockchainUrl: settings.config.blockchainUrl,
  communicationUrl: settings.config.communicationUrl,
  loggerLevel: import.meta.env.VITE_LOG === "true" ? "debug" : "error",
});

const styles = {
  container: {
    display: "flex",
    height: "100vh",
    justifyContent: "center",
  },
};

export default function initiate(root: ReactDOM.Root) {
  root.render(
    // this will make components render twice in development to catch errors
    <React.StrictMode>
      <Container maxWidth="sm" style={styles.container}>
        <ErrorHandlerProvider />
        <RouterProvider router={router}></RouterProvider>
      </Container>
    </React.StrictMode>
  );

  // If you want to start measuring performance in your app, pass a function
  // to log results (for example: reportWebVitals(console.log))
  // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
  reportWebVitals();
}
