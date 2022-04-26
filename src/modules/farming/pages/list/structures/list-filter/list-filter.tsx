import { FC } from 'react';

import cx from 'classnames';
import { observer } from 'mobx-react-lite';

import { STEP } from '@modules/farming/store';
import { Card, Input, NumberInput, Switcher } from '@shared/components';
import { Search } from '@shared/svg';

import { Sorter } from '../../components/sorter';
import styles from './list-filter.module.scss';
import { useListFilterViewModel } from './list-filter.vm';

export const MIN_TOKEN_ID = 0;
export const MAX_TOKEN_ID = Number.MAX_SAFE_INTEGER;

export const ListFilter: FC = observer(() => {
  const {
    search,
    tokenIdValue,
    activeOnly,
    stakedOnly,
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
    <Card contentClassName={styles.cardContent} className={styles.filterCard} data-test-id="listFilter">
      <Input
        value={search}
        onChange={onSearchChange}
        className={styles.searchInput}
        StartAdornment={Search}
        placeholder={inputPlaceholderTranslation}
        readOnly={false}
        data-test-id="input"
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
        data-test-id="numberInput"
      />

      <div className={cx(styles.switcherContainer, styles.switcherStakeOnly)}>
        <Switcher
          value={stakedOnly}
          disabled={isStakedOnlyDisabled}
          onClick={setStakedOnly}
          data-test-id="stakedOnlySwitcher"
        />
        <span className={styles.switcherTranslation} data-test-id="stakedOnlySwitcherTitle">
          {stakedOnlyTranslation}
        </span>
      </div>

      <div className={cx(styles.switcherContainer, styles.switcherActiveOnly)}>
        <Switcher value={activeOnly} onClick={setActiveOnly} data-test-id="activeOnlySwitcher" />
        <span className={styles.switcherTranslation} data-test-id="activeOnlySwitcherTitle">
          {activeOnlyTranslation}
        </span>
      </div>

      <div className={cx(styles.switcherContainer, styles.sorterContainer)}>
        <Sorter />
      </div>
    </Card>
  );
});
