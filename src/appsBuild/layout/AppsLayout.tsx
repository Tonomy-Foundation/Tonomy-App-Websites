import React, { ReactNode } from "react";
import { AppsProvider } from "../context/AppsContext";
import "./AppsLayout.css";

type AppsLayoutProps = {
  children: ReactNode;
};

const AppsLayout = ({ children }: AppsLayoutProps) => {
  return (
    <AppsProvider>
      <div className="apps-layout">
        <div className="apps-layout-container">{children}</div>
      </div>
    </AppsProvider>
  );
};

export default AppsLayout;
