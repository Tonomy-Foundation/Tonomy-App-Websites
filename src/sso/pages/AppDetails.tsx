import { useEffect, useState } from "react";
import { TH3, TH4, TP } from "../components/THeadings";
import TImage from "../components/TImage";
import TProgressCircle from "../components/TProgressCircle";
import { AppData, UserApps, App, Message, api } from "@tonomy/tonomy-id-sdk";
import LogoutIcon from "@mui/icons-material/Logout";
import { TButton } from "../components/Tbutton";
import { useCommunicationStore } from "../stores/communication.store";
import logo from "../assets/tonomy/tonomy-logo1024.png";

const styles = {
  container: {
    display: "flex",
    height: "100%",
    textAlign: "center" as const,
    alignItems: "center",
    flexDirection: "column" as const,
    justifyContent: "center",
  },
  detailContainer: {
    marginTop: "20px",
    padding: "40px 10px",
    border: "2px solid #EFF1F7",
    borderRadius: "20px",
  },
  legend: {
    padding: "0px 10px",
  },
  logout: {
    alignSelf: "flex-end",
  },
};

const AppDetails = () => {
  const [details, setDetails] = useState<AppData>();
  const communication = useCommunicationStore((state) => state.communication);

  useEffect(() => {
    subscribeToMobile();
    getApp();
  }, []);

  async function subscribeToMobile() {
    communication.subscribeMessage((message) => {

      window.location.replace(
        `/callback?requests=${message.getPayload().requests}&accountName=${message.getPayload().accountName}&username=nousername`
      );
    }, MessageType.LOGIN_REQUEST_RESPONSE);
  }

  /**
   * verify the requests and gets the app details to show the ui
   */
  async function getApp() {
    const requests = new URLSearchParams(location.search).get("requests");
    const result = await UserApps.verifyRequests(requests);

    const redirectJwt = result.find(
      (jwtVerified) => jwtVerified.getPayload().origin !== location.origin
    );

    const app = await App.getApp(redirectJwt?.getPayload().origin);

    setDetails(app);
  }

  return (
    <div>
      {details && (
        <div style={styles.container}>
          <TImage width={100} src={logo} alt="Tonomy Logo" />

          {/* <legend style={styles.legend}>
            <CopyAllOutlined fontSize="small" /> Copy Request Link
          </legend> */}
          <div
            style={{
              ...styles.detailContainer,
            }}
          >
            <TImage src={details.logoUrl}></TImage>
            <TH3>{details.appName}</TH3>
            <TH4>wants you to log in to their application</TH4>
            <TP style={{ margin: "10px" }}>
              Please proceed to login to Tonomy ID app on your phone.
            </TP>
          </div>

          <div style={styles.logout}>
            <TButton startIcon={<LogoutIcon></LogoutIcon>} onClick={async () => {await api.ExternalUser.logout()}}>Logout</TButton>
          </div>
        </div>
      )}
      {!details && (
        <>
          <TP>Loading QR code request</TP>
          <TProgressCircle />
        </>
      )}
    </div>
  );
};

export default AppDetails;
