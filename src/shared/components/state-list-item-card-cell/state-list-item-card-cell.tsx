import { FC } from 'react';

import { ListItemCardCell } from '../list-item-card-cell';
import { StateCurrencyAmount, StateCurrencyAmountProps } from '../state-components';
import styles from './state-list-item-card-cell.module.scss';

export interface StateListItemCardCellProps {
  cellName: string;
  cellNameClassName?: string;
  cardCellClassName?: string;
  amounts: StateCurrencyAmountProps;
}

export const StateListItemCardCell: FC<StateListItemCardCellProps> = ({
  amounts,
  cellName,
  cardCellClassName = styles.cardCell,
  cellNameClassName = styles.cardCellHeader
}) => (
  <ListItemCardCell cellName={cellName} cellNameClassName={cellNameClassName} cardCellClassName={cardCellClassName}>
    <StateCurrencyAmount {...amounts} />
  </ListItemCardCell>
);
