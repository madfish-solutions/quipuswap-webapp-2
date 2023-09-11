import cx from 'classnames';

import { isExist } from '@shared/helpers';
import { CFC, Nullable } from '@shared/types';

import styles from './details-card-cell.module.scss';
import { CardCell } from '../card-cell';
import { Tooltip } from '../tooltip';

interface DetailsCardCellProps {
  cellName: string;
  tooltipContent?: Nullable<string>;
  className?: string;
  cellNameClassName?: string;
}

export const DetailsCardCell: CFC<DetailsCardCellProps> = ({
  children,
  cellName,
  tooltipContent,
  className,
  cellNameClassName,
  ...props
}) => {
  return (
    <CardCell
      header={
        <>
          <span className={cx(styles.cellName, cellNameClassName)} data-test-id="cellName">
            {cellName}
          </span>
          {isExist(tooltipContent) && <Tooltip content={tooltipContent} />}
        </>
      }
      className={className}
      {...props}
    >
      {children}
    </CardCell>
  );
};
