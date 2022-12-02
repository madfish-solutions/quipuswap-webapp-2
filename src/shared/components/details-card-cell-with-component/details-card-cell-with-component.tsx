import { ReactNode } from 'react';

import cx from 'classnames';

import { isExist } from '@shared/helpers';
import { CFC, Nullable } from '@shared/types';

import { CardCell } from '../card-cell';
import { Tooltip } from '../tooltip';
import styles from './details-card-cell-with-component.module.scss';

interface DetailsCardCellWithComponentProps {
  cellName: string;
  tooltipContent?: Nullable<string>;
  className?: string;
  cellNameClassName?: string;
  component: ReactNode;
}

export const DetailsCardCellWithComponent: CFC<DetailsCardCellWithComponentProps> = ({
  children,
  cellName,
  tooltipContent,
  className,
  cellNameClassName,
  component,
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
          {component}
        </>
      }
      className={className}
      {...props}
    >
      {children}
    </CardCell>
  );
};
