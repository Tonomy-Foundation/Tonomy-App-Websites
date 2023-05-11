import React from "react";
import "./buttons.css";

export function TContainedButton(
  props: React.HTMLAttributes<HTMLButtonElement>
) {
  return (
    <button
      className="contained-button"
      {...props}
      style={{
        // eslint-disable-next-line react/prop-types
        ...props.style,
      }}
    />
  );
}
