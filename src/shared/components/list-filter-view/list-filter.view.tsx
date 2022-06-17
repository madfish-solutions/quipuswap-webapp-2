import { FC, FormEvent } from 'react';

import cx from 'classnames';

import { MAX_TOKEN_ID, MIN_TOKEN_ID, STEP } from '@config/constants';
import { Sorter } from '@modules/stableswap/components';
import { Search } from '@shared/svg';

import { Card } from '../card';
import { Input } from '../input';
import { Iterator } from '../iterator';
import { NumberInput } from '../number-input';
import { SwitcherLabel, SwitcherLabelProps } from '../switcher-list-filter-view';
import styles from './list-filter.view.module.scss';

interface InputPlaceholder {
  inputPlaceholderTranslation: string;
  numberInputPlaceholderTranslation: string;
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
}

export const ListFilterView: FC<ListFilterViewProps> = ({
  search,
  tokenIdValue,
  onSearchChange,
  onTokenIdChange,
  handleIncrement,
  handleDecrement,
  translation,
  switcherDataList
}) => {
  const { inputPlaceholderTranslation, numberInputPlaceholderTranslation } = translation;

  return (
    <Card contentClassName={styles.cardContent} className={styles.filterCard}>
      <Input
        value={search}
        onChange={onSearchChange}
        className={styles.searchInput}
        StartAdornment={Search}
        placeholder={inputPlaceholderTranslation}
        readOnly={false}
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
      />

      <Iterator render={SwitcherLabel} data={switcherDataList} />

      <div className={cx(styles.switcherContainer, styles.sorterContainer)}>
        <Sorter />
      </div>
    </Card>
  );
};
