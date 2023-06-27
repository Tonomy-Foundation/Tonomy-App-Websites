import React from "react";
import "./HorizontalLabelInput.css";

export type HorizontalLabelInputProps = {
  label: string;
  value?: string;
  onChange?: (value: string) => void;
};

const HorizontalLabelInput = (props: HorizontalLabelInputProps) => {
  return (
    <div className="form-group">
      <label className="horizontal-label">{props.label}</label>
      <input
        className="horizontal-input"
        type="text"
        value={props.value || ""}
        onChange={(e) => {
          if (props.onChange) props.onChange(e.target.value);
        }}
      />
    </div>
  );
};

export default HorizontalLabelInput;
