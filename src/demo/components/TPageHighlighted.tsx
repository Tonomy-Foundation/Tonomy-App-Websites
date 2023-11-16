import { Highlighter } from "rc-highlight";
import "./TPageHighlighted.css";

export type TPageHighlightedProps = {
  highlighterText: string;
};

const TPageHighlighted = (props: TPageHighlightedProps) => {
  return (
    <div className="highlight-page-docs">
      <div className="highlighter">
        <Highlighter>{props.highlighterText}</Highlighter>
      </div>
    </div>
  );
};

export default TPageHighlighted;
