import SuccessSection from "../../components/SuccessSection";
import { TH1, TH2 } from "../../../common/atoms/THeadings";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

export type W3VCConfirmationProps = {
  setSuccess: (success: boolean) => void;
  setProgressValue: (progressValue: number) => void;
  setActiveStep: (active: number) => void;
  setActiveSection?: (section: string) => void;
};

const W3VCConfirmation = (props: W3VCConfirmationProps) => (
  <>
    <div className="web-view">
      <SuccessSection
        message="you have successfully signed a document using Tonomy ID."
        labels={[
          "Education Diplomas",
          "Shipping and logistic events",
          "Tickets",
          "Certificates",
          "Legal contracts",
          "Travel Documents",
        ]}
        submit={() => {
          props.setProgressValue(0);
          props.setActiveStep(-1);
          props.setSuccess(false);
        }}
      />
    </div>
    <div className="mobile-view">
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

      <div className="mobile-success-section">
        <p>Congratulations,</p>
        <p>you have successfully signed a document using Tonomy ID </p>
        {props?.setActiveSection && (
          <button
            className="mobile-demo-link mobile-view"
            style={{ marginTop: "3rem" }}
            onClick={() => {
              props?.setActiveSection?.("intro");
            }}
          >
            Go back home
          </button>
        )}
      </div>
    </div>
  </>
);

export default W3VCConfirmation;
