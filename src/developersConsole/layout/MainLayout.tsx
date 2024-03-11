import React, { ReactNode } from "react";
import TopMenuBar from "./TopMenuBar";
import "./TopMenuBar.css";

const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="main-layout">
      <TopMenuBar />
      {children}
    </div>
  );
};

export default MainLayout;
