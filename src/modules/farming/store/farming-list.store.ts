/* eslint-disable no-console */
import { BigNumber } from 'bignumber.js';
import { action, computed, makeObservable, observable } from 'mobx';

import { FARM_REWARD_UPDATE_INTERVAL, ZERO_AMOUNT } from '@config/constants';
import { DEFAULT_TOKEN } from '@config/tokens';
import {
  isExist,
  isNull,
  MakeInterval,
  isTokenEqual,
  getUniqArray,
  getTokenSlug,
  multipliedIfPossible,
  fromDecimals
} from '@shared/helpers';
import { noopMap } from '@shared/mapping';
import { LoadingErrorData, RootStore } from '@shared/store';
import { Nullable, Token } from '@shared/types';

import { getAllFarmsUserInfoApi, getFarmingListApi, getFarmingStatsApi } from '../api';
import {
  getRewardsInUsd,
  getEndTimestamp,
  getPendingRewards,
  UsersInfoValueWithId,
  getIsHarvestAvailable,
  getUserInfoLastStakedTime,
  getUserPendingRewardWithFee
} from '../helpers';
import { FarmingItem, FarmingStats, RawFarmingItem, RawFarmingStats } from '../interfaces';
import { mapFarmingItems, mapFarmingStats } from '../mapping';

interface RewardAmount {
  amount: BigNumber;
  dollarEquivalent: Nullable<BigNumber>;
}
interface TokensReward {
  token: Token;
  staked: RewardAmount;
  claimable: RewardAmount;
}

const DEFAULT_REWARDS = {
  stakedRewards: new BigNumber(ZERO_AMOUNT),
  claimableRewardsWithFee: new BigNumber(ZERO_AMOUNT),
  claimableRewardsWithoutFee: new BigNumber(ZERO_AMOUNT)
};

export class FarmingListStore {
  readonly listStore = new LoadingErrorData<RawFarmingItem[], FarmingItem[]>(
    [],
    async () => await getFarmingListApi(this.rootStore.authStore.accountPkh, this.rootStore.tezos),
    mapFarmingItems
  );

  readonly userInfo = new LoadingErrorData<Nullable<UsersInfoValueWithId[]>, Nullable<UsersInfoValueWithId[]>>(
    [],
    async () => await this.getUserInfo(),
    noopMap
  );

  readonly statsStore = new LoadingErrorData<RawFarmingStats, Nullable<FarmingStats>>(
    null,
    getFarmingStatsApi,
    mapFarmingStats
  );

  claimablePendingRewards: Nullable<BigNumber> = null;
  totalPendingRewards: Nullable<BigNumber> = null;
  tokensRewardList: Array<TokensReward> = [];

  readonly updateUserInfoInterval = new MakeInterval(
    async () => await this.userInfo.load(),
    FARM_REWARD_UPDATE_INTERVAL
  );
  readonly pendingRewardsInterval = new MakeInterval(() => this.updatePendingRewards(), FARM_REWARD_UPDATE_INTERVAL);

  constructor(private rootStore: RootStore) {
    makeObservable(this, {
      claimablePendingRewards: observable,
      totalPendingRewards: observable,
      list: computed,

      updatePendingRewards: action
    });
  }

  get list() {
    return this.rootStore.farmingFilterStore?.filterAndSort(this.listStore.data);
  }

  private async getUserInfo() {
    const { tezos, authStore } = this.rootStore;
    const { data: list } = this.listStore;

    if (isNull(tezos) || isNull(authStore.accountPkh) || isNull(list)) {
      return null;
    }

    return await getAllFarmsUserInfoApi(tezos, authStore.accountPkh);
  }

  async getQuipuPendingRewards() {
    return (await this.getUniqTokensReward(DEFAULT_TOKEN)).claimableRewardsWithFee;
  }

  makePendingRewardsLiveable() {
    this.updateUserInfoInterval.start();
    this.pendingRewardsInterval.start();
  }

  clearIntervals() {
    this.updateUserInfoInterval.stop();
    this.pendingRewardsInterval.stop();
  }

  findUserInfo(farmingItem: FarmingItem) {
    // @ts-ignore
    return this.userInfo.data?.find(_userInfo => farmingItem.id.eq(_userInfo.id[0])) || null;
  }

  updatePendingRewards() {
    const isBalanceLoaded = this.listStore.data.some(({ earnBalance }) => isExist(earnBalance));

    if (!isBalanceLoaded || !this.userInfo.data) {
      this.totalPendingRewards = null;
      this.claimablePendingRewards = null;
      this.tokensRewardList = [];
    } else {
      const stakedFarmings = this.listStore.data.filter(({ earnBalance }) => earnBalance?.gt(ZERO_AMOUNT));

      const claimableFarmings = this.getClimableFarmings(stakedFarmings);

      const totalRewardsInUsd = stakedFarmings.map(farmingItem =>
        getRewardsInUsd(farmingItem, this.findUserInfo(farmingItem))
      );

      const claimableRewardsInUsd = claimableFarmings.map(farmingItem =>
        getRewardsInUsd(farmingItem, this.findUserInfo(farmingItem))
      );

      this.totalPendingRewards = getPendingRewards(totalRewardsInUsd);
      this.claimablePendingRewards = getPendingRewards(claimableRewardsInUsd);
      this.tokensRewardList = this.getTokensRewardList(stakedFarmings);
    }
  }

  private getTokensRewardList(stakedFarmings: Array<FarmingItem>): Array<TokensReward> {
    const uniqTokens = getUniqArray(stakedFarmings, ({ rewardToken }) => getTokenSlug(rewardToken)).map(
      ({ rewardToken, earnExchangeRate }) => ({ rewardToken, earnExchangeRate })
    );

    return uniqTokens.map(({ rewardToken, earnExchangeRate }) => {
      const { claimableRewardsWithoutFee, stakedRewards } = this.getUniqTokensRewardSync(rewardToken, Date.now());

      const claimableAmount = fromDecimals(claimableRewardsWithoutFee, rewardToken);
      const claimableDollarEquivalent = multipliedIfPossible(claimableAmount, earnExchangeRate);

      const skatedDollarEquivalent = multipliedIfPossible(stakedRewards, earnExchangeRate);

      console.log({ claimableAmount: claimableAmount.toFixed() });
      console.log({ stakedRewards: stakedRewards.toFixed() });

      return {
        token: rewardToken,
        staked: {
          amount: stakedRewards,
          dollarEquivalent: skatedDollarEquivalent
        },
        claimable: {
          amount: claimableAmount,
          dollarEquivalent: claimableDollarEquivalent
        }
      };
    });
  }

  private getClimableFarmings(stakedFarmings: FarmingItem[]) {
    return stakedFarmings.filter(farmingItem => {
      const lastStakedTime = getUserInfoLastStakedTime(this.findUserInfo(farmingItem));
      const endTimestamp = getEndTimestamp(farmingItem, lastStakedTime);

      return getIsHarvestAvailable(endTimestamp);
    });
  }

  private getUniqTokensRewardSync(token: Token, timestamp: number) {
    const isBalanceLoaded = this.listStore.data.some(({ earnBalance }) => isExist(earnBalance));

    if (!isBalanceLoaded || !this.userInfo.data) {
      return DEFAULT_REWARDS;
    } else {
      const stakedFarmingsWithUniqTokenRewards = this.listStore.data.filter(
        ({ earnBalance, rewardToken }) =>
          earnBalance?.gt(ZERO_AMOUNT) && rewardToken && isTokenEqual(rewardToken, token)
      );

      const stakedRewards = stakedFarmingsWithUniqTokenRewards.reduce(
        (accumulator, currentFarm) => accumulator.plus(currentFarm.earnBalance ?? ZERO_AMOUNT),
        new BigNumber(ZERO_AMOUNT)
      );

      const claimableFarmings = this.getClimableFarmings(stakedFarmingsWithUniqTokenRewards);

      const claimableRewards = claimableFarmings.map(farm => {
        const userInfo = this.findUserInfo(farm);

        if (!userInfo) {
          return { withFee: new BigNumber(ZERO_AMOUNT), withoutFee: new BigNumber(ZERO_AMOUNT) };
        }

        return getUserPendingRewardWithFee(userInfo, farm, timestamp);
      });

      const claimableRewardsWithoutFee = claimableRewards
        .map(({ withoutFee }) => withoutFee)
        .reduce<BigNumber>(
          (prevValue, currentValue) => prevValue.plus(currentValue ?? ZERO_AMOUNT),
          new BigNumber(ZERO_AMOUNT)
        );

      const claimableRewardsWithFee = claimableRewards
        .map(({ withFee }) => withFee)
        .reduce<BigNumber>(
          (prevValue, currentValue) => prevValue.plus(currentValue ?? ZERO_AMOUNT),
          new BigNumber(ZERO_AMOUNT)
        )
        .decimalPlaces(ZERO_AMOUNT, BigNumber.ROUND_DOWN);

      return { stakedRewards, claimableRewardsWithFee, claimableRewardsWithoutFee };
    }
  }

  private async getUniqTokensReward(token: Token) {
    const { tezos } = this.rootStore;
    if (!tezos) {
      return DEFAULT_REWARDS;
    }

    const blockTimestamp = (await tezos.rpc.getBlockHeader()).timestamp;
    const blockTimestampMS = new Date(blockTimestamp).getTime();

    return this.getUniqTokensRewardSync(token, blockTimestampMS);
  }
}
