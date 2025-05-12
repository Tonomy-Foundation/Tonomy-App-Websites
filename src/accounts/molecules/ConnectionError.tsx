import connectionImage from "../assets/404-error.svg";
import { TH2, TH3, TP } from "../../common/atoms/THeadings";
import TImage from "../../common/atoms/TImage";
import settings from "../../common/settings";
import { Box, Grid } from "@mui/material";
import TSpinner from "../atoms/TSpinner";

export default function ConnectionError({
  username,
  tryAgainLink,
}: {
  username?: string;
  tryAgainLink?: string;
}) {
  return (
    <Box>
      <Grid
        container
        display="flex"
        alignItems="center"
        justifyContent="between"
      >
        <Grid
          item
          display="flex"
          flexDirection="column"
          md={6}
          alignItems="center"
          justifyContent="center"
        >
          <TSpinner />
          <Box textAlign="center">
            {username ? (
              <>
                <TH2 className="margin-none">
                  Can't Connect to the Mobile App
                </TH2>
                <Box>
                  Please open {settings.config.appName} on your phone and log in
                  as{" "}
                  <span style={{ color: "var(--app-accent)" }}>
                    @{username}
                  </span>{" "}
                  to continue
                </Box>
                <a className="primary-button" href={tryAgainLink}>
                  Try Again
                </a>
                <a className="back-to-app" href={tryAgainLink}>
                  Back to Tonomy Launchpad
                </a>
              </>
            ) : (
              <>
                <TH2 className="margin-none">
                  Can't Connect to the Mobile App
                </TH2>
                <TP>Could not connect to the {settings.config.appName}.</TP>
                <a className="primary-button" href={tryAgainLink}>
                  Try Again
                </a>
              </>
            )}
          </Box>
        </Grid>
        <Grid item md={6} display="flex" justifyContent="center">
          <TImage width={300} src={connectionImage} alt="Connecting Phone-PC" />
        </Grid>
      </Grid>
    </Box>
  );
}
