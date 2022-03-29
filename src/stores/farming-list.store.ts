import { Nullable } from '@quipuswap/ui-kit';
import BigNumber from 'bignumber.js';
import { action, computed, makeObservable, observable } from 'mobx';

import { getFarmingListApi, getFarmingStatsApi } from '@api/farming';
import { getAllFarmsUserInfoApi } from '@api/farming/get-user-info.api';
import { UsersInfoValueWithId } from '@api/farming/helpers';
import { FARM_REWARD_UPDATE_INTERVAL, FARM_USER_INFO_UPDATE_INTERVAL } from '@app.config';
import { FarmingItem, FarmingStats, RawFarmingItem, RawFarmingStats } from '@interfaces/farming.interfaces';
import { isNull } from '@utils/helpers';
import { MakeInterval } from '@utils/helpers/make-interval';
import { multipliedIfPossible } from '@utils/helpers/multiplied-if-possible';
import { mapFarmingItems, mapFarmingStats } from '@utils/mapping/farming.map';
import { noopMap } from '@utils/mapping/noop.map';

import { LoadingErrorData } from './loading-error-data.store';
import { RootStore } from './root.store';

const ZERO_AMOUNT = 0;

export class FarmingListStore {
  listStore = new LoadingErrorData<RawFarmingItem[], FarmingItem[]>(
    [],
    async () => await getFarmingListApi(this.rootStore.authStore.accountPkh, this.rootStore.tezos),
    mapFarmingItems
  );

  userInfo = new LoadingErrorData<Nullable<UsersInfoValueWithId[]>, Nullable<UsersInfoValueWithId[]>>(
    [],
    async () => await this.getUserInfo(),
    noopMap
  );

  statsStore = new LoadingErrorData<RawFarmingStats, Nullable<FarmingStats>>(null, getFarmingStatsApi, mapFarmingStats);

  pendingRewards: Nullable<BigNumber> = null;

  listStoreInterval = new MakeInterval(async () => this.listStore.load(), FARM_USER_INFO_UPDATE_INTERVAL);
  updateUserInfoInterval = new MakeInterval(async () => this.userInfo.load(), FARM_USER_INFO_UPDATE_INTERVAL);
  pendingRewardsInterval = new MakeInterval(() => this.updatePendingRewards(), FARM_REWARD_UPDATE_INTERVAL);

  constructor(private rootStore: RootStore) {
    makeObservable(this, {
      pendingRewards: observable,
      list: computed,

      updatePendingRewards: action
    });
  }

  get list() {
    return this.rootStore.farmingFilterStore.filterAndSort(this.listStore.data);
  }

  private async getUserInfo() {
    const { tezos, authStore } = this.rootStore;
    const { data: list } = this.listStore;

    if (isNull(tezos) || isNull(authStore.accountPkh) || isNull(list)) {
      return null;
    }

    return getAllFarmsUserInfoApi(tezos, authStore.accountPkh);
  }

  makePendingRewardsLiveable() {
    this.listStoreInterval.start();
    this.updateUserInfoInterval.start();
    this.pendingRewardsInterval.start();
  }

  clearIntervals() {
    this.listStoreInterval.stop();
    this.updateUserInfoInterval.stop();
    this.pendingRewardsInterval.stop();
  }

  updatePendingRewards() {
    const rewardsInUsd = this.listStore.data.map(({ earnBalance, earnExchangeRate }) =>
      multipliedIfPossible(earnBalance, earnExchangeRate)
    );

    this.pendingRewards = rewardsInUsd.length
      ? rewardsInUsd.reduce<BigNumber>(
          (prevValue, currentValue) => prevValue.plus(currentValue ?? ZERO_AMOUNT),
          new BigNumber(ZERO_AMOUNT)
        )
      : null;
  }
}
