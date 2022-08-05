import { FC } from 'react';

import { ListItemCardCell } from '../list-item-card-cell';
import { StateCurrencyAmount, StateCurrencyAmountProps } from '../state-components';
import styles from './state-list-item-card-cell.module.scss';

export interface StateListItemCardCellProps {
  cellName: string;
  cellNameClassName?: string;
  cardCellClassName?: string;
  amounts: StateCurrencyAmountProps;
  DTI?: string;
  tooltip?: string;
}

export const StateListItemCardCell: FC<StateListItemCardCellProps> = ({
  amounts,
  cellName,
  cardCellClassName = styles.cardCell,
  cellNameClassName = styles.cardCellHeader,
  DTI,
  tooltip
}) => (
  <ListItemCardCell
    cellName={cellName}
    tooltip={tooltip}
    cellNameClassName={cellNameClassName}
    cardCellClassName={cardCellClassName}
    data-test-id={DTI}
  >
    <StateCurrencyAmount {...amounts} />
  </ListItemCardCell>
);
