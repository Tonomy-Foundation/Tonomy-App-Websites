import React from 'react';

export function TContainedButton(props: React.HTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      style={{
        // eslint-disable-next-line react/prop-types
        ...props.style,
        color: 'white',
        backgroundColor: '#67D7ED',
        borderRadius: '20px',
        padding: '10px 20px',
        borderColor: 'transparent',
        width: '80%',
      }}
    />
  );
}
