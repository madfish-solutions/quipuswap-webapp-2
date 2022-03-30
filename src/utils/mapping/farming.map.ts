import BigNumber from 'bignumber.js';

import { DEFAULT_DECIMALS } from '@app.config';
import { RawUsersInfoValue, UsersInfoValue } from '@interfaces/farming-contract.interface';
import { RawFarmingStats, RawFarmingItem, FarmingStats, FarmingItem } from '@interfaces/farming.interfaces';
import { isExist, getTokensName, fromDecimals } from '@utils/helpers';
import { Token, Undefined, Nullable, Optional } from '@utils/types';

import { balanceMap } from './balance.map';

const DEFAULT_MAP_BN_DECIMALS = 0;
const FEES_PERCENTAGE_PRECISION = 16;

const mapFarmingToken = (raw: Token, isLp?: boolean, newSymbol?: string): Token => ({
  ...raw,
  fa2TokenId: raw.fa2TokenId === undefined ? undefined : Number(raw.fa2TokenId),
  metadata: {
    ...raw.metadata,
    decimals: isLp ? DEFAULT_DECIMALS : raw.metadata.decimals,
    symbol: newSymbol ?? raw.metadata.symbol
  }
});

function mapRawBigNumber(raw: BigNumber.Value, decimals?: number): BigNumber;
function mapRawBigNumber(raw: Undefined<BigNumber.Value>, decimals?: number): Undefined<BigNumber>;
function mapRawBigNumber(raw: Nullable<BigNumber.Value>, decimals?: number): Nullable<BigNumber>;
function mapRawBigNumber(raw: Optional<BigNumber.Value>, decimals = DEFAULT_MAP_BN_DECIMALS): Optional<BigNumber> {
  return isExist(raw) ? fromDecimals(new BigNumber(raw), decimals) : raw;
}

const nullableBalanceMap = (balanceAmount: Optional<string>, token: Token) => {
  if (isExist(balanceAmount)) {
    return balanceMap(new BigNumber(balanceAmount), token);
  }

  return null;
};

export const mapFarmingItem = (raw: RawFarmingItem): FarmingItem => {
  const stakedToken = mapFarmingToken(raw.stakedToken, Boolean(raw.tokenB), getTokensName(raw.tokenA, raw.tokenB));
  const rewardToken = mapFarmingToken(raw.rewardToken);

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
    tokenA: mapFarmingToken(raw.tokenA),
    tokenB: raw.tokenB ? mapFarmingToken(raw.tokenB) : undefined,
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

export const mapUsersInfoValues = (rawList: RawUsersInfoValue[]): UsersInfoValue[] =>
  rawList.map(mapUsersInfoValue).filter(isExist);
