import React, { useState, useEffect } from 'react';

import { Card, SliderUI } from '@quipuswap/ui-kit';
import { TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import { Section } from '@components/home/Section';
import { useGetHomeOverviewQuery } from '@graphql';
import { getStorageInfo } from '@utils/dapp';
import { MAINNET_NETWORK, MAINNET_DEFAULT_TOKEN } from '@utils/defaults';

import s from './DexDashboard.module.sass';
import { DexDashboardInner } from './DexDashboardInner';
import { useNetwork } from '@utils/dapp';

type DexDashboardProps = {
  className?: string;
};

export const DexDashboard: React.FC<DexDashboardProps> = ({ className }) => {
  const { t } = useTranslation(['home']);
  const { loading, data, error } = useGetHomeOverviewQuery();
  const network = useNetwork();
  const [totalSupply, setTotalSupply] = useState<BigNumber>();

  useEffect(() => {
    const asyncLoad = async () => {
      // TODO: change after deploy token to testnet
      const tezos = new TezosToolkit(MAINNET_NETWORK.rpcBaseURL);
      const contract = await getStorageInfo(tezos, MAINNET_DEFAULT_TOKEN.contractAddress);
      // @ts-ignore
      const tokenInfo = await contract?.token_info.get(0);
      setTotalSupply(tokenInfo);
    };
    asyncLoad();
  }, []);

  const desktopContentClassName = network.type === 'main' ? s.content : cx(s.content, s.testnet);

  return (
    <Section
      header={t('home|DEX Dashboard')}
      description={t('home|The short overview of the most relevant DEX information.')}
      className={cx(className)}
    >
      <Card className={s.mobile} contentClassName={s.mobContent}>
        <SliderUI className={s.mobSlider}>
          <DexDashboardInner
            volume24={data?.overview?.volume24h}
            totalLiquidity={data?.overview?.totalLiquidity}
            xtzUsdQuote={data?.overview?.xtzUsdQuote}
            trasactionsCount24h={data?.overview?.trasactionsCount24h}
            totalSupply={totalSupply}
            loading={loading || !!error}
          />
        </SliderUI>
      </Card>
      <Card className={s.desktop} contentClassName={desktopContentClassName}>
        <DexDashboardInner
          volume24={data?.overview?.volume24h}
          totalLiquidity={data?.overview?.totalLiquidity}
          xtzUsdQuote={data?.overview?.xtzUsdQuote}
          trasactionsCount24h={data?.overview?.trasactionsCount24h}
          totalSupply={totalSupply}
          loading={loading || !!error}
        />
      </Card>
    </Section>
  );
};
