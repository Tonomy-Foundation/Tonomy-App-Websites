import React from "react";
import "./buttons.css";
import { useNavigate } from "react-router-dom";

export function TLink(props: React.LinkHTMLAttributes<HTMLAnchorElement>) {
  const navigation = useNavigate();

  // eslint-disable-next-line react/prop-types
  const { href } = props;
  const newProps = Object.assign({}, props);

  try {
    new URL(href as string);
    // URL is full URL
  } catch (e) {
    // URL is relative
    delete newProps.href;

    newProps.onClick = () => {
      navigation(href as string);
    };
  }

  return <a {...newProps} className="button-link"></a>;
}
