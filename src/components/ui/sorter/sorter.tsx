import { FC } from 'react';

import cx from 'classnames';
import { Props as SelectProps } from 'react-select';

import { SelectUI } from '../elements';
import styles from './sorter.module.scss';

interface Props {
  className?: string;
}

interface Props extends SelectProps {
  className?: string;
}

const sortingValues = [
  { label: 'tvl', value: '1' },
  { label: 'apr', value: '2' },
  { label: 'staked', value: '3' }
];

export const Sorter: FC<Props> = ({ className, menuPlacement }) => {
  return (
    <SelectUI
      options={sortingValues}
      value={{ label: 'Sorted By' }}
      className={cx(className, styles.sorter)}
      menuPlacement={menuPlacement}
    />
  );
};
