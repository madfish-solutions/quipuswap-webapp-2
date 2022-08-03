import { FC, useContext } from 'react';

import BigNumber from 'bignumber.js';
import cx from 'classnames';

import { HIDE_ANALYTICS, IS_NETWORK_MAINNET } from '@config/config';
import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { DashboardStatsInfo } from '@shared/components';
import { DashboardCard } from '@shared/components/dashboard-card';
import { calculateRealRateAmount, isExist } from '@shared/helpers';
import { Nullable } from '@shared/types/types';
import { useTranslation } from '@translation';

import styles from './dex-dashboard.module.scss';

interface DexDashboardInnerProps {
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
  const realTvl =
    isExist(totalLiquidity) && isExist(xtzUsdQuote) ? calculateRealRateAmount(totalLiquidity, xtzUsdQuote) : null;
  const realVolume24h =
    isExist(volume24) && isExist(xtzUsdQuote) ? calculateRealRateAmount(volume24, xtzUsdQuote) : null;
  const transactions24h = transactionsCount24h?.toString() ?? null;
  const totalSupplyAmount = totalSupply ? totalSupply.toString() : null;
  const isTotalSupplyExist = !isExist(totalSupply);

  return (
    <>
      {IS_NETWORK_MAINNET && !HIDE_ANALYTICS ? (
        <>
          <DashboardStatsInfo
            cards={[
              <DashboardCard
                className={cx(styles.card, modeClass[colorThemeMode])}
                size="extraLarge"
                volume={realTvl}
                tooltip={t(
                  'home|TVL (Total Value Locked) represents the total amount of assets currently locked on a DeFi platform. In the case of a DEX it also represents the overall volume of liquidity.'
                )}
                label={t('home|TVL')}
                currency="$"
                data-test-id="TVL"
              />,
              <DashboardCard
                className={cx(styles.card, modeClass[colorThemeMode])}
                size="extraLarge"
                volume={realVolume24h}
                tooltip={t('home|The accumulated cost of all assets traded via QuipuSwap today.')}
                label={t('home|Daily Volume')}
                currency="$"
                data-test-id="dailyVolume"
              />,
              <DashboardCard
                className={cx(styles.card, modeClass[colorThemeMode])}
                size="extraLarge"
                volume={transactions24h}
                tooltip={t('home|The overall number of transactions conducted on QuipuSwap today.')}
                label={t('home|Daily Transactions')}
                data-test-id="dailyTransaction"
              />,
              <DashboardCard
                className={cx(styles.card, modeClass[colorThemeMode])}
                size="extraLarge"
                volume={totalSupplyAmount}
                tooltip={t('home|The current number of available QUIPU tokens.')}
                label={t('home|Total supply')}
                currency="QUIPU"
                loading={isTotalSupplyExist}
                data-test-id="totalSupply"
              />
            ]}
          />
        </>
      ) : (
        <DashboardCard
          className={cx(styles.card, modeClass[colorThemeMode])}
          size="extraLarge"
          volume={totalSupplyAmount}
          tooltip={t('home|The current number of available QUIPU tokens.')}
          label={t('home|Total supply')}
          currency="QUIPU"
          loading={isTotalSupplyExist}
          data-test-id="totalSupply"
        />
      )}
    </>
  );
};
