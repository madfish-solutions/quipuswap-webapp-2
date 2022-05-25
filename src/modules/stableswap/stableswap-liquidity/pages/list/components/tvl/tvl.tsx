import { FC } from 'react';

import { StateCurrencyAmount } from '@shared/components';
import { useTranslation } from '@translation';

import styles from './tvl.module.scss';

export const Tvl: FC = () => {
  const { t } = useTranslation('stableswap');

  return (
    <div className={styles.tvl}>
      <div className={styles.tvlTitle}>{t('stableswap|tvl')}</div>
      <StateCurrencyAmount amount={10000} currency="$" isLeftCurrency className={styles.amount} />
    </div>
  );
};
