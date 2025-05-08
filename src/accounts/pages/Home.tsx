import React, { useEffect, useState } from "react";
import settings from "../../common/settings";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import Share from "../assets/share.svg";
import TImage from "../../common/atoms/TImage";
import HyphaDAO from "../assets/hypha-dao.svg";
import FiddleArt from "../assets/fiddle-art.svg";
import { useUserStore } from "../../common/stores/user.store";
import {
  ExternalUser,
  getLoginRequestFromUrl,
  RequestsManager,
  ResponsesManager,
  SdkErrors,
  terminateLoginRequest,
} from "@tonomy/tonomy-id-sdk";
import useErrorStore from "../../common/stores/errorStore";
import LogoutIcon from "@mui/icons-material/Logout";

import "./Home.css";
import UserAvatar from "../assets/avatar.svg";

import Debug from "debug";

export default function Home() {
  const [username, setUsername] = useState<string>();
  const { user, setUser, isLoggedIn, logout } = useUserStore();
  const errorStore = useErrorStore();

  useEffect(() => {
    async function authentication() {
      try {
        const user = await ExternalUser.getUser({ autoLogout: false });
        setUser(user);
        const username = await user.getUsername();
        if (!username) throw new Error("No username found");
        setUsername(username.getBaseUsername());
      } catch (e) {
        console.log("e", e);
      }
    }
    authentication();
  }, []);

  async function terminateLogin(error): Promise<string> {
    const { requests } = await getLoginRequestFromUrl();
    const managedRequests = new RequestsManager(requests);

    const externalLoginRequest =
      managedRequests.getLoginRequestWithDifferentOriginOrThrow();

    const managedResponses = new ResponsesManager(managedRequests);

    return (await terminateLoginRequest(managedResponses, "mobile", error, {
      callbackOrigin: externalLoginRequest.getPayload().origin,
      callbackPath: externalLoginRequest.getPayload().callbackPath,
    })) as string;
  }

  const onLogout = async () => {
    try {
      const callbackUrl = await terminateLogin({
        code: SdkErrors.UserLogout,
        reason: "User logged out",
      });

      if (isLoggedIn()) await logout();

      window.location.href = callbackUrl;
    } catch (e) {
      errorStore.setError({ error: e, expected: false });
    }
  };

  const services = [
    {
      name: "Hypha DAO",
      url: "hypha.earth",
      description:
        "A decentralized platform empowering communities to collaborate, govern, and grow together seamlessly",
      logo: HyphaDAO,
      icon: Share,
    },
    {
      name: "Fiddle Art",
      url: "tonomy.io",
      description:
        "A vibrant creative platform where artists showcase their work, connect with others, and collaborate globally",
      logo: FiddleArt,
      icon: Share,
    },
    {
      name: "Demo website",
      url: "demo.testnet.tonomy.io",
      description:
        "Search, view, and track your Tonomy Blockchain transactions and activities in real-time",
      logo: FiddleArt,
      icon: Share,
    },
    {
      name: "Tonomy Block Explorer",
      url: "explorer.testnet.tonomy.io",
      description:
        "A tool to explore, track, and verify transactions across the Tonomy blockchain network",
      logo: FiddleArt,
      icon: Share,
    },
  ];
  const MoreServices = [
    {
      name: "Tonomy Bankless",
      url: "tonomy.io",
      description:
        "Manage your TONO tokens as easily as any neo-banking application. Full control without compromise",
      logo: FiddleArt,
      icon: Share,
    },
    {
      name: "Tonomy DAO",
      url: "tonomy.io",
      description:
        "Incorporate businesses and manage employee access and controls. Fully decentralised",
      logo: FiddleArt,
      icon: Share,
    },
    {
      name: "Tonomy Gov+",
      url: "tonomy.io",
      description:
        "Participate actively in the liquid democracy governance and help shape the future of the Tonomy ecosystem",
      logo: FiddleArt,
      icon: Share,
    },
    {
      name: "Tonomy Build",
      url: "tonomy.io",
      description:
        "Build anything with our Low-Code/No-Code suite, empowering next-generation secure and seamless app development",
      logo: FiddleArt,
      icon: Share,
    },
  ];

  if (!user) {
    return <h1> {settings.config.appName} website</h1>;
  }

  return (
    <Grid gap="20px" flexDirection="column" display="flex" alignItems="center">
      {user && (
        <Box width="100%">
          <Box
            display="flex"
            alignItems="center"
            justifyContent="flex-end"
            width="100%"
            gap="25px"
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: 20,
              }}
            >
              <TImage
                height={20}
                src={settings.config.images.logo48}
                alt={`${settings.config.appName} Logo`}
              />
              @{username}
            </div>
            <Button
              onClick={onLogout}
              variant="text"
              startIcon={<LogoutIcon />}
              className="secondaryButton"
            >
              Logout
            </Button>
          </Box>
          <Box
            justifyContent="center"
            alignItems="center"
            display="flex"
            flexDirection="column"
          >
            <div className="user-profile-photo">
              <TImage
                height={50}
                src={UserAvatar}
                alt={`${settings.config.appName} Logo`}
              />
            </div>
            <h3 className="welcome-title">
              👋 Welcome, <span>{username}</span>
            </h3>
            <p>
              This page is part of a secure login process and doesn't require
              you to do anything right now
            </p>
          </Box>
        </Box>
      )}

      <Grid item xs={12}>
        <Box textAlign="center" fontSize={20} fontWeight={400}>
          But since you're here, why not check which services you can access
          with your Tonomy ID?
        </Box>
      </Grid>
      <Grid display="flex" flexDirection={"row"} gap="20px">
        {services.map((service, index) => (
          <Grid item xs={12} md={3} key={index}>
            <Card sx={{ display: "flex", flexDirection: "column" }}>
              <CardContent>
                <Box
                  component="a"
                  href={`https://${service.url}`}
                  display="flex"
                  justifyContent="end"
                  gap={1}
                  target="_blank"
                  className="share-link"
                >
                  <Typography fontSize={10} color="var(--app-accent)">
                    {service.url}{" "}
                  </Typography>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5 2H3C2.73478 2 2.48043 2.10536 2.29289 2.29289C2.10536 2.48043 2 2.73478 2 3V9C2 9.26522 2.10536 9.51957 2.29289 9.70711C2.48043 9.89464 2.73478 10 3 10H9C9.26522 10 9.51957 9.89464 9.70711 9.70711C9.89464 9.51957 10 9.26522 10 9V7M6 6L10 2M10 2V4.5M10 2H7.5"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Box>
                <TImage src={service.logo} alt={service.name} />
                <Typography fontSize={16} fontWeight={500}>
                  {service.name}
                </Typography>
                <Typography fontSize={14} color="var(--gray-600)">
                  {service.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Grid item xs={12}>
        <Box textAlign="center" fontSize={20} fontWeight={400}>
          More apps available soon
        </Box>
      </Grid>
      <Grid display="flex" flexDirection={"row"} gap="20px">
        {MoreServices.map((service, index) => (
          <Grid item xs={12} md={3} key={index}>
            <Card sx={{ display: "flex", flexDirection: "column" }}>
              <CardContent>
                <Box
                  component="a"
                  href={`https://${service.url}`}
                  display="flex"
                  justifyContent="end"
                  gap={1}
                  target="_blank"
                  className="share-link"
                >
                  <Typography fontSize={10} color="var(--app-accent)">
                    {service.url}{" "}
                  </Typography>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5 2H3C2.73478 2 2.48043 2.10536 2.29289 2.29289C2.10536 2.48043 2 2.73478 2 3V9C2 9.26522 2.10536 9.51957 2.29289 9.70711C2.48043 9.89464 2.73478 10 3 10H9C9.26522 10 9.51957 9.89464 9.70711 9.70711C9.89464 9.51957 10 9.26522 10 9V7M6 6L10 2M10 2V4.5M10 2H7.5"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Box>
                <TImage src={service.logo} alt={service.name} />
                <Typography fontSize={16} fontWeight={500}>
                  {service.name}
                </Typography>
                <Typography fontSize={14} color="var(--gray-600)">
                  {service.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
}
