import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { TH2 } from "../../../common/atoms/THeadings";

export type SignTransactionImagineProps = {
  setActiveSection?: (section: string) => void;
  setSuccess?: (success: boolean) => void;
};

const SignTransactionImagine = (props: SignTransactionImagineProps) => (
  <>
    <div className="mobile-container mobile-view imagine-mobile">
      <div className="user-section" style={{ width: "40%" }}>
        <ArrowBackIosIcon
          className="user-logo"
          onClick={() => props?.setActiveSection?.("intro")}
        />
      </div>
      <div
        className="mobile-logout-section"
        style={{ justifyContent: "flex-start" }}
      >
        <TH2>Payment</TH2>
      </div>
    </div>
    <div className="paraSection">
      <p className="imagine">Imagine,</p>
      <p className="paralines">
        you find a perfect art piece. With a simple click, your account promptly
        sends a secure transaction to the bank, where it is verified and
        recorded in your transaction history
      </p>
      {props?.setActiveSection && (
        <button
          className="mobile-demo-link mobile-view"
          style={{ marginTop: "5rem" }}
          onClick={() => {
            props?.setActiveSection?.("sendPayment");
            props?.setSuccess?.(false);
          }}
        >
          Next
        </button>
      )}
    </div>
  </>
);

export default SignTransactionImagine;
