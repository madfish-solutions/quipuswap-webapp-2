import { FC } from 'react';

import { Input, NumberInput, Search } from '@quipuswap/ui-kit';
import cx from 'classnames';
import { observer } from 'mobx-react-lite';

import { Card } from '@components/ui/card';
import { Switcher } from '@components/ui/switcher';

import { Sorter } from '../../components/sorter';
import styles from './list-filter.module.scss';
import { useListFilterViewModel } from './list-filter.vm';

export const MIN_TOKEN_ID = 0;
export const MAX_TOKEN_ID = Number.MAX_SAFE_INTEGER;
export const STEP = 1;

export const ListFilter: FC = observer(() => {
  const {
    search,
    tokenIdValue,
    isStakedOnlyDisabled,
    onSearchChange,
    onTokenIdChange,
    setStakedOnly,
    setActiveOnly,
    handleIncrement,
    handleDecrement,
    translation
  } = useListFilterViewModel();

  const {
    inputPlaceholderTranslation,
    numberInputPlaceholderTranslation,
    stakedOnlyTranslation,
    activeOnlyTranslation
  } = translation;

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

      <div className={cx(styles.switcherContainer, styles.switcherStakeOnly)}>
        <Switcher disabled={isStakedOnlyDisabled} onChange={setStakedOnly} />
        <span className={styles.switcherTranslation}>{stakedOnlyTranslation}</span>
      </div>
      <div className={cx(styles.switcherContainer, styles.switcherActiveOnly)}>
        <Switcher onChange={setActiveOnly} />
        <span className={styles.switcherTranslation}>{activeOnlyTranslation}</span>
      </div>
      <div className={cx(styles.switcherContainer, styles.sorterContainer)}>
        <Sorter />
      </div>
    </Card>
  );
});
