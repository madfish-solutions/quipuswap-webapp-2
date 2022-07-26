import BigNumber from 'bignumber.js';

import { toReal } from '@shared/helpers';
import { mapBackendToken } from '@shared/mapping';

import { RawStableDividendsItem, StableDividendsItem } from '../types';

export const stableDividendsItemMapper = ({
  id,
  poolId,
  apr,
  apy,
  atomicTvl,
  tokensInfo,
  stakedToken,
  isWhitelisted,
  farmContractUrl,
  contractAddress,
  stakedTokenExchangeRate
}: RawStableDividendsItem): StableDividendsItem => {
  const readyTokensInfo = tokensInfo.map(info => {
    return {
      token: mapBackendToken(info.token),
      reserves: new BigNumber(info.reserves),
      exchangeRate: new BigNumber(info.exchangeRate),
      reservesInUsd: new BigNumber(info.reserves).multipliedBy(info.exchangeRate)
    };
  });

  const readyStakedToken = mapBackendToken(stakedToken);

  return {
    isWhitelisted,
    farmContractUrl,
    contractAddress,
    id: new BigNumber(id),
    poolId: new BigNumber(poolId),
    stableDividendsItemUrl: id,
    apr: new BigNumber(apr),
    apy: new BigNumber(apy),
    tokensInfo: readyTokensInfo,
    stakedToken: readyStakedToken,
    tvl: toReal(new BigNumber(atomicTvl), readyStakedToken),
    stakedTokenExchangeRate: new BigNumber(stakedTokenExchangeRate)
  };
};
