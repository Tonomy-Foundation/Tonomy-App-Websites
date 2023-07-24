import { TH2 } from "../../common/atoms/THeadings";
import { Highlighter } from "rc-highlight";
import "./TPageHighlighted.css";

export type TPageHighlightedProps = {
  highlighterText: string;
  documentLink: string;
  githubLink: string;
};

const TPageHighlighted = (props: TPageHighlightedProps) => {
  return (
    <div className="rightDocs">
      <div className="highlighter">
        <Highlighter>{props.highlighterText}</Highlighter>
      </div>
    </div>
  );
};

export default TPageHighlighted;
