import { BigNumber } from 'bignumber.js';

import { Token } from '@shared/types';

export interface StableswapStats {
  totalTvlInUsd: BigNumber;
}

export interface StableswapList {
  list: Array<StableswapItem>;
}

export interface StableswapItem {
  id: BigNumber;
  contractAddress: string;
  tokensInfo: Array<StableswapTokensInfo>;
  totalLpSupply: BigNumber;
  tvlInUsd: BigNumber;
  poolContractUrl: string;
  isWhitelisted: boolean;
  liquidityProvidersFee: BigNumber;
  stakersFee: BigNumber;
  interfaceFee: BigNumber;
  devFee: BigNumber;
}

export interface StableswapTokensInfo {
  reserves: BigNumber;
  reservesInUsd: BigNumber;
  token: Token;
  exchangeRate: BigNumber;
}
