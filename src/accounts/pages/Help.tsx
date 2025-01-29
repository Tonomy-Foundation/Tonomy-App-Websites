import { useLocation } from "react-router-dom";
import { TH4 } from "../../common/atoms/THeadings";

export default function Help() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const payload = params.get("payload");
  const screen = params.get("screen");

  // Decode and parse the payload
  const parsedPayload = payload ? payload : null;

  console.log(parsedPayload, screen);
  return (
    <div className="container">
      <TH4>Testing View Help</TH4>
      <p>parsedPayload: {parsedPayload}</p>
      <p>screen: {screen}</p>
    </div>
  );
}
