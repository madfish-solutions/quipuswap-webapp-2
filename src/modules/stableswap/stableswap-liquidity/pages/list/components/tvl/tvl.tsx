import { FC } from 'react';

import { BigNumber } from 'bignumber.js';

import { DOLLAR } from '@config/constants';
import { StateCurrencyAmount, Tooltip } from '@shared/components';
import { useTranslation } from '@translation';

import styles from './tvl.module.scss';

interface Props {
  amount: Nullable<BigNumber.Value>;
}

export const Tvl: FC<Props> = ({ amount }) => {
  const { t } = useTranslation('stableswap');

  return (
    <div className={styles.tvl}>
      <div className={styles.tvlTitle}>
        {t('stableswap|tvl')}
        <Tooltip content={t('stableswap|tvlProtocolTooltip')} />
      </div>
      <StateCurrencyAmount amount={amount} currency={DOLLAR} isLeftCurrency className={styles.amount} />
    </div>
  );
};
