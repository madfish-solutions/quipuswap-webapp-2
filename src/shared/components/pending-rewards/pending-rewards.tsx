import { FC, useContext } from 'react';

import BigNumber from 'bignumber.js';
import cx from 'classnames';
import { useTranslation } from '@translation';

import { USD_DECIMALS } from '@config/config';
import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { useAccountPkh } from '@providers/use-dapp';
import { GobletIcon } from '@shared/svg';
import { Nullable } from '@shared/types';
import { DataTestAttribute } from 'tests/types';

import { StateCurrencyAmount } from '../state-components';
import { Tooltip } from '../tooltip';
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
  const { t } = useTranslation(['farm']);
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <div className={cx(styles.reward, modeClass[colorThemeMode])}>
      <div className={styles.container}>
        {accountPkh ? (
          <>
            <div className={styles.titleWrapper}>
              <span className={styles.title}>{t('farm|Your Claimable Rewards')}</span>
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
          <span className={styles.amount}>{t('farm|Earn extra income with QuipuSwap')}</span>
        )}
      </div>
      <GobletIcon />
    </div>
  );
};
