import BigNumber from 'bignumber.js';

import { StakeContractStorage, UsersInfoKey, UsersInfoValue } from '@interfaces/stake-contract.interface';
import { RawStakingItem } from '@interfaces/staking.interfaces';
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

export const fromRewardPrecision = (reward: BigNumber) => reward.div(new BigNumber(REWARD_PRECISION));

const isZeroString = (string: string) => string === '0';

const getUserPendingReward = (userInfo: UsersInfoValue, item: RawStakingItem) => {
  if (isZeroString(item.staked)) {
    return new BigNumber('0');
  }

  const rewardPerSecond = new BigNumber(item.rewardPerSecond);

  const reward = new BigNumber(
    Math.floor((Date.now() - new Date(item.udp).getTime()) / MILISECONDS_IN_SECONDS)
  ).multipliedBy(rewardPerSecond);

  const rewardPerShare = new BigNumber(item.rewardPerShare).plus(reward.dividedBy(item.staked));

  const pending = userInfo.earned.plus(userInfo.staked.multipliedBy(rewardPerShare)).minus(userInfo.prev_earned);

  return fromRewardPrecision(pending);
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
      if (!usersInfoValue) {
        balances.set(farm.id, {
          depositBalance: '0',
          earnBalance: '0'
        });

        continue;
      }

      const reward = getUserPendingReward(usersInfoValue, farm);

      balances.set(farm.id, {
        depositBalance: usersInfoValue.staked.toFixed(),
        earnBalance: reward.toFixed()
      });
    }
  }

  return balances;
};
