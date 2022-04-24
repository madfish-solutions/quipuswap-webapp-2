import { FC } from 'react';

import { isExist } from '@shared/helpers';
import { Nullable } from '@shared/types';
import { DataTestAttribute } from '@tests/types';

import { CardCell } from '../card-cell';
import { Tooltip } from '../tooltip';

interface DetailsCardCellProps extends DataTestAttribute {
  cellName: string;
  tooltipContent?: Nullable<string>;
  className: string;
}

export const DetailsCardCell: FC<DetailsCardCellProps> = ({
  children,
  cellName,
  tooltipContent,
  className,
  testId
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
      testId={testId}
    >
      {children}
    </CardCell>
  );
};
