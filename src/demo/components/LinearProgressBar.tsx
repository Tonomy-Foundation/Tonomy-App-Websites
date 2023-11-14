import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 16,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor:
      theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === "light" ? "#67D7ED" : "#E4E4E4",
  },
}));

export type ProgressBarProps = {
  progressValue: number;
};

export default function CustomizedProgressBars(props: ProgressBarProps) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "4vh",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          maxWidth: "510px",
          width: "100%", // Ensure the Box takes full width
        }}
        className={props.progressValue > 0 ? "stepCOntainer" : ""}
      >
        <BorderLinearProgress
          variant="determinate"
          value={props.progressValue}
          sx={{ width: "100%", height:'23px' }} // Ensure the progress bar takes full width
          className="progress-bar"
        />
      </Box>
    </div>
  );
}
