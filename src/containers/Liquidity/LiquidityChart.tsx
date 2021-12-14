import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { findDex, FoundDex } from '@quipuswap/sdk';

import { PlotPoint, useGetPairPlotLiquidityQuery } from '@graphql';
import { QSMainNet, WhitelistedToken } from '@utils/types';
import { FACTORIES } from '@utils/defaults';
import {
  useNetwork, useTezos,
} from '@utils/dapp';

import s from '@styles/SwapLiquidity.module.sass';

const LineChart = dynamic(() => import('@components/charts/LineChart'), {
  ssr: false,
});

type ChartProps = {
  dex: FoundDex
  token1:WhitelistedToken
  token2:WhitelistedToken
};

type LiquidityChartProps = {
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
      data={!loadingProp && data ? data.pair.plotLiquidity as PlotPoint[] : []}
    />
  );
};

export const LiquidityChart: React.FC<LiquidityChartProps> = ({
  token1,
  token2,
}) => {
  const tezos = useTezos();
  const network = useNetwork();
  const networkId = network.id as QSMainNet;
  const [dex, setDex] = useState<FoundDex>();
  useEffect(() => {
    const asyncLoad = async () => {
      if (!tezos) return;
      const toAsset = {
        contract: token2.contractAddress,
        id: token2.fa2TokenId ?? undefined,
      };
      const dexbuf = await findDex(tezos!, FACTORIES[networkId], toAsset);
      setDex(dexbuf);
    };
    asyncLoad();
    // eslint-disable-next-line
  }, [token1, token2, networkId, tezos]);

  if (!dex) {
    return (
      <LineChart
        className={s.chart}
        loading
        data={[]}
      />
    );
  }
  return (
    <Chart token1={token1} token2={token2} dex={dex} />
  );
};
