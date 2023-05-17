import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar, Menu, MenuItem, useProSidebar } from "react-pro-sidebar";
import { Link } from "react-router-dom";
import { api, ExternalUser, SdkError, SdkErrors } from "@tonomy/tonomy-id-sdk";
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
  const [user, setUser] = useState<ExternalUser | null>(null);
  const navigation = useNavigate();
  const userStore = useUserStore();

  async function onRender() {
    const user = await api.ExternalUser.getUser();

    userStore.setUser(user);
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
            <Link to="/user-home">
              <MenuItem icon={<HomeOutlinedIcon />}> Home</MenuItem>
            </Link>
            <Link to="/w3c-vcs">
              <MenuItem icon={<DescriptionOutlinedIcon />}> W3C VCs</MenuItem>
            </Link>
            <Link to="/blockchain-tx">
              <MenuItem icon={<SwapHorizOutlinedIcon />}>
                {" "}
                Blockchain Tx
              </MenuItem>
            </Link>
            <Link to="/messages">
              <MenuItem icon={<ChatBubbleOutlineOutlinedIcon />}>
                Messages
              </MenuItem>
            </Link>
            <MenuItem
              icon={<LogoutIcon />}
              className="logoutMenu"
              onClick={props.onLogout}
            >
              Logout{" "}
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
