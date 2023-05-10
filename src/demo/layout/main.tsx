import React, { useEffect } from "react";
import { Sidebar, Menu, MenuItem, useProSidebar } from "react-pro-sidebar";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import SwapHorizOutlinedIcon from "@mui/icons-material/SwapHorizOutlined";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import logo from "../assets/tonomy/tonomy-logo48.png";
import "./main.css";

const MainLayout = ({ content }) => {
  const { collapseSidebar } = useProSidebar();

  useEffect(() => {
    collapseSidebar();
  }, []);

  return (
    <div className="wrapper">
      <div className="sidebar" style={{ display: "flex", height: "100%" }}>
        <Sidebar>
          <Menu>
            <MenuItem
              icon={<img src={logo} alt="" />}
              onClick={() => collapseSidebar()}
              className="heading"
            >
              <h4 className="whiteColor">Tonomy ID</h4>{" "}
            </MenuItem>
            <MenuItem icon={<HomeOutlinedIcon />}> Home </MenuItem>
            <MenuItem icon={<DescriptionOutlinedIcon />}> W3C VCs </MenuItem>
            <MenuItem icon={<SwapHorizOutlinedIcon />}>
              {" "}
              Blockchain Tx{" "}
            </MenuItem>
            <MenuItem icon={<ChatBubbleOutlineOutlinedIcon />}>
              Messages{" "}
            </MenuItem>
            <MenuItem icon={<LogoutIcon />} className="logoutMenu">
              Logout{" "}
            </MenuItem>
          </Menu>
        </Sidebar>
      </div>
      <div className="main-content">{content}</div>
    </div>
  );
};

export default MainLayout;
