import BigNumber from 'bignumber.js';

import { Nullable } from '@utils/types';

export interface ExchangeRateEntry {
  tokenAddress?: string;
  tokenId?: number;
  exchangeRate: string;
}

export interface Token {
  address: string;
  tokenId?: BigNumber;
}

export enum Standard {
  Fa12 = 'FA12',
  Fa2 = 'FA2'
}

export interface TokenMetadata {
  decimals: number;
  symbol: string;
  name: string;
  thumbnailUri: string;
}

export interface TokenMetadataResponse {
  token_id?: string;
  name: string;
  symbol: string;
  decimals: number;
  thumbnailUri: string;
}

export interface FrontendToken {
  type: Standard;
  contractAddress: string;
  fa2TokenId?: number;
  isWhitelisted: Nullable<boolean>;
  metadata: TokenMetadata;
}

export interface StakeStats {
  totalValueLocked: string;
  totalDeilyReward: string;
  totalPendingReward: string;
  totalClaimedReward: string;
}

export enum eStakeStatus {
  ACTIVE = 'ACTIVE',
  PENDING = 'PENDING',
  DISABLED = 'DISABLED'
}

export interface StakeItem {
  id: string;
  tokenA: FrontendToken;
  tokenB: FrontendToken;
  stakeStatus: eStakeStatus;
  rewardToken: FrontendToken;
  tvl: string;
  apr: number;
  apy: number;
  depositExhangeRate: string;
  earnExhangeRate: string;
}
