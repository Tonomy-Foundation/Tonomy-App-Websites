const SignTransactionImagine = () => (
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
      //   onClick={() => {
      //     props.setImagineSection(false);
      //     props.setPaymentSection(true);
      //   }}
    >
      Next
    </button>
  </div>
);

export default SignTransactionImagine;
