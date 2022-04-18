import React, { FC, useContext } from 'react';

import BigNumber from 'bignumber.js';
import cx from 'classnames';

import { HIDE_ANALYTICS, IS_NETWORK_MAINNET } from '@config/config';
import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { calculateRateAmount, isExist } from '@shared/helpers';
import { Nullable } from '@shared/types/types';
import { DataTestAttribute } from '@tests/types';
import { useTranslation } from '@translation';

import { DashboardCard } from './dashboard-card';
import styles from './dex-dashboard.module.scss';

interface DexDashboardInnerProps extends DataTestAttribute {
  totalLiquidity: Nullable<string> | undefined;
  xtzUsdQuote: Nullable<string> | undefined;
  volume24: Nullable<string> | undefined;
  transactionsCount24h: Nullable<number> | undefined;
  totalSupply?: BigNumber;
  loading?: boolean;
}

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

export const DexDashboardInner: FC<DexDashboardInnerProps> = ({
  totalLiquidity,
  xtzUsdQuote,
  totalSupply,
  volume24,
  transactionsCount24h,
  loading = false
}) => {
  const { t } = useTranslation(['home']);

  const { colorThemeMode } = useContext(ColorThemeContext);
  const tvl = isExist(totalLiquidity) && isExist(xtzUsdQuote) ? calculateRateAmount(totalLiquidity, xtzUsdQuote) : null;
  const volume24h = isExist(volume24) && isExist(xtzUsdQuote) ? calculateRateAmount(volume24, xtzUsdQuote) : null;
  const transactions24h = transactionsCount24h?.toString() ?? null;

  return (
    <>
      {IS_NETWORK_MAINNET && !HIDE_ANALYTICS ? (
        <div data-test-id="analytics">
          <DashboardCard
            className={cx(styles.card, modeClass[colorThemeMode])}
            size="extraLarge"
            volume={tvl}
            tooltip={t(
              'home|TVL (Total Value Locked) represents the total amount of assets currently locked on a DeFi platform. In the case of a DEX it also represents the overall volume of liquidity.'
            )}
            label={t('home|TVL')}
            currency="$"
          />
          <DashboardCard
            className={cx(styles.card, modeClass[colorThemeMode])}
            size="extraLarge"
            volume={volume24h}
            tooltip={t('home|The accumulated cost of all assets traded via QuipuSwap today.')}
            label={t('home|Daily Volume')}
            currency="$"
          />
          <DashboardCard
            className={cx(styles.card, modeClass[colorThemeMode])}
            size="extraLarge"
            volume={transactions24h}
            tooltip={t('home|The overall number of transactions conducted on QuipuSwap today.')}
            label={t('home|Daily Transactions')}
          />
        </div>
      ) : null}
      <DashboardCard
        className={cx(styles.card, modeClass[colorThemeMode])}
        size="extraLarge"
        volume={totalSupply ? totalSupply.toString() : null}
        tooltip={t('home|The current number of available QUIPU tokens.')}
        label={t('home|Total supply')}
        currency="QUIPU"
        loading={totalSupply === undefined}
        testId="totalSupply"
      />
    </>
  );
};
