import React, { Dispatch, SetStateAction } from "react";
import "./TextboxLayout.css";

export type TextboxLayoutProps = {
  label: string;
  value: string | number | undefined;
  type?: string;
  onChange?: Dispatch<SetStateAction<string | number | undefined>>;
};

const TextboxLayout = (props: TextboxLayoutProps) => {
  return (
    <div className="input-container">
      <input
        type={props.type ? props.type : "text"}
        className="transparent-textbox"
        id="inputField"
        value={props.value || ""}
        onChange={(e) => {
          if (props.onChange) props.onChange(e.target.value);
        }}
      />
      <label htmlFor="inputField" className="textbox-label">
        {props.label}
      </label>
    </div>
  );
};

export default TextboxLayout;
