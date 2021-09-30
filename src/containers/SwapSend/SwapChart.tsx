import React from 'react';
import dynamic from 'next/dynamic';

import { CandlePlotPoint, useGetTokenPlotPriceQuery } from '@graphql';
import { WhitelistedToken } from '@utils/types';

import s from '@styles/SwapLiquidity.module.sass';
import { TEZOS_TOKEN } from '@utils/defaults';

const CandleChart = dynamic(() => import('@components/charts/CandleChart'), {
  ssr: false,
});

type SwapChartProps = {
  token1:WhitelistedToken
  token2:WhitelistedToken
};

// @ts-ignore
const uniqBy = (a:any, key:(obj:any) => any) => {
  const seen = {};
  return a.filter((item:any) => {
    const k = key(item);
    let result = false;
    if (!Object.prototype.hasOwnProperty.call(seen, k)) {
      // @ts-ignore
      seen[k] = true;
      result = true;
    }
    return result;
  });
};

export const SwapChart: React.FC<SwapChartProps> = ({
  token1,
  token2,
}) => {
  const isTokenTez = token1.contractAddress === TEZOS_TOKEN.contractAddress;
  const { loading, data, error } = useGetTokenPlotPriceQuery({
    variables: {
      id: isTokenTez
        ? token2.contractAddress
        : token1.contractAddress,
      tokenId: isTokenTez
        ? `${token2.fa2TokenId}` ?? undefined
        : `${token1.fa2TokenId}` ?? undefined,
    },
  });
  const loadingProp = loading || !data || !data?.token;
  // console.log(data);
  // if (!loadingProp && data) {
  //   console.log(uniqBy(data.token.plotPrice, (x) => x.time) as CandlePlotPoint[]);
  // }
  return (
    <CandleChart
      token1={token1}
      token2={token2}
      className={s.chart}
      loading={!!loadingProp}
      error={error}
      data={!loadingProp && data
        ? uniqBy(data.token.plotPrice, (x) => x.time) as CandlePlotPoint[]
        : []}
    />
  );
};
