import React from "react";
import "./Theadings.css";

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

export function TP(props: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p {...props} />;
}
