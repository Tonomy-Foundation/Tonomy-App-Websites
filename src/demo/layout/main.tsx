import React, { useEffect, useState } from "react";
import { Sidebar, Menu, MenuItem, useProSidebar } from "react-pro-sidebar";
import { Link } from "react-router-dom";
import { api, ExternalUser, SdkError, SdkErrors } from "@tonomy/tonomy-id-sdk";
import { useNavigate } from "react-router-dom";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import SwapHorizOutlinedIcon from "@mui/icons-material/SwapHorizOutlined";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import logo from "../assets/tonomy/tonomy-logo48.png";
import "./main.css";

const MainLayout = ({ content }) => {
  const { collapseSidebar } = useProSidebar();
  const [user, setUser] = useState<ExternalUser | null>(null);
  const navigation = useNavigate();

  async function onRender() {
    try {
      const user = await api.ExternalUser.getUser();

      setUser(user);
    } catch (e) {
      if (
        e instanceof SdkError &&
        (e.code === SdkErrors.AccountNotFound ||
          e.code === SdkErrors.AccountDoesntExist ||
          e.code === SdkErrors.UserNotLoggedIn)
      ) {
        // User not logged in
        navigation("/");
        return;
      }

      console.error(e);
      alert(e);
    }
  }

  useEffect(() => {
    onRender();
    collapseSidebar();
  }, []);

  async function onLogout() {
    try {
      await user?.logout();
      navigation("/");
    } catch (e) {
      console.error(e);
      alert(e);
    }
  }

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
              onClick={onLogout}
            >
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
