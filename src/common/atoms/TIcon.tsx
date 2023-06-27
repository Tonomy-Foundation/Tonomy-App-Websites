import React from "react";
import Icon from '@mui/material/Icon';

type Props = React.ComponentProps<typeof Icon> & { icon: string };

export default function TIcon(props: Props) {
    // https://fonts.google.com/icons
    return <Icon {...props}>{props.icon}</Icon>;
}