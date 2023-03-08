import React from 'react';

export function TH1(props: React.HTMLAttributes<HTMLHeadingElement>) {
    return <h1 {...props} />;
}

export function TH2(props: React.HTMLAttributes<HTMLHeadingElement>) {
    return <h2 {...props} />;
}

export function TH3(props: React.HTMLAttributes<HTMLHeadingElement>) {
    return <h3 {...props} />;
}

export function TP(props: React.HTMLAttributes<HTMLParagraphElement>) {
    return <p {...props} />;
}
