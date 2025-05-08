import React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
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
          maxWidth: 345,
          border: "1px solid var(--gray-300)",
          borderRadius: "8px",
          boxShadow: "none",
          width: "100%",
        }}
      >
        <CardHeader
          className="card-header"
          action={
            <IconButton aria-label="settings">
              <MoreVertIcon />
            </IconButton>
          }
          title={
            <div style={{ display: "flex", alignItems: "center" }}>
              <img src={props.logo} alt="App-logo" className="myapp-logo" />
              <span style={{ marginLeft: "8px" }}>{props.appName}</span>
            </div>
          }
          subheader={
            <div className="card-subheader grey-color">
              Manager: <span className="black-color">{props.username}</span>
            </div>
          }
        />
      </Card>
    </div>
  );
};

export default CardView;
