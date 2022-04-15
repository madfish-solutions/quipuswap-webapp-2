import { MichelsonMapKey } from '@taquito/michelson-encoder';
import { BigNumber } from 'bignumber.js';

import { MS_IN_SECOND, SECONDS_IN_DAY, NO_TIMELOCK_VALUE } from '@config/constants';
import { defined, isExist, fromDecimals } from '@shared/helpers';
import { Nullable, Token, Undefined } from '@shared/types';

import {
  UsersInfoValue,
  RawUsersInfoValue,
  FarmingItem,
  RawFarmingItem,
  FarmingContractStorage,
  UsersInfoKey
} from '../interfaces';
import { mapFarmingItem, mapUsersInfoValue } from '../mapping';

export interface UserBalances {
  depositBalance: string;
  earnBalance: string;
}

export interface UsersInfoValueWithId extends UsersInfoValue {
  id: MichelsonMapKey;
}

const ZERO = 0;

export const DEFAULT_RAW_USER_INFO: RawUsersInfoValue = {
  last_staked: new Date().toISOString(),
  staked: new BigNumber(ZERO),
  earned: new BigNumber(ZERO),
  claimed: new BigNumber(ZERO),
  prev_earned: new BigNumber(ZERO),
  prev_staked: new BigNumber(ZERO),
  allowances: []
};

export const fillIndexArray = (value: number): Array<BigNumber> => {
  const indexArray = [];
  for (let i = 0; i < value; i++) {
    indexArray[i] = new BigNumber(i);
  }

  return indexArray;
};

const NOTHING_STAKED_VALUE = 0;

export const REWARD_PRECISION = 1e18;

export const fromRewardPrecision = (reward: BigNumber) => reward.dividedToIntegerBy(new BigNumber(REWARD_PRECISION));

export const getUserPendingReward = (userInfo: UsersInfoValue, item: FarmingItem, timestamp: number = Date.now()) => {
  const { staked: totalStaked, rewardPerSecond } = item;

  if (totalStaked.eq(NOTHING_STAKED_VALUE)) {
    return new BigNumber('0');
  }

  const reward = new BigNumber(Math.floor((timestamp - new Date(item.udp).getTime()) / MS_IN_SECOND)).multipliedBy(
    rewardPerSecond
  );

  const rewardPerShare = item.rewardPerShare.plus(reward.dividedBy(totalStaked));

  const pending = userInfo.earned.plus(userInfo.staked.multipliedBy(rewardPerShare)).minus(userInfo.prev_earned);

  return fromRewardPrecision(pending);
};

export const getBalances = (userInfo: Undefined<UsersInfoValueWithId>, item: RawFarmingItem) => {
  if (!userInfo) {
    return {
      depositBalance: '0',
      earnBalance: '0'
    };
  }

  const reward = getUserPendingReward(userInfo, mapFarmingItem(item));

  return {
    depositBalance: userInfo.staked.toFixed(),
    earnBalance: reward.toFixed()
  };
};

export const getAllFarmUserInfo = async (storage: FarmingContractStorage, accountAddress: string) => {
  const farmsCount = storage.farms_count;
  const farmIds = fillIndexArray(farmsCount.toNumber());
  const userInfoKeys = farmIds.map(farmId => [farmId, accountAddress] as UsersInfoKey);
  const usersInfoValuesMap = await storage.users_info.getMultipleValues(userInfoKeys);

  const usersInfoValues: Array<UsersInfoValueWithId> = [];

  usersInfoValuesMap.forEach((userInfoValue, key) => {
    const value = defined(mapUsersInfoValue(userInfoValue ? userInfoValue : DEFAULT_RAW_USER_INFO));

    return usersInfoValues.push({ id: key, ...value });
  });

  return usersInfoValues;
};

export const getUserFarmBalances = async (
  accountAddress: string,
  storage: FarmingContractStorage,
  list: Array<RawFarmingItem>
) => {
  const userInfoValues = await getAllFarmUserInfo(storage, accountAddress);

  const balances: Map<string, UserBalances> = userInfoValues.reduce((acc, usersInfoValue, index) => {
    const farm = list.find(item => item.id === index.toString());
    if (farm) {
      const balance = getBalances(usersInfoValue, farm);

      acc.set(farm.id, balance);
    }

    return acc;
  }, new Map());

  return balances;
};

export const getUserInfoLastStakedTime = (userInfo: Nullable<UsersInfoValue>) =>
  userInfo ? new Date(userInfo.last_staked).getTime() : null;

export const getEndTimestamp = (farmingItem: FarmingItem, lastStakedTime: Nullable<number>) =>
  isExist(lastStakedTime) ? lastStakedTime + Number(farmingItem.timelock) * MS_IN_SECOND : null;

export const getIsHarvestAvailable = (endTimestamp: Nullable<number>) =>
  endTimestamp ? endTimestamp - Date.now() < Number(NO_TIMELOCK_VALUE) : false;

export const getDailyDistribution = (rewardPerSecond: BigNumber, rewardToken: Token) =>
  fromDecimals(
    fromRewardPrecision(rewardPerSecond).times(SECONDS_IN_DAY).integerValue(BigNumber.ROUND_DOWN),
    rewardToken
  );
