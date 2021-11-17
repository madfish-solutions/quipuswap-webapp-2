import React, {
  useState,
  useEffect,
} from 'react';
import { TezosToolkit } from '@taquito/taquito';
import { useTranslation } from 'next-i18next';
import { Card, SliderUI } from '@quipuswap/ui-kit';
import BigNumber from 'bignumber.js';
import cx from 'classnames';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import { useGetHomeOverviewQuery } from '@graphql';
import { MAINNET_NETWORK, STABLE_TOKEN } from '@utils/defaults';
import { getStorageInfo } from '@utils/dapp';
import { Section } from '@components/home/Section';

import s from './DexDashboard.module.sass';
import { DexDashboardInner } from './DexDashboardInner';

type DexDashboardProps = {
  className?: string
};

export const DexDashboard: React.FC<DexDashboardProps> = ({
  className,
}) => {
  const { t } = useTranslation(['home']);
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
        <>
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
        </>
      </Card>
      <Card className={s.desktop} contentClassName={s.content}>
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
