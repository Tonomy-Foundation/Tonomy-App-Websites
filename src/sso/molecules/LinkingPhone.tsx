import connectionImage from "../assets/tonomy/connecting.png";
import { TP } from "../components/THeadings";
import TImage from "../components/TImage";
import TProgressCircle from "../components/TProgressCircle";

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
