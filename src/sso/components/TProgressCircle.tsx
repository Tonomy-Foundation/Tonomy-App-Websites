import { CircularProgress } from '@mui/material';
import React from 'react';

export default function TProgressCircle(props: React.ComponentProps<typeof CircularProgress>) {
    return <CircularProgress {...props} />;
}
