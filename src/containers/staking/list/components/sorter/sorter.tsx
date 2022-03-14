import { FC } from 'react';

import cx from 'classnames';
import { Props as SelectProps } from 'react-select';

import { SelectUI } from '@components/ui/elements';

import styles from './sorter.module.scss';
import { useSorterViewModel } from './sorter.vm';

interface Props extends SelectProps {
  className?: string;
}

export const Sorter: FC<Props> = ({ className, menuPlacement }) => {
  const { onSorterChange, sortingValues } = useSorterViewModel();

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
