import connectionImage from "../assets/connecting.png";
import { TP } from "../../common/atoms/THeadings";
import TImage from "../../common/atoms/TImage";
import settings from "../../common/settings";

export default function ConnectionError({ username }: { username: string }) {
  return (
    <div className="margin-top">
      <TImage src={connectionImage} alt="Connecting Phone-PC" />
      <TP className="margin-top">
        Could not connect to the mobile app of the user {username}. Please open
        {settings.config.appName} on your phone and login as XXX.
      </TP>
    </div>
  );
}
