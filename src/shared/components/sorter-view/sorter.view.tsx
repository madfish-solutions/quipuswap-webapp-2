import { FC, useContext } from 'react';

import cx from 'classnames';
import { observer } from 'mobx-react-lite';
import Select, { Props as SelectProps } from 'react-select';

import { FarmingSortFieldItem } from '@modules/farming/pages/list/types';
import { StableDividendsSortFieldItem } from '@modules/stableswap/stabledividends/pages/list/types';
import { StableswapSortFieldItem } from '@modules/stableswap/stableswap-liquidity/pages/list/types';
import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { Button } from '@shared/components';
import { Sort } from '@shared/svg';
import { Undefined } from '@shared/types';

import styles from './sorter.module.scss';

export interface SorterProps {
  sortingValue: Undefined<FarmingSortFieldItem | StableswapSortFieldItem | StableDividendsSortFieldItem>;
  sortDirectionRotate: boolean;
  sortingValues: FarmingSortFieldItem[] | StableswapSortFieldItem[] | StableDividendsSortFieldItem[];
  buttonDTI: string;
  handleSortFieldChange: (value: unknown) => void;
  handleSortDirectionToggle: () => void;
}

interface Props extends SelectProps, SorterProps {
  className?: string;
}

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

export const SorterView: FC<Props> = observer(
  ({
    sortingValue,
    sortDirectionRotate,
    handleSortFieldChange,
    handleSortDirectionToggle,
    sortingValues,
    buttonDTI,
    className,
    ...props
  }) => {
    const { colorThemeMode } = useContext(ColorThemeContext);

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
        <Button theme="tertiary" onClick={handleSortDirectionToggle} data-test-id={buttonDTI}>
          <Sort rotation={sortDirectionRotate} />
        </Button>
      </div>
    );
  }
);
