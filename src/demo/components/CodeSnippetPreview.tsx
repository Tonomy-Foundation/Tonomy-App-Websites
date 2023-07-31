import React from "react";
import HighlightedPageView from "../components/TPageHighlighted";
import "./CodeSnippetPreview.css";

export type CodeSnippetPreviewProps = {
  value: string;
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
        <p>Documentation {`->`} </p>
      </div>
      <div>
        <button onClick={handleOpen}>
          Code Snippet<span className="dropdown-arrow">v</span>
        </button>
        {open && (
          <div className="dropdown-content">
            <HighlightedPageView highlighterText={props.value} />
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeSnippetPreview;
