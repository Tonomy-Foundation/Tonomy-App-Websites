import React from "react";
import "./THeadings.css";

type PProps = React.HTMLAttributes<HTMLParagraphElement> & {
  size?: 1 | 2;
};

export function TH1(props: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h1 {...props} />;
}

export function TH2(props: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h2 {...props} />;
}

export function TH3(props: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 {...props} />;
}

export function TH4(props: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h4 {...props} />;
}

export function TP(props: PProps) {
  return (
    // eslint-disable-next-line react/prop-types
    <p {...props} className={"size" + props.size + " " + props.className} />
  );
}
