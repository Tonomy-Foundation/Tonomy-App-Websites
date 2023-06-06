import React, { useState, useContext, ReactNode } from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Link } from "react-router-dom";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import SwapHorizOutlinedIcon from "@mui/icons-material/SwapHorizOutlined";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import { LogoutContext } from "../routes/context/LogoutProvider";
import logo from "../assets/tonomy-logo48.png";
import "./MainLayout.css";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { logout } = useContext(LogoutContext);
  const [collapsed, setCollapsed] = useState(true);

  const handleMouseEnter = () => {
    setCollapsed(false);
  };

  const handleMouseLeave = () => {
    setCollapsed(true);
  };

  return (
    <div className="wrapper">
      <div className="sidebar" style={{ display: "flex", height: "100%" }}>
        <Sidebar
          defaultCollapsed={collapsed}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <Menu>
            <MenuItem icon={<img src={logo} alt="" />} className="heading">
              <h4 className="whiteColor">Tonomy ID</h4>{" "}
            </MenuItem>

            <MenuItem
              icon={<HomeOutlinedIcon />}
              component={<Link to="/user-home" />}
            >
              Home
            </MenuItem>

            <MenuItem
              icon={<DescriptionOutlinedIcon />}
              component={<Link to="/w3c-vcs" />}
            >
              W3C VCs
            </MenuItem>

            <MenuItem
              icon={<SwapHorizOutlinedIcon />}
              component={<Link to="/blockchain-tx" />}
            >
              Blockchain Tx
            </MenuItem>

            <MenuItem
              icon={<ChatBubbleOutlineOutlinedIcon />}
              component={<Link to="/messages" />}
            >
              Messages
            </MenuItem>

            <MenuItem
              icon={<LogoutIcon />}
              className="logoutMenu"
              onClick={() => logout()}
            >
              Logout
            </MenuItem>
          </Menu>
        </Sidebar>
      </div>
      <div className="main-content" style={{ zIndex: -1 }}>
        {children}
      </div>
    </div>
  );
};

export default MainLayout;
