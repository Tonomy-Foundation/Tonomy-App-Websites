import { useState } from "react";
import { TH1, TH2, TH3, TP } from "../components/THeadings";
import TImage from "../components/TImage";
import TProgressCircle from "../components/TProgressCircle";
import { AppData } from "@tonomy/tonomy-id-sdk";
import { Button } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { CopyAllOutlined } from "@mui/icons-material";

const styles = {
  container: {
    flex: 1,
    textAlign: "center" as const,
    alignSelf: "center",
  },
  detailContainer: {
    marginTop: "20px",
    padding: "40px 10px",
  },
  field: {
    color: "white",
    border: "2px solid #EFF1F7",
    borderRadius: "20px",
  },
  legend: {
    padding: "0px 10px",
  },
};

const AppDetails = () => {
  const [details, setDetails] = useState<AppData>();

  return (
    <div style={styles.container}>
      <TImage
        height={60}
        src={"src/sso/assets/tonomy/tonomy-logo1024.png"}
        alt="Tonomy Logo"
      />
      <TH1>{"Tonomy"}</TH1>
      <TH3>{"Jack"}</TH3>
      <fieldset style={styles.field}>
        <legend style={styles.legend}>
          <CopyAllOutlined fontSize="10px" /> Copy Request Link
        </legend>
        <div
          style={{
            ...styles.detailContainer,
          }}
        >
          <TH3>Atomic Hub</TH3>
          <TH3>wants you to log in to their application</TH3>
          <TP style={{ margin: "10px" }}>
            Please proceed to login to Tonomy ID app on your phone.
          </TP>
        </div>
      </fieldset>
      <div style={{ marginTop: "20px" }}>
        <Button variant="outlined" startIcon={<LogoutIcon></LogoutIcon>}>
          Logout
        </Button>
      </div>
    </div>
  );
};

export default AppDetails;
