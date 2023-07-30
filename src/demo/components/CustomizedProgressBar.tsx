import React from "react";
import "./CustomizedProgressBar.css";

export type CustomizedProgressBarProps = {
  steps: number[];
};

const CustomizedProgressBar = (props: CustomizedProgressBarProps) => {
  return (
    <div>
      {props.steps.map((i) => {
        return <div key={i}>{i}</div>;
      })}
    </div>
  );
};

export default CustomizedProgressBar;
