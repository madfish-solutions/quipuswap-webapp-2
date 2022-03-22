import { FC, useContext } from 'react';

import { ColorModes, ColorThemeContext } from '@quipuswap/ui-kit';
import BigNumber from 'bignumber.js';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';

import { USD_DECIMALS } from '@app.config';
import { GobletIcon } from '@components/svg/goblet-icon';
import { Tooltip } from '@components/ui/components/tooltip';
import { StateCurrencyAmount } from '@components/ui/state-components/state-currency-amount';
import { DataTestAttribute } from '@tests/types';
import { useAccountPkh } from '@utils/dapp';
import { Nullable } from '@utils/types';

import styles from './pending-rewards.module.scss';

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

interface Props extends DataTestAttribute {
  amount: Nullable<BigNumber>;
  dollarEquivalent?: Nullable<BigNumber.Value>;
  amountDecimals?: number;
  currency: string;
  tooltip?: string;
}

export const PendingRewards: FC<Props> = ({
  amount,
  currency,
  tooltip,
  testId,
  dollarEquivalent,
  amountDecimals = USD_DECIMALS
}) => {
  const accountPkh = useAccountPkh();
  const { t } = useTranslation(['stake']);
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <div className={cx(styles.reward, modeClass[colorThemeMode])}>
      <div className={styles.container}>
        {accountPkh ? (
          <>
            <div className={styles.titleWrapper}>
              <span className={styles.title}>{t('stake|Your Pending Rewards')}</span>
              {tooltip && <Tooltip content={tooltip} />}
            </div>
            <StateCurrencyAmount
              className={styles.amount}
              amount={amount}
              currency={currency}
              dollarEquivalent={dollarEquivalent}
              amountDecimals={amountDecimals}
              isLeftCurrency={currency === '$'}
              testId={testId}
            />
          </>
        ) : (
          <span className={styles.amount}>{t('stake|Earn extra income with QuipuSwap')}</span>
        )}
      </div>
      <GobletIcon />
    </div>
  );
};
