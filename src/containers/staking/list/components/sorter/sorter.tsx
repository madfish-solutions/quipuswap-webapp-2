import { FC } from 'react';

import cx from 'classnames';
import { Props as SelectProps } from 'react-select';

import { SelectUI } from '@components/ui/elements';

import styles from './sorter.module.scss';
import { useSorterViewModel } from './sorter.vm';

interface Props extends SelectProps {
  className?: string;
}

export enum SortType {
  APR = 'APR',
  APY = 'APY',
  TVL = 'TVL',
  BALANCE = 'BALANCE',
  DEPOSIT = 'DEPOSIT',
  EARNED = 'EARNED'
}

export interface SortValue {
  label: string;
  value: SortType;
  up: boolean;
}

const sortingValues = [
  { label: 'APR', value: SortType.APR, up: true },
  { label: 'APR', value: SortType.APR, up: false },
  { label: 'APY', value: SortType.APY, up: true },
  { label: 'APY', value: SortType.APY, up: false },
  { label: 'TVL', value: SortType.TVL, up: true },
  { label: 'TVL', value: SortType.TVL, up: false },
  { label: 'Balance', value: SortType.BALANCE, up: true },
  { label: 'Balance', value: SortType.BALANCE, up: false },
  { label: 'Deposit', value: SortType.DEPOSIT, up: true },
  { label: 'Deposit', value: SortType.DEPOSIT, up: false },
  { label: 'Earned', value: SortType.EARNED, up: true },
  { label: 'Earned', value: SortType.EARNED, up: false }
];

export const Sorter: FC<Props> = ({ className, menuPlacement }) => {
  const { onSorterChange } = useSorterViewModel();

  return (
    <SelectUI
      options={sortingValues}
      value={{ label: 'Sorted By' }}
      onChange={onSorterChange}
      className={cx(className, styles.sorter)}
      menuPlacement={menuPlacement}
    />
  );
};
