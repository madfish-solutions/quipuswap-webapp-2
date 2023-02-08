import { FC, useContext } from 'react';

import cx from 'classnames';
import { observer } from 'mobx-react-lite';
import Select, { Props as SelectProps } from 'react-select';

import { FarmingSortFieldItem } from '@modules/farming/pages/list/types';
import { LiquiditySortFieldItem } from '@modules/liquidity/pages/list/types';
import { StableDividendsSortFieldItem } from '@modules/stableswap/stabledividends/pages/list/types';
import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { Button } from '@shared/components';
import { Sort } from '@shared/svg';
import { Undefined } from '@shared/types';

import styles from './sorter.module.scss';

export interface SorterProps {
  sortingValue: Undefined<FarmingSortFieldItem | StableDividendsSortFieldItem | LiquiditySortFieldItem>;
  sortDirectionRotate: boolean;
  sortingValues: FarmingSortFieldItem[] | StableDividendsSortFieldItem[] | LiquiditySortFieldItem[];
  buttonDTI: string;
  sorterSelectDTI: string;
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

const MIN_OPTIONS_COUNT_WITH_MENU = 2;

export const SorterView: FC<Props> = observer(
  ({
    sortingValue,
    sortDirectionRotate,
    handleSortFieldChange,
    handleSortDirectionToggle,
    sortingValues,
    buttonDTI,
    sorterSelectDTI,
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
          data-test-id={sorterSelectDTI}
          isDisabled={sortingValues.length < MIN_OPTIONS_COUNT_WITH_MENU}
          {...props}
        />
        <Button theme="tertiary" onClick={handleSortDirectionToggle} data-test-id={buttonDTI}>
          <Sort rotation={sortDirectionRotate} />
        </Button>
      </div>
    );
  }
);
