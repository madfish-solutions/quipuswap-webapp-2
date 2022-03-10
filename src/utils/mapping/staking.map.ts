import BigNumber from 'bignumber.js';

import {
  RawStakingItem,
  RawStakeStats,
  StakingItem,
  StakeStats,
  NoUserStakingItem,
  UserStakingItem
} from '@interfaces/staking.interfaces';
import { fromDecimals, getTokensName, isExist, isUndefined } from '@utils/helpers';
import { Nullable, Optional, Token, Undefined } from '@utils/types';

import { balanceMap } from './balance.map';

const DEFAULT_DECIMALS = 0;
const FEES_PERCENTAGE_PRECISION = 16;

const mapStakingToken = (raw: Token, newSymbol?: string): Token => ({
  ...raw,
  fa2TokenId: raw.fa2TokenId === undefined ? undefined : Number(raw.fa2TokenId),
  metadata: { ...raw.metadata, symbol: newSymbol ?? raw.metadata.symbol }
});

function mapRawBigNumber(raw: BigNumber.Value, decimals?: number): BigNumber;
function mapRawBigNumber(raw: Undefined<BigNumber.Value>, decimals?: number): Undefined<BigNumber>;
function mapRawBigNumber(raw: Nullable<BigNumber.Value>, decimals?: number): Nullable<BigNumber>;
function mapRawBigNumber(raw: Optional<BigNumber.Value>, decimals = DEFAULT_DECIMALS): Optional<BigNumber> {
  return isExist(raw) ? fromDecimals(new BigNumber(raw), decimals) : raw;
}

export const mapStakeItem = (raw: RawStakingItem): StakingItem => {
  let balances: NoUserStakingItem | UserStakingItem;
  const stakedToken = mapStakingToken(raw.stakedToken, getTokensName(raw.tokenA, raw.tokenB));
  const rewardToken = mapStakingToken(raw.rewardToken);

  if (!isUndefined(raw.depositBalance) && !isUndefined(raw.earnBalance)) {
    balances = {
      myBalance: raw.myBalance ? balanceMap(new BigNumber(raw.myBalance), stakedToken) : null,
      depositBalance: balanceMap(new BigNumber(raw.depositBalance), stakedToken),
      earnBalance: balanceMap(new BigNumber(raw.earnBalance), rewardToken)
    } as UserStakingItem;
  } else {
    balances = {
      myBalance: null,
      depositBalance: null,
      earnBalance: null
    } as NoUserStakingItem;
  }

  return {
    ...raw,
    ...balances,
    id: new BigNumber(raw.id),
    tokenA: mapStakingToken(raw.tokenA),
    tokenB: raw.tokenB ? mapStakingToken(raw.tokenB) : undefined,
    stakedToken,
    rewardToken,
    tvlInUsd: mapRawBigNumber(raw.tvlInUsd),
    tvlInStakedToken: new BigNumber(raw.tvlInStakedToken),
    apr: mapRawBigNumber(raw.apr),
    apy: mapRawBigNumber(raw.apy),
    depositExchangeRate: mapRawBigNumber(raw.depositExchangeRate),
    earnExchangeRate: mapRawBigNumber(raw.earnExchangeRate),
    rewardPerShare: new BigNumber(raw.rewardPerShare),
    harvestFee: mapRawBigNumber(raw.harvestFee, FEES_PERCENTAGE_PRECISION),
    withdrawalFee: mapRawBigNumber(raw.withdrawalFee, FEES_PERCENTAGE_PRECISION),
    rewardPerSecond: mapRawBigNumber(raw.rewardPerSecond)
  };
};

export const mapStakesItems = (rawList: RawStakingItem[]): StakingItem[] => rawList.map(mapStakeItem);

export const mapStakeStats = (raw: RawStakeStats): StakeStats => ({
  totalValueLocked: new BigNumber(raw.totalValueLocked),
  totalDailyReward: new BigNumber(raw.totalDailyReward),
  totalPendingReward: new BigNumber(raw.totalPendingReward),
  totalClaimedReward: new BigNumber(raw.totalClaimedReward)
});
