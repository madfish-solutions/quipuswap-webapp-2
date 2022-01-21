import React, { useContext } from 'react';

import { ColorModes, ColorThemeContext } from '@quipuswap/ui-kit';
import BigNumber from 'bignumber.js';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';

import { NETWORK } from '@app.config';
import { Maybe } from '@graphql';
import { calculateRateAmount, isExist } from '@utils/helpers';
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

  const { colorThemeMode } = useContext(ColorThemeContext);
  const tvl = isExist(totalLiquidity) && isExist(xtzUsdQuote) ? calculateRateAmount(totalLiquidity, xtzUsdQuote) : null;
  const volume24h = isExist(volume24) && isExist(xtzUsdQuote) ? calculateRateAmount(volume24, xtzUsdQuote) : null;
  const transactions24h = trasactionsCount24h?.toString() ?? null;

  return (
    <>
      {NETWORK.type === QSNetworkType.MAIN ? (
        <>
          <DashboardCard
            className={cx(s.card, modeClass[colorThemeMode])}
            size="extraLarge"
            volume={tvl}
            tooltip={t(
              'home|TVL (Total Value Locked) represents the total amount of assets currently locked on a DeFi platform. In the case of a DEX it also represents the overall volume of liquidity.'
            )}
            label={t('home|TVL')}
            currency="$"
          />
          <DashboardCard
            className={cx(s.card, modeClass[colorThemeMode])}
            size="extraLarge"
            volume={volume24h}
            tooltip={t('home|The accumulated cost of all assets traded via QuipuSwap today.')}
            label={t('home|Daily Volume')}
            currency="$"
          />
          <DashboardCard
            className={cx(s.card, modeClass[colorThemeMode])}
            size="extraLarge"
            volume={transactions24h}
            tooltip={t('home|The overall number of transactions conducted on QuipuSwap today.')}
            label={t('home|Daily Transaction')}
          />
        </>
      ) : null}
      <DashboardCard
        className={cx(s.card, modeClass[colorThemeMode])}
        size="extraLarge"
        volume={totalSupply ? totalSupply.toString() : null}
        tooltip={t('home|The current number of available QUIPU tokens.')}
        label={t('home|Total supply')}
        currency="QUIPU"
        loading={totalSupply === undefined}
      />
    </>
  );
};
