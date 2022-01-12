import React, { useContext, useMemo } from 'react';

import { ColorModes, ColorThemeContext } from '@quipuswap/ui-kit';
import BigNumber from 'bignumber.js';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';

import { Maybe } from '@graphql';
import { useNetwork } from '@utils/dapp';
import { FormatNumber } from '@utils/formatNumber';
import { fromDecimals } from '@utils/helpers';
import { QSNetworkType } from '@utils/types';

import { DashboardCard } from './DashboardCard';
import s from './DexDashboard.module.sass';

interface DexDashboardInnerProps {
  totalLiquidity: Maybe<string> | undefined;
  xtzUsdQuote: Maybe<string> | undefined;
  volume24: Maybe<string> | undefined;
  trasactionsCount24h: number | undefined;
  totalSupply?: BigNumber;
  loading?: boolean;
}

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark
};

export const DexDashboardInner: React.FC<DexDashboardInnerProps> = ({
  totalLiquidity,
  xtzUsdQuote,
  totalSupply,
  volume24,
  trasactionsCount24h,
  loading = false
}) => {
  const { t } = useTranslation(['home']);
  const network = useNetwork();

  const { colorThemeMode } = useContext(ColorThemeContext);
  const tvl: string = useMemo(
    () =>
      loading
        ? '0'
        : fromDecimals(new BigNumber(totalLiquidity ?? '0'), 6)
            .multipliedBy(new BigNumber(xtzUsdQuote ?? '0'))
            .toFixed(0),
    [totalLiquidity, xtzUsdQuote, loading]
  );

  const volume24h: string = useMemo(
    () =>
      loading
        ? '0'
        : fromDecimals(new BigNumber(volume24 ?? '0'), 6)
            .multipliedBy(new BigNumber(xtzUsdQuote ?? '0'))
            .toFixed(0),
    [xtzUsdQuote, loading, volume24]
  );
  const transactions24h: string = useMemo(
    () => (loading ? '0' : new BigNumber(trasactionsCount24h ?? '0').toString()),
    [trasactionsCount24h, loading]
  );

  return (
    <>
      {network.type === QSNetworkType.MAIN ? (
        <>
          <DashboardCard
            className={cx(s.card, modeClass[colorThemeMode])}
            size="extraLarge"
            volume={FormatNumber(tvl)}
            tooltip={t(
              'home|TVL (Total Value Locked) represents the total amount of assets currently locked on a DeFi platform. In the case of a DEX it also represents the overall volume of liquidity.'
            )}
            label={t('home|TVL')}
            currency="$"
            loading={loading}
          />
          <DashboardCard
            className={cx(s.card, modeClass[colorThemeMode])}
            size="extraLarge"
            volume={FormatNumber(volume24h)}
            tooltip={t('home|The accumulated cost of all assets traded via QuipuSwap today.')}
            label={t('home|Daily Volume')}
            currency="$"
            loading={loading}
          />
          <DashboardCard
            className={cx(s.card, modeClass[colorThemeMode])}
            size="extraLarge"
            volume={FormatNumber(transactions24h)}
            tooltip={t('home|The overall number of transactions conducted on QuipuSwap today.')}
            label={t('home|Daily Transaction')}
          />
        </>
      ) : null}
      <DashboardCard
        className={cx(s.card, modeClass[colorThemeMode])}
        size="extraLarge"
        volume={FormatNumber(new BigNumber(totalSupply ?? '0').toNumber())}
        tooltip={t('home|The current number of available QUIPU tokens.')}
        label={t('home|Total supply')}
        currency="QUIPU"
        loading={totalSupply === undefined}
      />
    </>
  );
};
