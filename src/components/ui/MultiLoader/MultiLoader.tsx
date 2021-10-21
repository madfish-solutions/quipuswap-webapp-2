import React from 'react';

interface MultiLoaderProps {
  count: number;
  Component: React.FC;
}

export const MultiLoader: React.FC<MultiLoaderProps> = ({count, Component}) => (
  <>
    {new Array(count)
      .fill(0)
      .map((x, i) => i)
      .map((x) => (
        <Component key={x} />
      ))}
  </>
);
