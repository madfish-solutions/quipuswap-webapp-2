import { TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { getUserTokenBalance } from '@blockchain';
import { PRECISION_FACTOR, PRECISION_FACTOR_STABLESWAP_LP, SECONDS_IN_DAY, ZERO_AMOUNT_BN } from '@config/constants';
import { FARMING_CONTRACT_ADDRESS } from '@config/environment';
import { getContract, getStorageInfo } from '@shared/dapp';
import {
  calculateTimeDiffInMs,
  calculateTimeDiffInSeconds,
  defined,
  getLastElementFromArray,
  isExist,
  isNull,
  retry,
  saveBigNumber,
  toIntegerSeconds,
  toMilliseconds,
  toReal
} from '@shared/helpers';
import { Nullable, Optional, Token, Undefined } from '@shared/types';

import { BlockchainYouvesFarmingApi } from '../api/blockchain/youves-farming.api';
import {
  FarmingContractStorage,
  FarmingContractStorageWrapper,
  FarmVersion,
  IRawUsersInfoValue,
  IUsersInfoValue,
  UsersInfoKey
} from '../interfaces';
import { mapUsersInfoValue } from '../mapping';
import { FarmingItemV1Model, FarmingListItemModel } from '../models';
import { FarmingItemV1WithBalances } from '../pages/list/types';
import { YouvesFarmStakes, YouvesFarmStorage } from '../pages/youves-item/api/types';

export interface UserBalances {
  depositBalance: string;
  earnBalance: string;
}

export interface IFarmingListUsersInfoValueWithId extends IUsersInfoValue {
  id: BigNumber;
}

interface YouvesFarmRewardsStats {
  lastRewards: string;
  discFactor: BigNumber;
  vestingPeriodSeconds: BigNumber;
  staked: BigNumber;
}

export const DEFAULT_RAW_USER_INFO: IRawUsersInfoValue = {
  last_staked: new Date().toISOString(),
  staked: ZERO_AMOUNT_BN,
  earned: ZERO_AMOUNT_BN,
  claimed: ZERO_AMOUNT_BN,
  prev_earned: ZERO_AMOUNT_BN,
  prev_staked: ZERO_AMOUNT_BN,
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

export const getUserPendingRewardForFarmingV1 = (
  userInfo: IUsersInfoValue,
  farmingItemModel: FarmingListItemModel | FarmingItemV1Model,
  timestamp: number = Date.now()
) => {
  const { staked: totalStaked, rewardPerSecond } = farmingItemModel;

  if (totalStaked.eq(NOTHING_STAKED_VALUE)) {
    return ZERO_AMOUNT_BN;
  }

  const timeTo = Math.min(timestamp, new Date(farmingItemModel.endTime!).getTime());
  let reward = new BigNumber(
    toIntegerSeconds(calculateTimeDiffInMs(new Date(farmingItemModel.udp!), timeTo))
  ).multipliedBy(defined(rewardPerSecond, 'rewardPerSecond'));

  if (reward.isNegative()) {
    reward = ZERO_AMOUNT_BN;
  }

  const rewardPerShare = farmingItemModel.rewardPerShare!.plus(reward.dividedBy(totalStaked));

  const pending = userInfo.earned.plus(userInfo.staked.multipliedBy(rewardPerShare)).minus(userInfo.prev_earned);

  return fromRewardPrecision(pending);
};

export const calculateV1FarmingBalances = (
  userInfo: Undefined<IFarmingListUsersInfoValueWithId>,
  farmingItemModel: FarmingListItemModel
) => {
  if (!userInfo) {
    return {
      depositBalance: '0',
      earnBalance: '0',
      fullRewardBalance: '0'
    };
  }

  const currentReward = getUserPendingRewardForFarmingV1(userInfo, farmingItemModel);
  const fullReward = getUserPendingRewardForFarmingV1(
    userInfo,
    farmingItemModel,
    toMilliseconds(new Date(farmingItemModel.endTime!))
  );

  return {
    depositBalance: userInfo.staked.toFixed(),
    earnBalance: currentReward.toFixed(),
    fullRewardBalance: fullReward.toFixed()
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
  tezos: TezosToolkit,
  farming: FarmingListItemModel
) => {
  const wrapStorage: FarmingContractStorageWrapper = await (
    await getContract(tezos, FARMING_CONTRACT_ADDRESS)
  ).storage();
  const storage = wrapStorage.storage;

  const [userInfoValue] = await getV1FarmsUserInfo(storage, accountPkh, [new BigNumber(farming.id)]);

  return calculateV1FarmingBalances(userInfoValue, farming);
};

export const calculateYouvesFarmingRewards = (
  rewardsStats: YouvesFarmRewardsStats,
  farmVersion: FarmVersion,
  farmRewardTokenBalance: BigNumber,
  stake: Optional<YouvesFarmStakes>,
  timestampMs = Date.now()
) => {
  if (!isExist(stake)) {
    return {
      claimableReward: ZERO_AMOUNT_BN,
      fullReward: ZERO_AMOUNT_BN
    };
  }

  const { lastRewards, discFactor, staked: totalStaked, vestingPeriodSeconds } = rewardsStats;
  const precision = farmVersion === FarmVersion.v3 ? PRECISION_FACTOR_STABLESWAP_LP : PRECISION_FACTOR;
  const { stake: stakeAmount, age_timestamp: ageTimestamp, disc_factor: userDiscFactor } = stake;

  const reward = farmRewardTokenBalance.minus(lastRewards);
  // TODO: https://madfish.atlassian.net/browse/QUIPU-636
  const newDiscFactor = discFactor.plus(reward.multipliedBy(precision).dividedToIntegerBy(totalStaked));

  const stakeAge = BigNumber.min(
    calculateTimeDiffInSeconds(new Date(ageTimestamp), new Date(timestampMs)),
    vestingPeriodSeconds
  );
  const fullReward = stakeAmount.times(newDiscFactor.minus(userDiscFactor)).dividedToIntegerBy(precision);
  const claimableReward = fullReward.times(stakeAge).dividedToIntegerBy(vestingPeriodSeconds);

  return { claimableReward, fullReward };
};

export const getUserYouvesFarmingBalances = async (
  accountPkh: string,
  farming: FarmingListItemModel,
  tezos: TezosToolkit
) => {
  const farmRewardTokenBalanceBN = await retry(
    async () => await getUserTokenBalance(tezos, defined(farming.contractAddress), farming.rewardToken)
  );
  const farmRewardTokenBalance = saveBigNumber(farmRewardTokenBalanceBN, ZERO_AMOUNT_BN);

  const farmAddress = defined(farming.contractAddress);
  const { stakes } = await BlockchainYouvesFarmingApi.getStakes(farmAddress, accountPkh, tezos);
  const stake = getLastElementFromArray(stakes);

  const {
    last_rewards: lastRewards,
    disc_factor: discFactor,
    max_release_period: vestingPeriodSeconds,
    total_stake: staked
  } = await getStorageInfo<YouvesFarmStorage>(tezos, farmAddress);
  const { claimableReward, fullReward } = calculateYouvesFarmingRewards(
    { lastRewards: lastRewards.toFixed(), discFactor, vestingPeriodSeconds, staked },
    farming.version,
    farmRewardTokenBalance,
    stake
  );

  return {
    depositBalance: saveBigNumber(stake?.stake, ZERO_AMOUNT_BN).toFixed(),
    earnBalance: claimableReward.toFixed(),
    fullRewardBalance: fullReward.toFixed()
  };
};

export const getUserInfoLastStakedTime = (userInfo: Nullable<IUsersInfoValue>) =>
  userInfo ? new Date(userInfo.last_staked).getTime() : null;

export const getEndTimestamp = (
  farmingItem: Optional<FarmingListItemModel | FarmingItemV1WithBalances>,
  lastStakedTime: Nullable<number>
) =>
  isExist(lastStakedTime) && isExist(farmingItem)
    ? lastStakedTime + toMilliseconds(Number(farmingItem.timelock))
    : null;

export const getIsHarvestAvailable = (endTimestamp: Nullable<number>) =>
  endTimestamp ? endTimestamp < Date.now() : false;

export const getRealDailyDistribution = (rewardPerSecond: BigNumber, rewardToken: Token) =>
  toReal(fromRewardPrecision(rewardPerSecond).times(SECONDS_IN_DAY).integerValue(BigNumber.ROUND_DOWN), rewardToken);
