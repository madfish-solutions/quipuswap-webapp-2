import { FC, MouseEventHandler, useCallback } from 'react';

import { BinIcon } from '@shared/svg';

interface BinProps {
  onClick: () => void;
  className?: string;
}

export const Bin: FC<BinProps> = ({ onClick, className }) => {
  const handleClick: MouseEventHandler<HTMLDivElement> = useCallback(
    event => {
      event.stopPropagation();
      event.preventDefault();
      onClick();
    },
    [onClick]
  );

  return (
    <div className={className} onClick={handleClick}>
      <BinIcon />
    </div>
  );
};
