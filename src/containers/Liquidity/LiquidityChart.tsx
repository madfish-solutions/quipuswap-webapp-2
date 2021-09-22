import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { findDex, FoundDex } from '@quipuswap/sdk';

import { useGetPairPlotLiquidityQuery } from '@graphql';
import { useRouterPair } from '@hooks/useRouterPair';
import { QSMainNet, WhitelistedToken } from '@utils/types';
import { handleSearchToken } from '@utils/helpers';
import { FACTORIES, STABLE_TOKEN, TEZOS_TOKEN } from '@utils/defaults';
import {
  useNetwork, useSearchCustomTokens, useTezos, useTokens,
} from '@utils/dapp';
import { LineChartSampleData } from '@components/charts/content';

import s from '@styles/SwapLiquidity.module.sass';

const LineChart = dynamic(() => import('@components/charts/LineChart'), {
  ssr: false,
});

type ChartProps = {
  dex: FoundDex
  token1:WhitelistedToken
  token2:WhitelistedToken
};

const Chart : React.FC<ChartProps> = ({ dex, token1, token2 }) => {
  const { loading, data, error } = useGetPairPlotLiquidityQuery({
    variables: {
      id: dex.contract.address,
    },
  });
  const loadingProp = loading || error || !data || !data?.pair;
  return (
    <LineChart
      token1={token1}
      token2={token2}
      className={s.chart}
      loading={!!loadingProp}
      data={!loadingProp && data ? data.pair.plotLiquidity : LineChartSampleData}
    />
  );
};

export const LiquidityChart: React.FC = () => {
  const router = useRouter();
  const tezos = useTezos();
  const network = useNetwork();
  const searchCustomToken = useSearchCustomTokens();
  const networkId = network.id as QSMainNet;
  const { data: tokens } = useTokens();
  const [initialLoad, setInitialLoad] = useState<boolean>(false);
  const [urlLoaded, setUrlLoaded] = useState<boolean>(true);
  const [dex, setDex] = useState<FoundDex>();
  const [[token1, token2], setTokens] = useState<WhitelistedToken[]>([TEZOS_TOKEN, STABLE_TOKEN]);
  const { from, to } = useRouterPair({
    page: `liquidity/${router.query.method}`,
    urlLoaded,
    initialLoad,
    token1,
    token2,
  });
  useEffect(() => {
    if (from && to && !initialLoad && tokens.length > 0) {
      handleSearchToken({
        tokens,
        tezos: tezos!,
        network,
        from,
        to,
        fixTokenFrom: TEZOS_TOKEN,
        setInitialLoad,
        setUrlLoaded,
        setTokens,
        setTokenPair: () => {},
        searchCustomToken,
        handleTokenChangeWrapper: async () => {
          if (!tezos) return;
          const toAsset = {
            contract: token2.contractAddress,
            id: token2.fa2TokenId ?? undefined,
          };
          const dexbuf = await findDex(tezos!, FACTORIES[networkId], toAsset);
          setDex(dexbuf);
        },
      });
    }
  }, [from, to, initialLoad, tokens, networkId]);

  if (!dex) {
    return (
      <LineChart
        className={s.chart}
        loading
        data={LineChartSampleData}
      />
    );
  }
  return (
    <Chart token1={token1} token2={token2} dex={dex} />
  );
};
