import React from 'react';

import dynamic from 'next/dynamic';

import { CandlePlotPoint, useGetTokenPlotPriceQuery } from '@graphql';
import s from '@styles/SwapLiquidity.module.sass';
import { WhitelistedToken } from '@utils/types';

const CandleChart = dynamic(() => import('@components/charts/CandleChart'), {
  ssr: false
});

type SwapChartProps = {
  token1: WhitelistedToken;
  token2: WhitelistedToken;
};

export const SwapChart: React.FC<SwapChartProps> = ({ token1, token2 }) => {
  const { loading, data, error } = useGetTokenPlotPriceQuery({
    variables: {
      id: token2.contractAddress,
      tokenId: token2.fa2TokenId !== undefined ? `${token2.fa2TokenId}` : undefined
    }
  });
  const loadingProp = loading || error || !data || !data?.token;

  return (
    <CandleChart
      token1={token1}
      token2={token2}
      className={s.chart}
      loading={!!loadingProp}
      disabled
      data={!loadingProp && data ? (data.token.plotPrice as CandlePlotPoint[]) : []}
    />
  );
};
