import connectionImage from "../assets/connecting.svg";
import { TP } from "../../common/atoms/THeadings";
import TImage from "../../common/atoms/TImage";
import TSpinner from "../atoms/TSpinner";
import { Box, Grid } from "@mui/material";

export default function LinkingPhone() {
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
          <Box textAlign="center" fontSize={20}>
            Linking to phone and sending data. Please remain connected
          </Box>
        </Grid>
        <Grid item md={6} display="flex" justifyContent="center">
          <TImage width={300} src={connectionImage} alt="Connecting Phone-PC" />
        </Grid>
      </Grid>
    </Box>
  );
}
