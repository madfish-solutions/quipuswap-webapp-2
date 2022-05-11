import { BigNumber } from 'bignumber.js';

import { mapBackendToken } from '@shared/mapping';

import { RawStableswapItem, StableswapItem } from '../types';

export const poolItemMapper = (item: RawStableswapItem): StableswapItem => {
  const { tvlInUsd, tokensInfo, contractAddress, id, totalLpSupply, fees, poolContractUrl, isWhitelisted } = item;

  const readyFeeBN = {
    liquidityProvidersFee: new BigNumber(fees.liquidityProvidersFee),
    stakersFee: new BigNumber(fees.stakersFee),
    interfaceFee: new BigNumber(fees.interfaceFee),
    devFee: new BigNumber(fees.devFee)
  };

  const readyTokensInfo = tokensInfo.map(info => {
    return {
      token: mapBackendToken(info.token),
      reserves: new BigNumber(info.reserves),
      exchangeRate: new BigNumber(info.exchangeRate),
      reservesInUsd: new BigNumber(info.reserves).multipliedBy(info.exchangeRate)
    };
  });

  return {
    id: new BigNumber(id),
    tvlInUsd: new BigNumber(tvlInUsd),
    totalLpSupply: new BigNumber(totalLpSupply),
    contractAddress,
    poolContractUrl,
    stableswapItemUrl: id,
    isWhitelisted,
    tokensInfo: readyTokensInfo,
    ...readyFeeBN
  };
};
