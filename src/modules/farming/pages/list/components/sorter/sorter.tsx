import { FC, useContext } from 'react';

import cx from 'classnames';
import { observer } from 'mobx-react-lite';
import Select, { Props as SelectProps } from 'react-select';

import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { Button } from '@shared/components';
import { Sort } from '@shared/svg';

import styles from './sorter.module.scss';
import { useSorterViewModel } from './sorter.vm';

interface Props extends SelectProps {
  className?: string;
}

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

export const Sorter: FC<Props> = observer(({ className, ...props }) => {
  const { colorThemeMode } = useContext(ColorThemeContext);
  const { sortingValue, sortDirectionRotate, handleSortFieldChange, handleSortDirectionToggle, sortingValues } =
    useSorterViewModel();

  return (
    <div className={cx(styles.root, modeClass[colorThemeMode], className)}>
      <Select
        classNamePrefix="sorterSelect"
        onChange={handleSortFieldChange}
        options={sortingValues}
        isSearchable={false}
        value={sortingValue}
        {...props}
      />
      <Button theme="tertiary" onClick={handleSortDirectionToggle}>
        <Sort rotate={sortDirectionRotate} />
      </Button>
    </div>
  );
});
