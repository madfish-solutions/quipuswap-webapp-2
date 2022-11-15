import { isExist } from '@shared/helpers';
import { CFC, Nullable } from '@shared/types';

import { CardCell } from '../card-cell';
import { Tooltip } from '../tooltip';
import styles from './details-card-cell.module.scss';

interface DetailsCardCellProps {
  cellName: string;
  tooltipContent?: Nullable<string>;
  className: string;
}

export const DetailsCardCell: CFC<DetailsCardCellProps> = ({
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
          <span className={styles.cellName} data-test-id="cellName">
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
