import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { TH2 } from "../../../common/atoms/THeadings";

const SignTransactionImagine = () => (
  <>
    <div className="mobile-container mobile-view imagine-mobile">
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
    <div className="paraSection">
      <p className="imagine">Imagine,</p>
      <p className="paralines">
        {`you go to the doctor's office for a checkup. While waiting, your
          Tonomy ID notifies you that Dr. Smith wants access to your medical
          files. With just one click, you can grant access to the files while
          waiting for the doctor to arrive.`}
      </p>
      <button
        className="mobile-demo-link mobile-view"
        style={{ marginTop: "3rem" }}
        //   onClick={() => {
        //     props.setImagineSection(false);
        //     props.setPaymentSection(true);
        //   }}
      >
        Next
      </button>
    </div>
  </>
);

export default SignTransactionImagine;
