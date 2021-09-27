import React, {
  useContext, useState, useEffect, useMemo,
} from 'react';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';
import BigNumber from 'bignumber.js';
import { TezosToolkit } from '@taquito/taquito';

import { useGetHomeOverviewQuery } from '@graphql';
import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { fromDecimals } from '@utils/helpers';
import { getStorageInfo } from '@utils/dapp';
import { MAINNET_NETWORK, STABLE_TOKEN } from '@utils/defaults';
import { Section } from '@components/home/Section';
import { Card } from '@components/ui/Card';
import { SliderUI } from '@components/ui/Slider';

import { DashboardCard } from './DashboardCard';
import s from './DexDashboard.module.sass';

type DexDashboardProps = {
  className?: string
};

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const DexDashboard: React.FC<DexDashboardProps> = ({
  className,
}) => {
  const { t } = useTranslation(['home']);

  const { colorThemeMode } = useContext(ColorThemeContext);
  const { loading, data, error } = useGetHomeOverviewQuery();
  const [totalSupply, setTotalSupply] = useState<BigNumber>();

  useEffect(() => {
    const asyncLoad = async () => {
      // TODO: change after deploy token to testnet
      const tezos = new TezosToolkit(MAINNET_NETWORK.rpcBaseURL);
      const contract = await getStorageInfo(tezos, STABLE_TOKEN.contractAddress);
      const tokenInfo = await contract?.token_info.get(0);
      setTotalSupply(tokenInfo);
    };
    asyncLoad();
  }, []);

  const tvl = useMemo(() => fromDecimals(
    new BigNumber(data?.overview?.totalLiquidity ?? '0'), 6,
  )
    .multipliedBy(new BigNumber(data?.overview?.xtzUsdQuote ?? '0'))
    .toFixed(0), [data]);

  const volume24h = useMemo(() => fromDecimals(
    new BigNumber(data?.overview?.volume24h ?? '0'), 6,
  )
    .multipliedBy(new BigNumber(data?.overview?.xtzUsdQuote ?? '0'))
    .toFixed(0), [data]);
  const transactions24h = useMemo(() => new BigNumber(data?.overview?.trasactionsCount24h ?? '0').toString(), [data]);

  return (
    <Section
      header={t('home|DEX Dashboard')}
      description={t('home|The short overview of the most relevant DEX information.')}
      className={cx(className)}
    >
      <Card
        className={(s.mobile)}
        contentClassName={s.mobContent}
      >
        <SliderUI className={s.mobSlider}>
          <DashboardCard
            className={cx(s.card, modeClass[colorThemeMode])}
            size="extraLarge"
            volume={tvl}
            tooltip={t('home|TVL (Total Value Locked) represents the total amount of assets currently locked on a DeFi platform. In the case of a DEX it also represents the overall volume of liquidity.')}
            label={t('home|TVL')}
            currency="$"
            loading={loading || !!error}
          />
          <DashboardCard
            className={cx(s.card, modeClass[colorThemeMode])}
            size="extraLarge"
            volume={volume24h}
            tooltip={t('home|The accumulated cost of all assets traded via QuipuSwap today.')}
            label={t('home|Daily Volume')}
            currency="$"
            loading={loading || !!error}
          />
          <DashboardCard
            className={cx(s.card, modeClass[colorThemeMode])}
            size="extraLarge"
            volume={transactions24h}
            tooltip={t('home|The overall number of transactions conducted on QuipuSwap today.')}
            label={t('home|Daily Transaction')}
            loading={loading || !!error}
          />
          <DashboardCard
            className={cx(s.card, modeClass[colorThemeMode])}
            size="extraLarge"
            volume={new BigNumber(totalSupply ?? '0').toString()}
            tooltip={t('home|The current number of available QUIPU tokens.')}
            label={t('home|Total supply')}
            currency="QUIPU"
            loading={totalSupply === undefined}
          />
        </SliderUI>
      </Card>
      <Card className={s.desktop} contentClassName={s.content}>
        <DashboardCard
          className={cx(s.card, modeClass[colorThemeMode])}
          size="extraLarge"
          volume={tvl}
          tooltip={t('home|TVL (Total Value Locked) represents the total amount of assets currently locked on a DeFi platform. In the case of a DEX it also represents the overall volume of liquidity.')}
          label={t('home|TVL')}
          currency="$"
          loading={loading || !!error}
        />
        <DashboardCard
          className={cx(s.card, modeClass[colorThemeMode])}
          size="extraLarge"
          volume={volume24h}
          tooltip={t('home|The accumulated cost of all assets traded via QuipuSwap today.')}
          label={t('home|Daily Volume')}
          currency="$"
          loading={loading || !!error}
        />
        <DashboardCard
          className={cx(s.card, modeClass[colorThemeMode])}
          size="extraLarge"
          volume={transactions24h}
          tooltip={t('home|The overall number of transactions conducted on QuipuSwap today.')}
          label={t('home|Daily Transaction')}
          loading={loading || !!error}
        />
        <DashboardCard
          className={cx(s.card, modeClass[colorThemeMode])}
          size="extraLarge"
          volume={new BigNumber(totalSupply ?? '0').toString()}
          tooltip={t('home|The current number of available QUIPU tokens.')}
          label={t('home|Total supply')}
          currency="QUIPU"
          loading={totalSupply === undefined}
        />
      </Card>
    </Section>
  );
};
