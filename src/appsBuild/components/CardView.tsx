import React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import "./CardView.css";

export type CardViewProps = {
  appName: string;
  accountName: string;
  domain: string;
  logo: string;
  onClick?: () => void;
};

const CardView = (props: CardViewProps) => {
  return (
    <div className="card-container" onClick={props.onClick} style={{ cursor: props.onClick ? "pointer" : "default" }}>
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
          title={
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <img src={props.logo} alt="App-logo" className="my-app-logo" />
              <span className="card-title">{props.appName}</span>
            </div>
          }
          subheader={
            <div className="my-app-subheader grey-color">
              <span className="black-color">{props.accountName}</span> • {props.domain}
            </div>
          }
        />
      </Card>
    </div>
  );
};

export default CardView;

