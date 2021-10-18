import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';

import { CandlePlotPoint, useGetTokenPlotPriceQuery } from '@graphql';
import { WhitelistedToken } from '@utils/types';
import { TEZOS_TOKEN } from '@utils/defaults';

import s from '@styles/SwapLiquidity.module.sass';

const CandleChart = dynamic(() => import('@components/charts/CandleChart'), {
  ssr: false,
});

type SwapChartProps = {
  token1:WhitelistedToken
  token2:WhitelistedToken
};

export const SwapChart: React.FC<SwapChartProps> = ({
  token1,
  token2,
}) => {
  const isTokenTez = token1.contractAddress === TEZOS_TOKEN.contractAddress ? token1 : token2;
  const { loading, data, error } = useGetTokenPlotPriceQuery({
    variables: {
      id: isTokenTez.contractAddress,
      tokenId: isTokenTez.fa2TokenId !== undefined ? `${isTokenTez.fa2TokenId}` : undefined,
    },
  });
  const loadingProp = useMemo(
    () => !(loading || !data || !data?.token) && data,
    [data, loading],
  );
  return (
    <CandleChart
      token1={token1}
      token2={token2}
      className={s.chart}
      loading={!loadingProp}
      error={error}
      data={((data && data.token ? data : null) || { token: { plotPrice: [] } })!.token
        .plotPrice as CandlePlotPoint[]}
    />
  );
};
