import React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import "./CardView.css";

export type CardViewProps = {
  appName: string;
  username: string;
  logo: string;
};

const CardView = (props: CardViewProps) => {
  return (
    <div className="card-container">
      <Card
        sx={{
          border: "1px solid var(--gray-300)",
          borderRadius: "8px",
          boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.08)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          transition: "all 0.2s ease",
          "&:hover": {
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.12)",
            borderColor: "var(--gray-400)",
          },
        }}
      >
        <CardHeader
          className="card-header"
          action={
            <IconButton aria-label="settings" size="small">
              <MoreVertIcon fontSize="small" />
            </IconButton>
          }
          title={
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <img src={props.logo} alt="App-logo" className="my-app-logo" />
              <span className="card-title">{props.appName}</span>
            </div>
          }
          subheader={
            <div className="my-app-subheader grey-color">
              Manager: <span className="black-color">{props.username}</span>
            </div>
          }
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <button className="card-action-button">Deploy Smart Contract</button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CardView;

