import { LinearProgress } from '@mui/material';
import React from 'react';

export default function TProgressBar(props: React.ComponentProps<typeof LinearProgress>) {
    return <LinearProgress variant="determinate" {...props} />;
}
