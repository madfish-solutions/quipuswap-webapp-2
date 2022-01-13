import { FC } from 'react';

import { CardCell, Tooltip } from '@quipuswap/ui-kit';
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
          <Tooltip sizeT="small" content={tooltipContent} />
        </>
      }
      className={className}
    >
      {children}
    </CardCell>
  );
};
