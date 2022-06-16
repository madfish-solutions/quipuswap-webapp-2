import { FC } from 'react';

import cx from 'classnames';

import { MAX_TOKEN_ID, MIN_TOKEN_ID, STEP } from '@config/constants';
import { Sorter } from '@modules/stableswap/components';
import { Search } from '@shared/svg';

import { Card } from '../card';
import { Input } from '../input';
import { Iterator } from '../iterator';
import { NumberInput } from '../number-input';
import { SwitcherListFilterView } from '../switcher-list-filter-view';
import styles from './list-filter.view.module.scss';

interface Props {
  search: string;
  tokenIdValue: string;
  onSearchChange: (event: React.FormEvent<HTMLInputElement>) => void;
  onTokenIdChange: (event: React.FormEvent<HTMLInputElement>) => void;
  handleIncrement: () => void;
  handleDecrement: () => void;
  translation: {
    inputPlaceholderTranslation: string;
    numberInputPlaceholderTranslation: string;
  };
  switcherData: Array<{
    value: boolean;
    onClick: (state: boolean) => void;
    disabled?: boolean;
    translation: string;
    translationClassName: string;
    className: string;
  }>;
}

export const ListFilterView: FC<Props> = ({
  search,
  tokenIdValue,
  onSearchChange,
  onTokenIdChange,
  handleIncrement,
  handleDecrement,
  translation,
  switcherData
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

      <Iterator render={SwitcherListFilterView} data={switcherData} />

      <div className={cx(styles.switcherContainer, styles.sorterContainer)}>
        <Sorter />
      </div>
    </Card>
  );
};
