import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";
import Button from "@mui/material/Button";
import CustomizedProgressBars from "./LinearProgressBar";
import "./VerticalProgressStep.css";

const CustomStepIcon = ({ active }) => {
  const customStepIconClass = active ? "active" : "";

  return (
    <div className={`custom-step-icon  ${customStepIconClass}`}>
      <div className={`inner-dot ${customStepIconClass}`} />
    </div>
  );
};

export type VerticalStepperProps = {
  activeStep: number;
  steps: Array<{ label: string }>;
  progressValue: number;
};

export default function VerticalLinearStepper(props: VerticalStepperProps) {
  return (
    <div className="progressContainer">
      <CustomizedProgressBars progressValue={props.progressValue} />
      <Box
        sx={{ display: "flex", justifyContent: "center", marginTop: "1rem" }}
      >
        <Stepper activeStep={props.activeStep} orientation="vertical">
          {props.steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel
                icon={<CustomStepIcon active={props.activeStep >= index} />}
              >
                {step.label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
      {props.activeStep === props.steps.length - 1 && (
        <Button sx={{ mt: 1 }} className="continueBtn">
          Continue
        </Button>
      )}
    </div>
  );
}
