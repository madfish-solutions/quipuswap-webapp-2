import BigNumber from 'bignumber.js';

import { StakeContractStorage, UsersInfoKey, UsersInfoValue } from '@interfaces/stake-contract.interface';
import { RawStakingItem, StakingItem } from '@interfaces/staking.interfaces';
import { toDecimals } from '@utils/helpers';
import { Undefined } from '@utils/types';

export interface UserBalances {
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

const MILISECONDS_IN_SECONDS = 1000;

export const REWARD_PRECISION = 1e18;

export const fromRewardPrecision = (reward: BigNumber) => reward.dividedToIntegerBy(new BigNumber(REWARD_PRECISION));

const NOTHING_STAKED_VALUE = 0;

export const getUserPendingReward = (userInfo: UsersInfoValue, item: RawStakingItem | StakingItem) => {
  const totalStaked =
    'staked' in item ? new BigNumber(item.staked) : toDecimals(item.tvlInStakedToken, item.rewardToken);

  if (totalStaked.eq(NOTHING_STAKED_VALUE)) {
    return new BigNumber('0');
  }

  const rewardPerSecond = new BigNumber(item.rewardPerSecond);

  const reward = new BigNumber(
    Math.floor((Date.now() - new Date(item.udp).getTime()) / MILISECONDS_IN_SECONDS)
  ).multipliedBy(rewardPerSecond);

  const rewardPerShare = new BigNumber(item.rewardPerShare).plus(reward.dividedBy(totalStaked));

  const pending = userInfo.earned.plus(userInfo.staked.multipliedBy(rewardPerShare)).minus(userInfo.prev_earned);

  return fromRewardPrecision(pending);
};

export const getBalances = (userInfo: Undefined<UsersInfoValue>, item: RawStakingItem) => {
  if (!userInfo) {
    return {
      depositBalance: '0',
      earnBalance: '0'
    };
  }

  const reward = getUserPendingReward(userInfo, item);

  return {
    depositBalance: userInfo.staked.toFixed(),
    earnBalance: reward.toFixed()
  };
};

export const getUserFarmBalances = async (
  accountAddress: string,
  storage: StakeContractStorage,
  list: Array<RawStakingItem>
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
