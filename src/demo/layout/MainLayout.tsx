import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar, Menu, MenuItem, useProSidebar } from "react-pro-sidebar";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import SwapHorizOutlinedIcon from "@mui/icons-material/SwapHorizOutlined";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import logo from "../assets/tonomy-logo48.png";
import { useUserStore } from "../../common/stores/user.store";
import "./MainLayout.css";

export type MainLayoutProps = {
  onLogout: () => void;
};

const MainLayout = (props: MainLayoutProps) => {
  const { collapseSidebar } = useProSidebar();
  const [collapse, setCollapse] = useState(false);
  const navigation = useNavigate();
  const userStore = useUserStore();

  async function onRender() {
    const user = userStore.user;

    if (!user) {
      // props.onLogout();
      navigation("/");
    }
  }

  useEffect(() => {
    onRender();
    collapseSidebar();
  }, []);

  return (
    <div className="wrapper">
      <div className="sidebar" style={{ display: "flex", height: "100%" }}>
        <Sidebar>
          <Menu>
            <MenuItem
              icon={<img src={logo} alt="" />}
              onClick={() => {
                setCollapse(!collapse);
                collapseSidebar();
              }}
              className="heading"
            >
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
              onClick={props.onLogout}
            >
              Logout
            </MenuItem>
          </Menu>
        </Sidebar>
      </div>
      <div className="main-content" style={{ zIndex: collapse ? -1 : 0 }}>
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
