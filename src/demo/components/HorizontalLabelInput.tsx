import React from "react";
import "./HorizontalLabelInput.css";

export type HorizontalLabelInputProps = {
  label: string;
  value: string;
};

const HorizontalLabelInput = (props: HorizontalLabelInputProps) => {
  return (
    <div className="form-group">
      <label className="horizontal-label">{props.label}</label>
      <input className="horizontal-input" type="text" value={props.value} />
    </div>
  );
};

export default HorizontalLabelInput;
