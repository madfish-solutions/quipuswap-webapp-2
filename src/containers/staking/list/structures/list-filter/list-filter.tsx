import { FC } from 'react';

import { Input, NumberInput, Search } from '@quipuswap/ui-kit';
import cx from 'classnames';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'next-i18next';

import { Card } from '@components/ui/card';
import { Switcher } from '@components/ui/switcher';

import { Sorter } from '../../components/sorter';
import styles from './list-filter.module.scss';
import { useListFilterViewModel } from './list-filter.vm';

export const MIN_TOKEN_ID = 0;
export const MAX_TOKEN_ID = Number.MAX_SAFE_INTEGER;
export const STEP = 1;

export const ListFilter: FC = observer(() => {
  const { t } = useTranslation(['common']);
  const {
    search,
    tokenIdValue,
    isStakedOnlyDisabled,
    onSearchChange,
    onTokenIdChange,
    setStakedOnly,
    setActiveOnly,
    handleIncrement,
    handleDecrement
  } = useListFilterViewModel();

  return (
    <Card className={cx(styles.filterCard)}>
      <Input
        value={search}
        onChange={onSearchChange}
        className={styles.searchInput}
        StartAdornment={Search}
        placeholder={t('common|Search')}
        readOnly={false}
      />

      <NumberInput
        value={tokenIdValue}
        onChange={onTokenIdChange}
        className={styles.numberInput}
        placeholder={t('common|Token ID')}
        step={STEP}
        min={MIN_TOKEN_ID}
        max={MAX_TOKEN_ID}
        onIncrementClick={handleIncrement}
        onDecrementClick={handleDecrement}
      />

      <div className={styles.switcherContainer}>
        <Switcher disabled={isStakedOnlyDisabled} onChange={setStakedOnly} />
        <span>Staked Only</span>
      </div>
      <div className={styles.switcherContainer}>
        <Switcher onChange={setActiveOnly} />
        <span>Active Only</span>
      </div>
      <div className={styles.switcherContainer}>
        <Sorter menuPlacement="auto" />
      </div>
    </Card>
  );
});
