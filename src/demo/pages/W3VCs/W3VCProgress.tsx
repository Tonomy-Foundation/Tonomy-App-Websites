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
    <div className="mobile-container mobile-view imagine-mobile">
      <div className="user-section" style={{ width: "40%" }}>
        <ArrowBackIosIcon
          className="user-logo"
          onClick={() => props?.setActiveSection?.("signDocument")}
        />
      </div>
      <div
        className="mobile-logout-section"
        style={{ justifyContent: "flex-start", fontSize: "0.7rem" }}
      >
        <TH2>Signing Documents</TH2>
      </div>
    </div>
    <div style={{ marginTop: "1.5rem" }} className="mobile-progress-container">
      <VerticalLinearStepper
        activeStep={props.activeStep}
        steps={steps}
        progressValue={props.progressValue}
        onContinue={() => props.setSuccess(true)}
      />
      {props?.setActiveSection && (
        <button
          className="mobile-demo-link mobile-view"
          style={{ marginTop: "3rem" }}
          onClick={() => {
            props?.setActiveSection?.("confirmation");
          }}
        >
          Send Payment
        </button>
      )}
    </div>
  </>
);

export default W3VCProgress;
