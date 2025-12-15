import React, { ReactNode } from "react";
import { AppsProvider } from "../context/AppsContext";

const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <AppsProvider>
      <div className="main-layout">{children}</div>
    </AppsProvider>
  );
};

export default MainLayout;
