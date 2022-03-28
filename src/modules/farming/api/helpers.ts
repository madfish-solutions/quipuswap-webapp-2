import BigNumber from 'bignumber.js';

import { MS_IN_SECOND } from '@config';
import { mapFarmingItem } from '@shared/mapping';
import { Undefined } from '@shared/types/types';

import { FarmingContractStorage, UsersInfoKey, UsersInfoValue, RawFarmingItem, FarmingItem } from '../interfaces';

interface UserBalances {
  depositBalance: string;
  earnBalance: string;
}

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

export const getUserPendingReward = (userInfo: UsersInfoValue, item: FarmingItem) => {
  const { staked: totalStaked, rewardPerSecond } = item;

  if (totalStaked.eq(NOTHING_STAKED_VALUE)) {
    return new BigNumber('0');
  }

  const reward = new BigNumber(Math.floor((Date.now() - new Date(item.udp).getTime()) / MS_IN_SECOND)).multipliedBy(
    rewardPerSecond
  );

  const rewardPerShare = item.rewardPerShare.plus(reward.dividedBy(totalStaked));

  const pending = userInfo.earned.plus(userInfo.staked.multipliedBy(rewardPerShare)).minus(userInfo.prev_earned);

  return fromRewardPrecision(pending);
};

export const getBalances = (userInfo: Undefined<UsersInfoValue>, item: RawFarmingItem) => {
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

export const getUserFarmBalances = async (
  accountAddress: string,
  storage: FarmingContractStorage,
  list: Array<RawFarmingItem>
) => {
  const balances: Map<string, UserBalances> = new Map();

  const farmsCount = storage.farms_count;

  const farmIds = fillIndexArray(farmsCount.toNumber());

  const userInfoKeys = farmIds.map(farmId => [farmId, accountAddress] as UsersInfoKey);

  const usersInfoValuesMap = await storage.users_info.getMultipleValues(userInfoKeys);

  const usersInfoValues: Array<Undefined<UsersInfoValue>> = [];

  usersInfoValuesMap.forEach(userInfoValue => usersInfoValues.push(userInfoValue));

  for (let index = 0; index < usersInfoValues.length; index++) {
    const usersInfoValue = usersInfoValues[index];

    const farm = list.find(item => item.id === index.toString());
    if (farm) {
      const balance = getBalances(usersInfoValue, farm);

      balances.set(farm.id, balance);
    }
  }

  return balances;
};
