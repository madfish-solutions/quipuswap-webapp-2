import BigNumber from 'bignumber.js';

import { DEFAULT_DECIMALS } from '@app.config';
import { RawStakeStats, RawStakingItem, StakeStats, StakingItem } from '@interfaces/staking.interfaces';
import { isExist, getTokensName, fromDecimals } from '@utils/helpers';
import { Token, Undefined, Nullable, Optional } from '@utils/types';

import { balanceMap } from './balance.map';

const DEFAULT_MAP_BN_DECIMALS = 0;
const FEES_PERCENTAGE_PRECISION = 16;

const mapStakingToken = (raw: Token, isLp?: boolean, newSymbol?: string): Token => ({
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

export const mapStakeItem = (raw: RawStakingItem): StakingItem => {
  const stakedToken = mapStakingToken(raw.stakedToken, Boolean(raw.tokenB), getTokensName(raw.tokenA, raw.tokenB));
  const rewardToken = mapStakingToken(raw.rewardToken);

  const myBalance = nullableBalanceMap(raw.myBalance, stakedToken);
  const depositBalance = nullableBalanceMap(raw.depositBalance, stakedToken);
  const earnBalance = nullableBalanceMap(raw.earnBalance, rewardToken);

  return {
    ...raw,
    myBalance,
    depositBalance,
    earnBalance,
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
