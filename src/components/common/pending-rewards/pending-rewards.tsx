import { FC, useContext } from 'react';

import { ColorModes, ColorThemeContext } from '@quipuswap/ui-kit';
import BigNumber from 'bignumber.js';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';

import { GobletIcon } from '@components/svg/goblet-icon';
import { StateCurrencyAmount } from '@components/ui/state-components/state-currency-amount';
import { useAccountPkh } from '@utils/dapp';
import { Nullable } from '@utils/types';

import styles from './pending-rewards.module.scss';

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

interface Props {
  amount: Nullable<BigNumber>;
  currency: string;
}

export const PendingRewards: FC<Props> = ({ amount, currency }) => {
  const accountPkh = useAccountPkh();
  const { t } = useTranslation(['stake']);
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <div className={cx(styles.reward, modeClass[colorThemeMode])}>
      <div className={styles.container}>
        {accountPkh ? (
          <>
            <span className={styles.title}>{t('stake|Your Pending Rewards')}</span>
            <StateCurrencyAmount
              className={styles.amount}
              amount={amount}
              currency={currency}
              isLeftCurrency={currency === '$'}
            />
          </>
        ) : (
          <span className={styles.amount}>{t('stake|You might win a lot')}</span>
        )}
      </div>
      <GobletIcon />
    </div>
  );
};
