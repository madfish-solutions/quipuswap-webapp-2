import { FC } from 'react';

import { CardCell } from '@quipuswap/ui-kit';

import { isExist } from '@utils/helpers';
import { Nullable } from '@utils/types';

import { Tooltip } from '../components/tooltip';

interface DetailsCardCellProps {
  cellName: string;
  tooltipContent?: Nullable<string>;
  className: string;
}

export const DetailsCardCell: FC<DetailsCardCellProps> = ({ children, cellName, tooltipContent, className }) => {
  return (
    <CardCell
      header={
        <>
          {cellName}
          {isExist(tooltipContent) && <Tooltip content={tooltipContent} />}
        </>
      }
      className={className}
    >
      {children}
    </CardCell>
  );
};
