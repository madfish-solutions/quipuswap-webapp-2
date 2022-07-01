import { MichelsonMap } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { Token } from '@shared/types';

export interface StableswapStats {
  totalTvlInUsd: BigNumber;
}

export interface StableFarmStats {
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
  tvl: BigNumber;
  stakedTokenExchangeRate: BigNumber;
  apr: BigNumber;
  apy: BigNumber;
  farmContractUrl: string;
  stakedToken: Token;
  stableFarmItemUrl: string;
}

export interface RawContractStakerInfo {
  info: {
    balance: BigNumber;
    rewards: MichelsonMap<BigNumber, BigNumber>;
  };
  request: {
    user: string;
    pool_id: BigNumber;
  };
}

export interface RawStakerInfo {
  yourDeposit: BigNumber;
  yourReward: Nullable<MichelsonMap<BigNumber, BigNumber>>;
}
export interface StakerInfo {
  yourDeposit: BigNumber;
  yourEarnedInUsd: BigNumber;
}

export interface StableswapTokensInfo {
  reserves: BigNumber;
  reservesInUsd: BigNumber;
  token: Token;
  exchangeRate: BigNumber;
}
