import { FC, useContext } from 'react';

import { NetworkType } from '@airgap/beacon-sdk';
import { BigNumber } from 'bignumber.js';
import cx from 'classnames';
import { observer } from 'mobx-react-lite';

import { USD_DECIMALS } from '@config/constants';
import { NETWORK_ID } from '@config/enviroment';
import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { StateCurrencyAmount } from '@shared/components';
import { isEqual } from '@shared/helpers';
import { useAuthStore } from '@shared/hooks';
import { GobletIcon } from '@shared/svg';
import { Nullable } from '@shared/types';
import { useTranslation } from '@translation';

import { CoinflipStatsItem } from '../coinflip-stats-item';
import styles from './your-winnings.module.scss';

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

interface Props {
  amount: Nullable<BigNumber>;
  gamesCount?: Nullable<BigNumber>;
  dollarEquivalent?: Nullable<BigNumber.Value>;
  amountDecimals?: number;
  currency: string;
  rewardTooltip: string;
  hasTokensReward: boolean;
  className?: string;
}

export const YourWinningsReward: FC<Props> = observer(
  ({
    amount,
    gamesCount,
    currency,
    dollarEquivalent,
    amountDecimals = USD_DECIMALS,
    rewardTooltip,
    hasTokensReward,
    className
  }) => {
    const { accountPkh } = useAuthStore();
    const { t } = useTranslation();
    const { colorThemeMode } = useContext(ColorThemeContext);
    const isExchangeRatesExist = isEqual(NETWORK_ID, NetworkType.MAINNET);

    return (
      <div className={cx(styles.root, modeClass[colorThemeMode], className)}>
        <div className={styles.container}>
          {accountPkh ? (
            gamesCount?.isGreaterThan('0') && hasTokensReward ? (
              <CoinflipStatsItem itemName="Your Winnings" loading={!Boolean(amount)} tooltipContent={rewardTooltip}>
                <StateCurrencyAmount
                  className={styles.amount}
                  amount={amount}
                  currency={currency}
                  dollarEquivalent={dollarEquivalent}
                  amountDecimals={amountDecimals}
                  isLeftCurrency={currency === '$'}
                  isError={!isExchangeRatesExist}
                />
              </CoinflipStatsItem>
            ) : (
              <div className={styles.alternativeTitle}>
                <div className={cx(styles.description, modeClass[colorThemeMode])}>
                  {t('coinflip|luckFavorsPersistant')}
                </div>
              </div>
            )
          ) : (
            <div className={styles.alternativeTitle}>
              <div className={styles.title}>{t('coinflip|connectWallet')}</div>
              <div className={cx(styles.description, modeClass[colorThemeMode])}>{t('coinflip|yourReward')}</div>
            </div>
          )}
        </div>
        <GobletIcon />
      </div>
    );
  }
);
