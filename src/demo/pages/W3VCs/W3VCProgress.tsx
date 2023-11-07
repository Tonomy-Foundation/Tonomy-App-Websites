import VerticalLinearStepper from "../../components/VerticalProgressStep";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { TH2 } from "../../../common/atoms/THeadings";

const steps = [
  {
    label: "Fetching sovereign signer and checking if the key is still valid",
  },
  {
    label: "Checking W3C Verifiable Credential data structure",
  },
  {
    label: "Signing data",
  },
];

export type W3VCProgressProps = {
  activeStep: number;
  progressValue: number;
  setSuccess: (success: boolean) => void;
  setActiveSection?: (section: string) => void;
};

const W3VCProgress = (props: W3VCProgressProps) => (
  <>
    <div className="mobile-container  imagine-mobile">
      <div className="user-section" style={{ width: "30%" }}>
        <ArrowBackIosIcon
          className="user-logo"
          onClick={() => props?.setActiveSection?.("progress")}
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
    <div
      className="mobile-view display-mobile-w3vc"
      style={{ marginTop: "1rem" }}
    >
      <p>Sign and verify sensitive information with Tonomy ID </p>

      <p className="blue-text">
        The W3C Verifiable Credential standard help ensure trust and security
        when sharing sensitive and tamper-proof data
      </p>
    </div>
    <div style={{ marginTop: "0rem" }} className="mobile-progress-container">
      <VerticalLinearStepper
        activeStep={props.activeStep}
        steps={steps}
        progressValue={props.progressValue}
        onContinue={() => {
          props.setSuccess(true);

          if (props?.setActiveSection) {
            props?.setActiveSection?.("confirmation");
          }
        }}
      />
    </div>
  </>
);

export default W3VCProgress;
