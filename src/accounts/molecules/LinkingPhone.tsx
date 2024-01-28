import connectionImage from "../assets/connecting.png";
import { TP } from "../../common/atoms/THeadings";
import TImage from "../../common/atoms/TImage";
import TProgressCircle from "../../common/atoms/TProgressCircle";

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
