import BigNumber from 'bignumber.js';

import { mapBackendToken } from '@shared/mapping';

import { RawStableFarmItem, StableFarmItem } from '../types';

export const farmItemMapper = (item: RawStableFarmItem): StableFarmItem => {
  const {
    id,
    contractAddress,
    tokensInfo,
    atomicTvl,
    stakedTokenExchangeRate,
    apr,
    apy,
    farmContractUrl,
    isWhitelisted,
    stakedToken
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
    stableFarmItemUrl: id,
    apr: new BigNumber(apr),
    apy: new BigNumber(apy),
    tokensInfo: readyTokensInfo,
    stakedToken: readyStakedToken,
    atomicTvl: new BigNumber(atomicTvl),
    stakedTokenExchangeRate: new BigNumber(stakedTokenExchangeRate)
  };
};
