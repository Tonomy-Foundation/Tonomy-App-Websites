import React from "react";
import { IconButton } from "@mui/material";

export type IconButtonProps = React.ComponentProps<typeof IconButton> & {
  icon: string;
  color?: string;
};

export default function TIconButton(props: IconButtonProps) {
  // https://mui.com/material-ui/material-icons/
  return (
    <IconButton color={props.color} {...props}>
      {props.icon}
    </IconButton>
  );
}
