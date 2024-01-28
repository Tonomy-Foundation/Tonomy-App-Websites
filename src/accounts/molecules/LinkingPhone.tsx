import connectionImage from "../assets/connecting.png";
import { TP } from "../atoms/THeadings";
import TImage from "../atoms/TImage";
import TProgressCircle from "../atoms/TProgressCircle";

export default function LinkingPhone() {
  return (
    <div className="margin-top">
      <TImage src={connectionImage} alt="Connecting Phone-PC" />
      <TP className="margin-top">
        Linking to phone and sending data. Please remain connected.{" "}
      </TP>
      <TProgressCircle />
    </div>
  );
}
