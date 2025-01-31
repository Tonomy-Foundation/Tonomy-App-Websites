import React, { useEffect } from "react";
import { TH4 } from "../../common/atoms/THeadings";
import { useNavigate } from "react-router-dom";

export default function Help() {
  const navigation = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      document.body.removeChild(iframe);
      navigation("/download");
    }, 1000);
  }, []);
  return (
    <div className="container">
      <TH4>Loading....</TH4>
    </div>
  );
}
