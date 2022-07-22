import { BigNumber } from 'bignumber.js';

import { toReal, isExist, multipliedIfPossible } from '@shared/helpers';
import { balanceMap, mapBackendToken } from '@shared/mapping';
import { Nullable, Optional, Token, Undefined } from '@shared/types';

import {
  FarmingItem,
  FarmingStats,
  RawFarmingItem,
  RawFarmingStats,
  RawUsersInfoValue,
  UsersInfoValue
} from '../interfaces';

const DEFAULT_MAP_BN_DECIMALS = 0;
const FEES_PERCENTAGE_PRECISION = 16;

function mapRawBigNumber(raw: BigNumber.Value, decimals?: number): BigNumber;
function mapRawBigNumber(raw: Undefined<BigNumber.Value>, decimals?: number): Undefined<BigNumber>;
function mapRawBigNumber(raw: Nullable<BigNumber.Value>, decimals?: number): Nullable<BigNumber>;
function mapRawBigNumber(raw: Optional<BigNumber.Value>, decimals = DEFAULT_MAP_BN_DECIMALS): Optional<BigNumber> {
  return isExist(raw) ? toReal(new BigNumber(raw), decimals) : raw;
}

const nullableBalanceMap = (balanceAmount: Optional<string>, token: Token) => {
  if (isExist(balanceAmount)) {
    return balanceMap(new BigNumber(balanceAmount), token);
  }

  return null;
};

export const mapFarmingItem = (raw: RawFarmingItem): FarmingItem => {
  const stakedToken = mapBackendToken(raw.stakedToken);
  const rewardToken = mapBackendToken(raw.rewardToken);
  const tokens = raw.tokens.map(token => mapBackendToken(token));

  const myBalance = nullableBalanceMap(raw.myBalance, stakedToken);
  const depositBalance = nullableBalanceMap(raw.depositBalance, stakedToken);
  const earnBalance = nullableBalanceMap(raw.earnBalance, rewardToken);

  return {
    ...raw,
    staked: new BigNumber(raw.staked),
    myBalance,
    depositBalance,
    earnBalance,
    id: new BigNumber(raw.id),
    tokens,
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

export const mapFarmingItems = (rawList: RawFarmingItem[]): FarmingItem[] => rawList.map(mapFarmingItem);

export const mapFarmingStats = (raw: RawFarmingStats): FarmingStats => ({
  totalValueLocked: new BigNumber(raw.totalValueLocked),
  totalDailyReward: new BigNumber(raw.totalDailyReward),
  totalPendingReward: new BigNumber(raw.totalPendingReward),
  totalClaimedReward: new BigNumber(raw.totalClaimedReward)
});

export const mapUsersInfoValue = (raw: Nullable<RawUsersInfoValue>): Nullable<UsersInfoValue> =>
  raw && {
    ...raw,
    last_staked: new Date(raw.last_staked)
  };

export const clearFarmingItem = (farmingItem: FarmingItem) => {
  return {
    id: farmingItem.id.toFixed(),
    apr: farmingItem.apr?.toFixed(),
    tvlInStakedToken: farmingItem.tvlInStakedToken.toFixed(),
    tvlInUsd: farmingItem.tvlInUsd?.toFixed(),
    depositBalance: farmingItem.depositBalance?.toFixed(),
    earnExchangeRate: farmingItem.earnExchangeRate?.toFixed(),
    timelock: farmingItem.timelock
  };
};

export const mapFarmingLog = (farmingItem: FarmingItem, balance: BigNumber) => {
  const balanceInUsd = multipliedIfPossible(balance, farmingItem.earnExchangeRate)?.toFixed();

  return {
    ...clearFarmingItem(farmingItem),
    balance: balance.toFixed(),
    balanceInUsd
  };
};
