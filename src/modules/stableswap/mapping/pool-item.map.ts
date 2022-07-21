import { BigNumber } from 'bignumber.js';

import { mapBackendToken } from '@shared/mapping';

import { RawStableswapItem, StableswapItem } from '../types';

export const poolItemMapper = ({
  tvlInUsd,
  tokensInfo,
  contractAddress,
  id,
  poolId,
  totalLpSupply,
  fees,
  poolContractUrl,
  isWhitelisted,
  lpToken
}: RawStableswapItem): StableswapItem => {
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

  const readyLpToken = mapBackendToken(lpToken);

  return {
    id: new BigNumber(id),
    poolId: new BigNumber(poolId),
    tvlInUsd: new BigNumber(tvlInUsd),
    totalLpSupply: new BigNumber(totalLpSupply),
    contractAddress,
    poolContractUrl,
    stableswapItemUrl: id,
    isWhitelisted,
    tokensInfo: readyTokensInfo,
    lpToken: readyLpToken,
    ...readyFeeBN
  };
};
