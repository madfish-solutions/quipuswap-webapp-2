import React, {
  useState, useEffect,
} from 'react';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';
import BigNumber from 'bignumber.js';
import { TezosToolkit } from '@taquito/taquito';
import { Card } from '@madfish-solutions/quipu-ui-kit';

import { useGetHomeOverviewQuery } from '@graphql';
import { getStorageInfo } from '@utils/dapp';
import { MAINNET_NETWORK, STABLE_TOKEN } from '@utils/defaults';
import { Section } from '@components/home/Section';
import { SliderUI } from '@components/ui/Slider';

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
