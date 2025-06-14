import React from "react";
import "./buttons.css";
import { useNavigate } from "react-router-dom";

export function TLink(
  props: React.DetailedHTMLProps<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    HTMLAnchorElement
  >,
) {
  const navigation = useNavigate();

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
