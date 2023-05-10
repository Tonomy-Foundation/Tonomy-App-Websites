import React from "react";
import MainLayout from "../layout/main";

// interface ProSidebarContextType {
//   collapse: () => void;
//   isCollapses: boolean;
// }

export default function Home({ children }) {
  //   const { collapsed, setCollapsed } = useProSidebar;

  //   const handleCollapse = () => {
  //     // proSidebarContextt.collapse();
  //     setCollapsed(!collapsed)
  //   };

  return (
    <>
      <MainLayout content={<h1>test heading</h1>}></MainLayout>
    </>
  );
}
