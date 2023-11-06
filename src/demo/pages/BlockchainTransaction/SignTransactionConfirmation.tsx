import SuccessSection from "../../components/SuccessSection";
import { TH1, TH2 } from "../../../common/atoms/THeadings";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

export type SignTransactionConfirmationProps = {
  trxUrl: string | undefined;
  setSuccess: (success: boolean) => void;
  setProgressValue: (progressValue: number) => void;
  setActiveStep: (active: number) => void;
  balance: number;
};

const SignTransactionConfirmation = (
  props: SignTransactionConfirmationProps
) => (
  <>
    <div className="web-view">
      <SuccessSection
        message="you have successfully signed a blockchain transaction using Tonomy ID."
        labels={[
          "Insurance claims",
          "Shipping and logistic events",
          "Games",
          "NFTs",
          "Accounting and Defi",
          "Votes",
        ]}
        submit={() => {
          props.setProgressValue(0);
          props.setActiveStep(-1);
          props.setSuccess(false);
        }}
        url={props.trxUrl}
      />
    </div>
    <div className="mobile-view">
      <div className="mobile-container  imagine-mobile">
        <div className="user-section" style={{ width: "40%" }}>
          <ArrowBackIosIcon className="user-logo" />
        </div>
        <div
          className="mobile-logout-section"
          style={{ justifyContent: "flex-start" }}
        >
          <TH2>Payment</TH2>
        </div>
      </div>
      <div className=" display-mobile-balance">
        <TH1>Your Balance</TH1>
        <p>{props.balance}100.00 EUR</p>
      </div>
      <div className="mobile-success-section">
        <p>Congratulations,</p>
        <p>
          you have successfully signed a blockchain transaction using Tonomy ID
        </p>
        <button
          className="mobile-demo-link mobile-view"
          style={{ marginTop: "3rem" }}
          //   onClick={() => {
          //     props.setImagineSection(false);
          //     props.setPaymentSection(true);
          //   }}
        >
          Go back home
        </button>
      </div>
    </div>
  </>
);

export default SignTransactionConfirmation;
