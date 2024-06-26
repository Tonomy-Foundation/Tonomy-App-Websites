import * as React from "react";
import { createTheme, ThemeProvider } from "@mui/material";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import CustomizedProgressBars from "./LinearProgressBar";
import "./VerticalProgressStep.css";

interface CustomStepIconProps {
  active: boolean;
}

// Create a custom theme with overrides
const theme = createTheme({
  components: {
    MuiStepLabel: {
      styleOverrides: {
        root: {
          padding: "0px",
        },
        label: {
          fontWeight: "bold",
          padding: "0px",
        },
      },
    },
    MuiStepConnector: {
      styleOverrides: {
        line: {
          minHeight: "38px",
        },
        root: {
          marginLeft: "8px",
        },
      },
    },
  },
});
const CustomStepIcon: React.FC<CustomStepIconProps> = ({ active }) => {
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
  onContinue?: () => void;
};

export default function VerticalLinearStepper(props: VerticalStepperProps) {
  return (
    <div className="progressbar-container">
      <CustomizedProgressBars progressValue={props.progressValue} />
      <Box
        sx={{ display: "flex", justifyContent: "center", marginTop: "1.7rem" }}
      >
        <ThemeProvider theme={theme}>
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
        </ThemeProvider>
      </Box>
      {props.activeStep === props.steps.length - 1 && (
        <>
          <Button
            sx={{ mt: 3 }}
            className="continue-btn web-view"
            onClick={props.onContinue}
          >
            Continue
          </Button>
          <button
            className="mobile-demo-link mobile-view"
            style={{ marginTop: "0rem" }}
            onClick={props.onContinue}
          >
            Next
          </button>
        </>
      )}
    </div>
  );
}
