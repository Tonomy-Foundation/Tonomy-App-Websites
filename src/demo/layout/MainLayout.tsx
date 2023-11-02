import React, { useState, useContext, ReactNode } from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Link } from "react-router-dom";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import SwapHorizOutlinedIcon from "@mui/icons-material/SwapHorizOutlined";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import { AuthContext } from "../providers/AuthProvider";
import logo from "../assets/tonomy-logo48.png";
import "./MainLayout.css";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { signout } = useContext(AuthContext);
  const [collapsed, setCollapsed] = useState(true);

  const handleMouseEnter = () => {
    setCollapsed(false);
  };

  const handleMouseLeave = () => {
    setCollapsed(true);
  };

  return (
    <div className="wrapper">
      <div className="sidebar mobile-display-none" >
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
              active={location.pathname === "/user-home"}
              icon={<HomeOutlinedIcon />}
              component={<Link to="/user-home" />}
            >
              Home
            </MenuItem>

            <MenuItem
              active={location.pathname === "/w3c-vcs"}
              icon={<DescriptionOutlinedIcon />}
              component={<Link to="/w3c-vcs" />}
            >
              W3C VCs
            </MenuItem>

            <MenuItem
              active={location.pathname === "/blockchain-tx"}
              icon={<SwapHorizOutlinedIcon />}
              component={<Link to="/blockchain-tx" />}
            >
              Blockchain Tx
            </MenuItem>

            {/* <MenuItem
              icon={<ChatBubbleOutlineOutlinedIcon />}
              component={<Link to="/messages" />}
            >
              Messages
            </MenuItem> */}

            <MenuItem
              icon={<LogoutIcon />}
              className="logoutMenu"
              onClick={() => signout()}
            >
              Logout
            </MenuItem>
          </Menu>
        </Sidebar>
      </div>
      <nav className="bottom-nav mobile-display">
        <ul>
          <li className={location.pathname === "/user-home"?"active-item": ""}>
            <Link to="/user-home"><HomeOutlinedIcon sx={{ fontSize: 26 }} />     
              <span className="mobile-text">Home</span>
            </Link>
          </li>
          <li className={location.pathname === "/w3c-vcs"?"active-item": ""}>
            <Link to="/w3c-vcs"><DescriptionOutlinedIcon sx={{ fontSize: 26 }} />     
              <span className="mobile-text">W3C VCs</span>
            </Link>
          </li>
          <li className={location.pathname === "/blockchain-tx"?"active-item": ""}>
            <Link to="/blockchain-tx"><SwapHorizOutlinedIcon sx={{ fontSize: 26 }} />     
              <span className="mobile-text">Blockchain Tx</span>
            </Link>
          </li>
        </ul>
      </nav>

      <div className="main-content" style={{ zIndex: !collapsed ? -1 : 0 }}>
          {children}
      </div>
    </div>
  );
};

export default MainLayout;
