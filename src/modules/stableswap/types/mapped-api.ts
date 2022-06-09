import { BigNumber } from 'bignumber.js';

import { Token } from '@shared/types';

export interface StableswapStats {
  totalTvlInUsd: BigNumber;
}

export interface StableswapList {
  list: Array<StableswapItem>;
}

interface AbstractStableItem {
  id: BigNumber;
  contractAddress: string;
  tokensInfo: Array<StableswapTokensInfo>;
  isWhitelisted: boolean;
}

export interface StableswapItem extends AbstractStableItem {
  totalLpSupply: BigNumber;
  tvlInUsd: BigNumber;
  poolContractUrl: string;
  stableswapItemUrl: string;
  liquidityProvidersFee: BigNumber;
  stakersFee: BigNumber;
  interfaceFee: BigNumber;
  devFee: BigNumber;
  lpToken: Token;
}

export interface StableFarmItem extends AbstractStableItem {
  atomicTvl: BigNumber;
  stakedTokenExchangeRate: BigNumber;
  apr: BigNumber;
  apy: BigNumber;
  farmContractUrl: string;
  stakedToken: Token;
  stableFarmItemUrl: string;
}

export interface StakerInfo {
  yourDeposit: Nullable<BigNumber>;
  yourEarned: Nullable<BigNumber>;
}

export interface StableswapTokensInfo {
  reserves: BigNumber;
  reservesInUsd: BigNumber;
  token: Token;
  exchangeRate: BigNumber;
}
