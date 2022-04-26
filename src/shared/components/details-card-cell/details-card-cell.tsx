import { FC } from 'react';

import { isExist } from '@shared/helpers';
import { Nullable } from '@shared/types';

import { CardCell } from '../card-cell';
import { Tooltip } from '../tooltip';

interface DetailsCardCellProps {
  cellName: string;
  tooltipContent?: Nullable<string>;
  className: string;
}

export const DetailsCardCell: FC<DetailsCardCellProps> = ({
  children,
  cellName,
  tooltipContent,
  className,
  ...props
}) => {
  return (
    <CardCell
      header={
        <>
          <span data-test-id="cellName">{cellName}</span>
          {isExist(tooltipContent) && <Tooltip content={tooltipContent} />}
        </>
      }
      className={className}
      data-test-id={props}
    >
      {children}
    </CardCell>
  );
};
