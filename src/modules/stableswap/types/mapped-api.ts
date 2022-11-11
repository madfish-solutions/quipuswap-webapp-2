import { MichelsonMap } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { Nullable, Token } from '@shared/types';

import { Opportunity } from './opportunities.interface';

export interface StableswapStats {
  totalTvlInUsd: BigNumber;
}

export interface StableDividendsStats {
  totalTvlInUsd: BigNumber;
}

export interface StableswapList {
  list: Array<StableswapItem>;
}

interface AbstractStableItem {
  id: BigNumber;
  poolId: BigNumber;
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

export interface Fees {
  liquidityProvidersFee: BigNumber;
  stakersFee: BigNumber;
  interfaceFee: BigNumber;
  devFee: BigNumber;
}

export interface StableswapItemNew extends AbstractStableItem {
  totalLpSupply: BigNumber;
  tvlInUsd: BigNumber;
  poolContractUrl: string;
  fees: Fees;
  lpToken: Token;
  opportunities?: Array<Opportunity>;
}

export interface StableDividendsItem extends AbstractStableItem {
  tvl: BigNumber;
  stakedTokenExchangeRate: BigNumber;
  apr: BigNumber;
  aprOneWeek: BigNumber;
  aprOneMonth: BigNumber;
  aprOneQuarter: BigNumber;
  apy: BigNumber;
  farmContractUrl: string;
  stakedToken: Token;
  stableDividendsItemUrl: string;
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
