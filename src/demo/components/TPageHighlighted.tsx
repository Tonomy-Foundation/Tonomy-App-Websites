import { TH2 } from "../../common/atoms/THeadings";
import { Highlighter } from "rc-highlight";
import "./TPageHighlighted.css";

export type HighlightedPageViewProps = {
  highlighterText: string;
  documentLink: string;
  githubLink: string;
};

const HighlightedPageView = (props: HighlightedPageViewProps) => {
  return (
    <div className="rightDocs">
      <TH2 className="title">Code Snippet</TH2>
      <div className="highlighter">
        <Highlighter>{props.highlighterText}</Highlighter>
      </div>

      <a
        href={props.documentLink}
        className="link"
        target="_blank"
        rel="noreferrer"
      >
        View Documentation
      </a>
      <a
        href={props.githubLink}
        className="link footer"
        target="_blank"
        rel="noreferrer"
      >
        View on GitHub
      </a>
    </div>
  );
};

export default HighlightedPageView;
