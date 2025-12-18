import React, { ReactNode } from "react";
import AppsManagerHeader from "../components/AppsManagerHeader";
import { AppsProvider } from "../context/AppsContext";
import "./AppsLayout.css";

const AppsLayout = ({ children }: { children: ReactNode }) => {
  return (
    <AppsProvider>
      <div className="apps-layout">
        <AppsManagerHeader />
        <div className="apps-layout-container">{children}</div>
      </div>
    </AppsProvider>
  );
};

export default AppsLayout;
