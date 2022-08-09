import { BigNumber } from 'bignumber.js';

import { MS_IN_SECOND, SECONDS_IN_DAY, NO_TIMELOCK_VALUE, PERCENTAGE_100 } from '@config/constants';
import { defined, isExist, toReal } from '@shared/helpers';
import { Nullable, Token, Undefined } from '@shared/types';

import { UsersInfoValue, RawUsersInfoValue, FarmingContractStorage, UsersInfoKey } from '../interfaces';
import { mapUsersInfoValue } from '../mapping';
import { FarmingItemModel } from '../models';

export interface UserBalances {
  depositBalance: string;
  earnBalance: string;
}

export interface UsersInfoValueWithId extends UsersInfoValue {
  id: BigNumber;
}

const ZERO = 0;
const ZERO_BN = new BigNumber('0');

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

export const getUserPendingReward = (
  userInfo: UsersInfoValue,
  farmingItemModel: FarmingItemModel,
  timestamp: number = Date.now()
) => {
  const { staked: totalStaked, rewardPerSecond } = farmingItemModel;

  if (totalStaked.eq(NOTHING_STAKED_VALUE)) {
    return ZERO_BN;
  }

  const timeFrom = Math.min(timestamp, new Date(farmingItemModel.endTime).getTime());
  let reward = new BigNumber(
    Math.floor((timeFrom - new Date(farmingItemModel.udp).getTime()) / MS_IN_SECOND)
  ).multipliedBy(rewardPerSecond);

  if (reward.isNegative()) {
    reward = ZERO_BN;
  }

  const rewardPerShare = farmingItemModel.rewardPerShare.plus(reward.dividedBy(totalStaked));

  const pending = userInfo.earned.plus(userInfo.staked.multipliedBy(rewardPerShare)).minus(userInfo.prev_earned);

  return fromRewardPrecision(pending);
};

export const getUserPendingRewardWithFee = (
  userInfo: UsersInfoValue,
  item: FarmingItemModel,
  timestamp: number = Date.now()
) => {
  const fixedHarvestFee = PERCENTAGE_100.minus(item.harvestFee).dividedBy(PERCENTAGE_100);
  const pendingRewards = getUserPendingReward(userInfo, item, timestamp);

  return {
    withoutFee: pendingRewards,
    withFee: pendingRewards.multipliedBy(fixedHarvestFee)
  };
};

export const getBalances = (userInfo: Undefined<UsersInfoValueWithId>, farmingItemModel: FarmingItemModel) => {
  if (!userInfo) {
    return {
      depositBalance: '0',
      earnBalance: '0'
    };
  }

  const reward = getUserPendingReward(userInfo, farmingItemModel);

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
    const id = (key as UsersInfoKey)[0];

    return usersInfoValues.push({ id, ...value });
  });

  return usersInfoValues;
};

export const getUserFarmBalances = async (
  accountAddress: string,
  storage: FarmingContractStorage,
  list: Array<FarmingItemModel>
) => {
  const userInfoValues = await getAllFarmUserInfo(storage, accountAddress);

  const balances: Map<string, UserBalances> = userInfoValues.reduce((acc, usersInfoValue, index) => {
    const farm = list.find(item => item.id.toFixed() === index.toString());
    if (farm) {
      const balance = getBalances(usersInfoValue, farm);

      acc.set(farm.id.toFixed(), balance);
    }

    return acc;
  }, new Map<string, UserBalances>());

  return balances;
};

export const getUserInfoLastStakedTime = (userInfo: Nullable<UsersInfoValue>) =>
  userInfo ? new Date(userInfo.last_staked).getTime() : null;

export const getEndTimestamp = (farmingItem: Undefined<FarmingItemModel>, lastStakedTime: Nullable<number>) =>
  isExist(lastStakedTime) && isExist(farmingItem) ? lastStakedTime + Number(farmingItem.timelock) * MS_IN_SECOND : null;

export const getIsHarvestAvailable = (endTimestamp: Nullable<number>) =>
  endTimestamp ? endTimestamp - Date.now() < Number(NO_TIMELOCK_VALUE) : false;

export const getRealDailyDistribution = (rewardPerSecond: BigNumber, rewardToken: Token) =>
  toReal(fromRewardPrecision(rewardPerSecond).times(SECONDS_IN_DAY).integerValue(BigNumber.ROUND_DOWN), rewardToken);
