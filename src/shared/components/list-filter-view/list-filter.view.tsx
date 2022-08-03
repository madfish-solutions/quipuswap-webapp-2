import { FC, FormEvent } from 'react';

import cx from 'classnames';

import { MAX_TOKEN_ID, MIN_TOKEN_ID, STEP } from '@config/constants';
import { Search } from '@shared/svg';

import { Card } from '../card';
import { Input } from '../input';
import { Iterator } from '../iterator';
import { NumberInput } from '../number-input';
import { SorterProps, SorterView } from '../sorter-view';
import { SwitcherLabel, SwitcherLabelProps } from '../switcher-list-filter-view';
import styles from './list-filter.view.module.scss';

interface InputPlaceholder {
  inputPlaceholderTranslation: string;
  numberInputPlaceholderTranslation: string;
}

interface InputDTI {
  searchInputDTI: string;
  numberInputDTI: string;
}

export interface ListFilterViewProps {
  search: string;
  tokenIdValue: string;
  onSearchChange: (event: FormEvent<HTMLInputElement>) => void;
  onTokenIdChange: (event: FormEvent<HTMLInputElement>) => void;
  handleIncrement: () => void;
  handleDecrement: () => void;
  translation: InputPlaceholder;
  switcherDataList: Array<SwitcherLabelProps>;
  sorterProps: SorterProps;
  inputDTI: InputDTI;
}

export const ListFilterView: FC<ListFilterViewProps> = ({
  search,
  tokenIdValue,
  onSearchChange,
  onTokenIdChange,
  handleIncrement,
  handleDecrement,
  translation,
  sorterProps,
  switcherDataList,
  inputDTI
}) => {
  const { inputPlaceholderTranslation, numberInputPlaceholderTranslation } = translation;
  const { searchInputDTI, numberInputDTI } = inputDTI;

  return (
    <Card contentClassName={styles.cardContent} className={styles.filterCard} data-test-id="ListFilterView">
      <Input
        value={search}
        onChange={onSearchChange}
        className={styles.searchInput}
        StartAdornment={Search}
        placeholder={inputPlaceholderTranslation}
        readOnly={false}
        data-test-id={searchInputDTI}
      />

      <NumberInput
        value={tokenIdValue}
        onChange={onTokenIdChange}
        className={styles.numberInput}
        placeholder={numberInputPlaceholderTranslation}
        step={STEP}
        min={MIN_TOKEN_ID}
        max={MAX_TOKEN_ID}
        onIncrementClick={handleIncrement}
        onDecrementClick={handleDecrement}
        data-test-id={numberInputDTI}
      />

      <Iterator render={SwitcherLabel} data={switcherDataList} />

      <div className={cx(styles.switcherContainer, styles.sorterContainer)}>
        <SorterView {...sorterProps} />
      </div>
    </Card>
  );
};
