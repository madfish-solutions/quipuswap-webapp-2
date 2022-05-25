import { CFC } from '@shared/types';

interface ScaffoldingProps {
  className?: string;
  height?: number;
  width?: number;
  showChild: boolean;
}

export const Scaffolding: CFC<ScaffoldingProps> = ({ className, showChild, children, width, height }) => {
  if (showChild) {
    return <>{children}</>;
  }

  return <div className={className} style={{ width, height }}></div>;
};
