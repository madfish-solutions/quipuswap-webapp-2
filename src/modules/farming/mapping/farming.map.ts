import { BigNumber } from 'bignumber.js';

import { isExist, multipliedIfPossible, toReal } from '@shared/helpers';
import { mapBackendToken, realBalanceMap } from '@shared/mapping';
import { Nullable, Optional, Token, Undefined } from '@shared/types';

import {
  FarmingItem,
  FarmingStats,
  RawFarmingItem,
  RawFarmingStats,
  IRawUsersInfoValue,
  IUsersInfoValue
} from '../interfaces';
import { FarmingItemV1WithBalances } from '../pages/list/types';

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
    return realBalanceMap(new BigNumber(balanceAmount), token);
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
  maxApr: new BigNumber(raw.maxApr)
});

export const mapUsersInfoValue = (raw: Nullable<IRawUsersInfoValue>): Nullable<IUsersInfoValue> =>
  raw && {
    ...raw,
    last_staked: new Date(raw.last_staked)
  };

export const clearFarmingItem = (farmingItem: FarmingItemV1WithBalances) => {
  return {
    id: farmingItem.id,
    apr: farmingItem.apr?.toFixed(),
    tvlInStakedToken: farmingItem.tvlInStakedToken.toFixed(),
    tvlInUsd: farmingItem.tvlInUsd?.toFixed(),
    depositBalance: farmingItem.depositBalance?.toFixed(),
    earnExchangeRate: farmingItem.earnExchangeRate?.toFixed(),
    timelock: farmingItem.timelock
  };
};

export const mapFarmingLog = (farmingItem: FarmingItemV1WithBalances, balance: BigNumber) => {
  const balanceInUsd = multipliedIfPossible(balance, farmingItem.earnExchangeRate)?.toFixed();

  return {
    ...clearFarmingItem(farmingItem),
    balance: balance.toFixed(),
    balanceInUsd
  };
};
