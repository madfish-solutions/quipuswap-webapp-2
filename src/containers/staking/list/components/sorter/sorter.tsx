import { FC, useContext } from 'react';

import { ColorModes, ColorThemeContext } from '@quipuswap/ui-kit';
import cx from 'classnames';
import Select, { Props as SelectProps } from 'react-select';

import { Sort } from '@components/svg/sort';

import styles from './sorter.module.scss';
import { useSorterViewModel } from './sorter.vm';

interface Props extends SelectProps {
  className?: string;
}

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

export const Sorter: FC<Props> = ({ className, ...props }) => {
  const { colorThemeMode } = useContext(ColorThemeContext);
  const { onSorterChange, sortingValues } = useSorterViewModel();

  return (
    <div className={cx(styles.root, modeClass[colorThemeMode], className)}>
      <Select
        classNamePrefix="sorterSelect"
        onChange={onSorterChange}
        options={sortingValues}
        isSearchable={false}
        {...props}
      />
      <Sort />
    </div>
  );
};
