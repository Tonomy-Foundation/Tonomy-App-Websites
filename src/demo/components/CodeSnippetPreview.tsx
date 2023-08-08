import React from "react";
import HighlightedPageView from "../components/TPageHighlighted";
import "./CodeSnippetPreview.css";

export type CodeSnippetPreviewProps = {
  documentationLink: string;
  snippetCode: string;
};

const CodeSnippetPreview = (props: CodeSnippetPreviewProps) => {
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(!open);
  };

  return (
    <div className="documentation">
      <div>
        {" "}
        <a href={props.documentationLink} target="_blank" rel="noreferrer">
          <p>Documentation {`->`} </p>
        </a>
      </div>
      <div>
        <button onClick={handleOpen}>
          Code Snippet<span className="dropdown-arrow">v</span>
        </button>
        {open && (
          <div className="dropdown-content">
            <HighlightedPageView highlighterText={props.snippetCode} />
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeSnippetPreview;
