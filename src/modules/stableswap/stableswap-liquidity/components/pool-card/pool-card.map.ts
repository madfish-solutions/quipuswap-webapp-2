import { BigNumber } from 'bignumber.js';

import { mapBackendToken } from '@shared/mapping';
import { Token } from '@shared/types';

import mock from './mock.json';

export const poolItemMapper = (item: typeof mock) => {
  const { tvlInUsd, tokensInfo, contractAddress, id, totalLpSupply, fees, poolContractUrl } = item;

  const readyFeeBN = {
    liquidityProvidersFee: new BigNumber(fees.liquidityProvidersFee),
    stakersFee: new BigNumber(fees.stakersFee),
    interfaceFee: new BigNumber(fees.interfaceFee),
    devFee: new BigNumber(fees.devFee)
  };

  const readyTokensInfo = tokensInfo.map(info => {
    return {
      token: mapBackendToken(info.token as Token),
      reserves: new BigNumber(info.reserves),
      exchangeRate: new BigNumber(info.exchangeRate)
    };
  });

  return {
    id: new BigNumber(id),
    tvlInUsd: new BigNumber(tvlInUsd),
    totalLpSupply: new BigNumber(totalLpSupply),
    contractAddress,
    poolContractUrl,
    tokensInfo: readyTokensInfo,
    ...readyFeeBN
  };
};
