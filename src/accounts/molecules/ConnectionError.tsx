import connectionImage from "../assets/connecting.png";
import { TP } from "../../common/atoms/THeadings";
import TImage from "../../common/atoms/TImage";
import settings from "../../common/settings";
import { TLink } from "../../common/atoms/TLink";

export default function ConnectionError({
  username,
  tryAgainLink,
}: {
  username?: string;
  tryAgainLink?: string;
}) {
  return (
    <div className="margin-top">
      <TImage src={connectionImage} alt="Connecting Phone-PC" />

      {username ? (
        <>
          <TP className="margin-top">
            Could not connect to the mobile app of the user <u>{username}</u>.
          </TP>
          <TP>
            Please open {settings.config.appName} on your phone and login as{" "}
            <u>{username}</u> and <TLink href={tryAgainLink}>try again</TLink>.
          </TP>
        </>
      ) : (
        <>
          <TP className="margin-top">
            Could not connect to the {settings.config.appName}.
          </TP>
          <TP>
            Please <TLink href={tryAgainLink}>try again</TLink>.
          </TP>
        </>
      )}
    </div>
  );
}
