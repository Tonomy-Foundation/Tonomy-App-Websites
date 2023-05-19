import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
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
        window.location.href = "/";
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
      window.location.href = "/";
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
              onClick={onLogout}
            >
              Logout
            </MenuItem>
          </Menu>
        </Sidebar>
      </div>
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
};

MainLayout.propTypes = {
  content: PropTypes.any,
};

export default MainLayout;
