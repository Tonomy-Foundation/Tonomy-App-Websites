import { useEffect, useState } from "react";
import { TH3, TH4, TP } from "../components/THeadings";
import TImage from "../components/TImage";
import TProgressCircle from "../components/TProgressCircle";
import {
  AppData,
  UserApps,
  App,
  LoginRequest,
  LoginRequestResponseMessage,
  SdkErrors,
  ExternalUser,
  throwError,
} from "@tonomy/tonomy-id-sdk";
import LogoutIcon from "@mui/icons-material/Logout";
import { TButton } from "../components/Tbutton";
import { useCommunicationStore } from "../stores/communication.store";
import logo from "../assets/tonomy/tonomy-logo1024.png";
import { encodeBase64url } from "@tonomy/did-jwt/lib/util";

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
  const [user, setUser] = useState<ExternalUser>();
  const [username, setUsername] = useState<string>();
  const [details, setDetails] = useState<AppData>();
  const communication = useCommunicationStore((state) => state.communication);

  useEffect(() => {
    subscribeToMobile();
    getApp();
  }, []);

  async function subscribeToMobile() {
    communication.subscribeMessage((message) => {
      const loginRequestResponsePayload = new LoginRequestResponseMessage(
        message
      ).getPayload();

      if (!loginRequestResponsePayload.success) {
        // TODO redirect back to external website and tell them what happened
      }

      const requests = loginRequestResponsePayload.requests;
      const externalLoginRequest = requests?.find((r: LoginRequest) => {
        return r.getPayload().origin !== window.location.origin;
      });

      if (!externalLoginRequest) {
        throwError(
          "Login request for external site was not found",
          SdkErrors.OriginMismatch
        );
      }

      let callbackPath = externalLoginRequest.getPayload().callbackPath;
      const accountName = loginRequestResponsePayload.accountName;

      if (!accountName) throw new Error("Account name not defined");

      const base64UrlPayload = encodeBase64url(
        JSON.stringify(loginRequestResponsePayload)
      );

      callbackPath += "?payload=" + base64UrlPayload;

      window.location.replace(callbackPath);
    }, LoginRequestResponseMessage.getType());
  }

  /**
   * verify the requests and gets the app details to show the ui
   */
  async function getApp() {
    const { requests } = UserApps.getLoginRequestFromUrl();

    await UserApps.verifyRequests(requests);
    const user = await ExternalUser.getUser();

    setUser(user);
    const username = await user.getUsername();

    setUsername(username.username);

    const loginRequest = requests.find(
      (jwtVerified) => jwtVerified.getPayload().origin !== location.origin
    );

    if (!loginRequest) throw new Error("No login request found");

    const app = await App.getApp(loginRequest.getPayload().origin);

    setDetails(app);
  }

  const logout = async () => {
    if (user) await user.logout();

    // TODO also need to add the requests to the payload
    const payload = {
      success: false,
      error: {
        reason: "User logout",
        code: SdkErrors.UserLogout,
      },
    };
    const base64UrlPayload = encodeBase64url(JSON.stringify(payload));

    window.location.replace(`/callback?payload=${base64UrlPayload}`);
  };

  return (
    <div>
      {details && (
        <div style={styles.container}>
          <TImage width={100} src={logo} alt="Tonomy Logo" />
          {user && <TH4>{username}</TH4>}
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
            <TButton
              startIcon={<LogoutIcon></LogoutIcon>}
              onClick={async () => await logout()}
            >
              Logout
            </TButton>
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
