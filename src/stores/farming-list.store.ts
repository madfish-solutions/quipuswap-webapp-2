import { Nullable } from '@quipuswap/ui-kit';
import BigNumber from 'bignumber.js';
import { action, computed, makeObservable, observable } from 'mobx';

import { getFarmingListApi, getFarmingStatsApi } from '@api/farming';
import { getUserInfoApi } from '@api/farming/get-user-info.api';
import { getUserPendingReward } from '@api/farming/helpers';
import { FARM_REWARD_UPDATE_INTERVAL, FARM_USER_INFO_UPDATE_INTERVAL } from '@app.config';
import { FarmingUserInfo, RawFarmingUserInfo } from '@interfaces/farming-contract.interface';
import { FarmingItem, FarmingStats, RawFarmingItem, RawFarmingStats } from '@interfaces/farming.interfaces';
import { isNull } from '@utils/helpers';
import { MakeInterval } from '@utils/helpers/make-interval';
import { mapFarmingItems, mapFarmingStats, mapFarmingsUserInfo } from '@utils/mapping/farming.map';

import { LoadingErrorData } from './loading-error-data.store';
import { RootStore } from './root.store';

const ZERO_AMOUNT = 0;

export class FarmingListStore {
  listStore = new LoadingErrorData<RawFarmingItem[], FarmingItem[]>(
    [],
    async () => await getFarmingListApi(this.rootStore.authStore.accountPkh, this.rootStore.tezos),
    mapFarmingItems
  );

  statsStore = new LoadingErrorData<RawFarmingStats, Nullable<FarmingStats>>(null, getFarmingStatsApi, mapFarmingStats);

  userInfoStore = new LoadingErrorData<RawFarmingUserInfo[], FarmingUserInfo[]>(
    [],
    async () => await this.getUserInfo(),
    mapFarmingsUserInfo
  );

  updateUserInfoInterval = new MakeInterval(async () => this.userInfoStore.load(), FARM_USER_INFO_UPDATE_INTERVAL);
  pendingRewardsInterval = new MakeInterval(() => this.updatePendingRewards(), FARM_REWARD_UPDATE_INTERVAL);

  pendingRewards: Nullable<BigNumber> = null;

  get list() {
    return this.rootStore.farmingFilterStore.filterAndSort(this.listStore.data);
  }

  constructor(private rootStore: RootStore) {
    makeObservable(this, {
      pendingRewards: observable,
      list: computed,
      updatePendingRewards: action
    });
  }

  private async getUserInfo() {
    const { tezos, authStore } = this.rootStore;
    const { data: farmings } = this.listStore;

    if (isNull(tezos) || isNull(authStore.accountPkh) || !farmings.length) {
      return [];
    }

    return Promise.all(farmings.map(async farming => getUserInfoApi(farming, authStore.accountPkh!, tezos)));
  }

  updatePendingRewards() {
    const { data: userInfo } = this.userInfoStore;
    const { data: farmings } = this.listStore;

    if (!userInfo || !farmings.length) {
      this.pendingRewards = new BigNumber(ZERO_AMOUNT);

      return;
    }

    this.pendingRewards = farmings.reduce(
      (acc, farming, index) => acc.plus(getUserPendingReward(userInfo[index], farming)),
      new BigNumber(ZERO_AMOUNT)
    );
  }

  makePendingRewardsLiveable() {
    this.updateUserInfoInterval.start();
    this.pendingRewardsInterval.start();
  }

  clearIntervals() {
    this.pendingRewardsInterval.stop();
    this.updateUserInfoInterval.stop();
  }
}
