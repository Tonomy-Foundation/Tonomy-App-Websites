import { TH2 } from "../../common/atoms/THeadings";
import { Highlighter } from "rc-highlight";
import PropTypes from "prop-types";

const HighlightedPageView = ({ highlighterText, documentLink, githubLink }) => {
  return (
    <div className="rightDocs">
      <TH2 className="title">Code Snippet</TH2>
      <div className="highlighter">
        <Highlighter>{highlighterText}</Highlighter>
      </div>

      <a href={documentLink} className="link" target="_blank" rel="noreferrer">
        View Documentation
      </a>
      <a
        href={githubLink}
        className="link footer"
        target="_blank"
        rel="noreferrer"
      >
        View on GitHub
      </a>
    </div>
  );
};

HighlightedPageView.propTypes = {
  highlighterText: PropTypes.string,
  documentLink: PropTypes.string,
  githubLink: PropTypes.string,
};

export default HighlightedPageView;
