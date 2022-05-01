import { FC } from 'react';

import cx from 'classnames';
import { observer } from 'mobx-react-lite';

import { MAX_TOKEN_ID, MIN_TOKEN_ID, STEP } from '@config/constants';
import { Sorter } from '@modules/stableswap/helpers';
import { Card, Input, NumberInput, Switcher } from '@shared/components';
import { Search } from '@shared/svg';

import styles from './list-filter.module.scss';
import { useListFilterViewModel } from './list-filter.vm';

export const ListFilter: FC = observer(() => {
  const {
    search,
    tokenIdValue,
    whitelistedOnly,
    onSearchChange,
    onTokenIdChange,
    setWhitelistedOnly,
    handleIncrement,
    handleDecrement,
    translation
  } = useListFilterViewModel();

  const { inputPlaceholderTranslation, numberInputPlaceholderTranslation, whitelistedOnlyTranslation } = translation;

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

      <div className={cx(styles.switcherContainer, styles.switcherWhitelistedOnly)}>
        <Switcher value={whitelistedOnly} onClick={setWhitelistedOnly} />
        <span className={styles.switcherTranslation}>{whitelistedOnlyTranslation}</span>
      </div>

      <div className={cx(styles.switcherContainer, styles.sorterContainer)}>
        <Sorter />
      </div>
    </Card>
  );
});
