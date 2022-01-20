import { FC } from 'react';

import { CardCell } from '@quipuswap/ui-kit';

import { Tooltip } from '../components/tooltip';
interface DetailsCardCellProps {
  cellName: string;
  tooltipContent: string;
  className: string;
}

export const DetailsCardCell: FC<DetailsCardCellProps> = ({ children, cellName, tooltipContent, className }) => {
  return (
    <CardCell
      header={
        <>
          {cellName}
          <Tooltip content={tooltipContent} />
        </>
      }
      className={className}
    >
      {children}
    </CardCell>
  );
};
