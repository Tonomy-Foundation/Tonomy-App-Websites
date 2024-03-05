import React from "react";
import ReactDOM from "react-dom/client";
import { Container } from "@mui/material";
import { RouterProvider } from "react-router-dom";
import reportWebVitals from "../common/reportWebVitals";
import Router from "./routes/routes";
import ErrorHandlerProvider from "../common/providers/ErrorHandler";

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
        <Router />
      </Container>
    </React.StrictMode>
  );

  // If you want to start measuring performance in your app, pass a function
  // to log results (for example: reportWebVitals(console.log))
  // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
  reportWebVitals();
}
