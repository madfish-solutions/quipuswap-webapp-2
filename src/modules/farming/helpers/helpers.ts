import { TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import {
  MS_IN_SECOND,
  NO_TIMELOCK_VALUE,
  PRECISION_FACTOR,
  PRECISION_FACTOR_STABLESWAP_LP,
  SECONDS_IN_DAY,
  ZERO_AMOUNT_BN
} from '@config/constants';
import { getStorageInfo } from '@shared/dapp';
import { defined, getLastElementFromArray, isExist, isNull, toReal } from '@shared/helpers';
import { Nullable, Optional, Token, Undefined } from '@shared/types';

import { BlockchainYouvesFarmingApi } from '../api/blockchain/youves-farming.api';
import { FarmingContractStorage, FarmVersion, IRawUsersInfoValue, IUsersInfoValue, UsersInfoKey } from '../interfaces';
import { mapUsersInfoValue } from '../mapping';
import { FarmingItemV1Model, FarmingListItemModel } from '../models';
import { FarmingItemV1WithBalances } from '../pages/list/types';
import { YouvesFarmStakes, YouvesFarmStorage } from '../pages/youves-item/api/types';
import { getRewards } from '../pages/youves-item/helpers';

export interface UserBalances {
  depositBalance: string;
  earnBalance: string;
}

export interface IFarmingListUsersInfoValueWithId extends IUsersInfoValue {
  id: BigNumber;
}

const ZERO = 0;
const ZERO_BN = new BigNumber('0');

export const DEFAULT_RAW_USER_INFO: IRawUsersInfoValue = {
  last_staked: new Date().toISOString(),
  staked: new BigNumber(ZERO),
  earned: new BigNumber(ZERO),
  claimed: new BigNumber(ZERO),
  prev_earned: new BigNumber(ZERO),
  prev_staked: new BigNumber(ZERO),
  allowances: []
};

export const DEFAULT_YOUVES_FARM_STAKE = {
  stake: ZERO_AMOUNT_BN,
  disc_factor: ZERO_AMOUNT_BN,
  age_timestamp: new Date()
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

export const getUserPendingRewardForFarmingV1 = (
  userInfo: IUsersInfoValue,
  farmingItemModel: FarmingItemV1Model,
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

export const getUserPendingReward = (
  userInfo: IUsersInfoValue,
  farmingItemModel: FarmingListItemModel,
  timestamp: number = Date.now()
) => {
  const { staked: totalStaked, rewardPerSecond } = farmingItemModel;

  if (totalStaked.eq(NOTHING_STAKED_VALUE)) {
    return ZERO_BN;
  }

  const timeFrom = Math.min(timestamp, new Date(farmingItemModel.endTime!).getTime());
  let reward = new BigNumber(
    Math.floor((timeFrom - new Date(farmingItemModel.udp!).getTime()) / MS_IN_SECOND)
  ).multipliedBy(defined(rewardPerSecond, 'rewardPerSecond'));

  if (reward.isNegative()) {
    reward = ZERO_BN;
  }

  const rewardPerShare = farmingItemModel.rewardPerShare!.plus(reward.dividedBy(totalStaked));

  const pending = userInfo.earned.plus(userInfo.staked.multipliedBy(rewardPerShare)).minus(userInfo.prev_earned);

  return fromRewardPrecision(pending);
};

export const getBalancesNew = (
  userInfo: Undefined<IFarmingListUsersInfoValueWithId>,
  farmingItemModel: FarmingListItemModel
) => {
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

export const getV1FarmsUserInfo = async (
  storage: FarmingContractStorage,
  accountAddress: string,
  farmsWithBalanceIds: Nullable<Array<BigNumber>> = null
) => {
  const farmsIds = isNull(farmsWithBalanceIds) ? fillIndexArray(storage.farms_count.toNumber()) : farmsWithBalanceIds;

  const userInfoKeys = farmsIds.map(farmId => [farmId, accountAddress] as UsersInfoKey);
  const usersInfoValuesMap = await storage.users_info.getMultipleValues(userInfoKeys);

  const usersInfoValues: Array<IFarmingListUsersInfoValueWithId> = [];

  usersInfoValuesMap.forEach((userInfoValue, key) => {
    const value = defined(mapUsersInfoValue(userInfoValue ? userInfoValue : DEFAULT_RAW_USER_INFO));
    const id = (key as UsersInfoKey)[0];

    return usersInfoValues.push({ id, ...value });
  });

  return usersInfoValues;
};

export const getUserV1FarmingBalances = async (
  accountPkh: string,
  storage: FarmingContractStorage,
  farming: FarmingListItemModel
) => {
  const [userInfoValue] = await getV1FarmsUserInfo(storage, accountPkh, [new BigNumber(farming.id)]);

  return getBalancesNew(userInfoValue, farming);
};

export const getYouvesFarmingRewards = (
  farming: FarmingListItemModel,
  farmRewardTokenBalance: BigNumber,
  storage: YouvesFarmStorage,
  stake: YouvesFarmStakes
) => {
  const { last_rewards, disc_factor, total_stake, max_release_period } = storage;
  const precision = farming.version === FarmVersion.v3 ? PRECISION_FACTOR_STABLESWAP_LP : PRECISION_FACTOR;

  const reward = farmRewardTokenBalance.minus(last_rewards);
  const newDiscFactor = disc_factor.plus(reward.multipliedBy(precision).dividedToIntegerBy(total_stake));

  return getRewards(stake, max_release_period, newDiscFactor, precision);
};

export const getUserYouvesFarmingBalances = async (
  accountPkh: string,
  farming: FarmingListItemModel,
  farmRewardTokenBalance: BigNumber,
  tezos: TezosToolkit
) => {
  const farmAddress = defined(farming.contractAddress);
  const { stakes } = await BlockchainYouvesFarmingApi.getStakes(farmAddress, accountPkh, tezos);
  const stake = getLastElementFromArray(stakes) ?? DEFAULT_YOUVES_FARM_STAKE;

  if (stake.stake.isZero()) {
    return {
      depositBalance: '0',
      earnBalance: '0'
    };
  }

  const storage = await getStorageInfo<YouvesFarmStorage>(tezos, farmAddress);
  const { claimableReward } = getYouvesFarmingRewards(farming, farmRewardTokenBalance, storage, stake);

  return {
    depositBalance: stake.stake.toFixed(),
    earnBalance: claimableReward.toFixed()
  };
};

export const getUserInfoLastStakedTime = (userInfo: Nullable<IUsersInfoValue>) =>
  userInfo ? new Date(userInfo.last_staked).getTime() : null;

export const getEndTimestamp = (
  farmingItem: Optional<FarmingListItemModel | FarmingItemV1WithBalances>,
  lastStakedTime: Nullable<number>
) =>
  isExist(lastStakedTime) && isExist(farmingItem) ? lastStakedTime + Number(farmingItem.timelock) * MS_IN_SECOND : null;

export const getIsHarvestAvailable = (endTimestamp: Nullable<number>) =>
  endTimestamp ? endTimestamp - Date.now() < Number(NO_TIMELOCK_VALUE) : false;

export const getRealDailyDistribution = (rewardPerSecond: BigNumber, rewardToken: Token) =>
  toReal(fromRewardPrecision(rewardPerSecond).times(SECONDS_IN_DAY).integerValue(BigNumber.ROUND_DOWN), rewardToken);
