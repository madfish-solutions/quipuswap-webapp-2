import { BigNumber } from 'bignumber.js';
import { action, computed, makeObservable, observable } from 'mobx';

import { FARM_REWARD_UPDATE_INTERVAL, DEFAULT_DECIMALS } from '@config/constants';
import { DEFAULT_TOKEN } from '@config/tokens';
import { isExist, isNull, MakeInterval, isTokenEqual } from '@shared/helpers';
import { noopMap } from '@shared/mapping';
import { LoadingErrorData, RootStore } from '@shared/store';
import { Nullable } from '@shared/types';

import { getAllFarmsUserInfoApi, getFarmingListApi, getFarmingStatsApi } from '../api';
import {
  getRewardsInUsd,
  getEndTimestamp,
  getPendingRewards,
  getUserPendingReward,
  UsersInfoValueWithId,
  getIsHarvestAvailable,
  getUserInfoLastStakedTime
} from '../helpers';
import { FarmingItem, FarmingStats, RawFarmingItem, RawFarmingStats } from '../interfaces';
import { mapFarmingItems, mapFarmingStats } from '../mapping';

const ZERO_AMOUNT = 0;

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
    const { tezos } = this.rootStore;
    const isBalanceLoaded = this.listStore.data.some(({ earnBalance }) => isExist(earnBalance));

    if (!isBalanceLoaded || !this.userInfo.data || !tezos) {
      return new BigNumber(ZERO_AMOUNT);
    } else {
      const stakedFarmingsWithQuipuRewards = this.listStore.data.filter(
        ({ earnBalance, rewardToken }) =>
          earnBalance?.gt(ZERO_AMOUNT) && rewardToken && isTokenEqual(rewardToken, DEFAULT_TOKEN)
      );

      const claimableFarmings = this.getClimableFarmings(stakedFarmingsWithQuipuRewards);

      const blockTimestamp = (await tezos.rpc.getBlockHeader()).timestamp;
      const blockTimestampMS = new Date(blockTimestamp).getTime();

      return claimableFarmings
        .map(farm => {
          const userInfo = this.findUserInfo(farm);

          if (!userInfo) {
            return new BigNumber(ZERO_AMOUNT);
          }

          return getUserPendingReward(userInfo, farm, blockTimestampMS);
        })
        .reduce<BigNumber>(
          (prevValue, currentValue) => prevValue.plus(currentValue ?? ZERO_AMOUNT),
          new BigNumber(ZERO_AMOUNT)
        )
        .decimalPlaces(DEFAULT_DECIMALS, BigNumber.ROUND_DOWN);
    }
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
    }
  }

  private getClimableFarmings(stakedFarmings: FarmingItem[]) {
    return stakedFarmings.filter(farmingItem => {
      const lastStakedTime = getUserInfoLastStakedTime(this.findUserInfo(farmingItem));
      const endTimestamp = getEndTimestamp(farmingItem, lastStakedTime);

      return getIsHarvestAvailable(endTimestamp);
    });
  }
}
