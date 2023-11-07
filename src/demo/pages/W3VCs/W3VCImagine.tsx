import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { TH2 } from "../../../common/atoms/THeadings";

export type W3VCImagineProps = {
  setActiveSection?: (section: string) => void;
};

const W3VCImagine = (props: W3VCImagineProps) => (
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
        {`you go to the doctor's office for a checkup. While waiting, your
          Tonomy ID notifies you that Dr. Smith wants access to your medical
          files. With just one click, you can grant access to the files while
          waiting for the doctor to arrive.`}
      </p>
      {props?.setActiveSection && (
        <button
          className="mobile-demo-link mobile-view"
          style={{ marginTop: "5rem" }}
          onClick={() => {
            props?.setActiveSection?.("sendPayment");
          }}
        >
          Next
        </button>
      )}
    </div>
  </>
);

export default W3VCImagine;
