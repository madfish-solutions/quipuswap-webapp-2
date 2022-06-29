import BigNumber from 'bignumber.js';

import { fromDecimals } from '@shared/helpers';
import { mapBackendToken } from '@shared/mapping';

import { RawStableDividendsItem, StableDividendsItem } from '../types';

export const farmItemMapper = (item: RawStableDividendsItem): StableDividendsItem => {
  const {
    id,
    apr,
    apy,
    atomicTvl,
    tokensInfo,
    stakedToken,
    isWhitelisted,
    farmContractUrl,
    contractAddress,
    stakedTokenExchangeRate
  } = item;

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
    stableDividendsItemUrl: id,
    apr: new BigNumber(apr),
    apy: new BigNumber(apy),
    tokensInfo: readyTokensInfo,
    stakedToken: readyStakedToken,
    tvl: fromDecimals(new BigNumber(atomicTvl), readyStakedToken),
    stakedTokenExchangeRate: new BigNumber(stakedTokenExchangeRate)
  };
};
