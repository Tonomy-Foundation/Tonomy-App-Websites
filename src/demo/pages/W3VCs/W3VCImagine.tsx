import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { TH2 } from "../../../common/atoms/THeadings";
import settings from "../../../common/settings";

export type W3VCImagineProps = {
  setActiveSection?: (section: string) => void;
  setSuccess?: (success: boolean) => void;
};

const W3VCImagine = (props: W3VCImagineProps) => (
  <>
    <div className="mobile-container mobile-view imagine-mobile">
      <div className="user-section" style={{ width: "30%" }}>
        <ArrowBackIosIcon
          className="user-logo"
          onClick={() => props?.setActiveSection?.("intro")}
        />
      </div>
      <div
        className="mobile-logout-section"
        style={{
          justifyContent: "flex-start",
          width: "70%",
          fontSize: "0.7rem",
        }}
      >
        <TH2>Signing Documents</TH2>
      </div>
    </div>
    <div className="paragraph-section">
      <p className="imagine">Imagine,</p>
      <p className="paragraph-detail">
        {`you go to the doctor's office for a checkup. While waiting, your
          ${settings.config.appName} notifies you that Dr. Smith wants access to your medical
          files. With just one click, you can grant access to the files while
          waiting for the doctor to arrive.`}
      </p>
      {props?.setActiveSection && (
        <button
          className="mobile-demo-link mobile-view"
          style={{ marginTop: "5rem" }}
          onClick={() => {
            props?.setActiveSection?.("signDocument");
            props.setSuccess?.(false);
          }}
        >
          Next
        </button>
      )}
    </div>
  </>
);

export default W3VCImagine;
