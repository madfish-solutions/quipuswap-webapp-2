import { FC } from 'react';

interface ScaffoldingProps {
  className?: string;
  height?: number;
  width?: number;
  showChild: boolean;
}

export const Scaffolding: FC<ScaffoldingProps> = ({ className, showChild, children, width, height }) => {
  if (showChild) {
    return <>{children}</>;
  }

  return <div className={className} style={{ width, height }}></div>;
};
