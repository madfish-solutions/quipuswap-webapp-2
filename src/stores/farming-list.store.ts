import { Nullable } from '@quipuswap/ui-kit';
import BigNumber from 'bignumber.js';
import { action, computed, makeObservable, observable } from 'mobx';

import { getFarmingListApi, getFarmingStatsApi } from '@api/farming';
import { getAllFarmsUserInfoApi } from '@api/farming/get-user-info.api';
import {
  getEndTimestamp,
  getIsHarvestAvailable,
  getUserInfoLastStakedTime,
  getUserPendingReward,
  UsersInfoValueWithId
} from '@api/farming/helpers';
import { FARM_REWARD_UPDATE_INTERVAL } from '@app.config';
import { FarmingItem, FarmingStats, RawFarmingItem, RawFarmingStats } from '@interfaces/farming.interfaces';
import { fromDecimals, isExist, isNull } from '@utils/helpers';
import { MakeInterval } from '@utils/helpers/make-interval';
import { multipliedIfPossible } from '@utils/helpers/multiplied-if-possible';
import { mapFarmingItems, mapFarmingStats } from '@utils/mapping/farming.map';
import { noopMap } from '@utils/mapping/noop.map';

import { LoadingErrorData } from './loading-error-data.store';
import { RootStore } from './root.store';

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

  pendingRewards: Nullable<BigNumber> = null;

  readonly updateUserInfoInterval = new MakeInterval(
    async () => await this.userInfo.load(),
    FARM_REWARD_UPDATE_INTERVAL
  );
  readonly pendingRewardsInterval = new MakeInterval(() => this.updatePendingRewards(), FARM_REWARD_UPDATE_INTERVAL);

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

    return await getAllFarmsUserInfoApi(tezos, authStore.accountPkh);
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
    const rewardsInUsd = this.listStore.data
      .filter(({ earnBalance }) => earnBalance?.gt(ZERO_AMOUNT))
      .filter(farmingItem => {
        const lastStakedTime = getUserInfoLastStakedTime(this.findUserInfo(farmingItem));
        const endTimestamp = getEndTimestamp(farmingItem, lastStakedTime);

        return getIsHarvestAvailable(endTimestamp);
      })
      .map(farmingItem => {
        const userInfo = this.findUserInfo(farmingItem);
        const rewards = userInfo && getUserPendingReward(userInfo, farmingItem);
        const earnBalance = rewards && fromDecimals(rewards, farmingItem.rewardToken);

        return multipliedIfPossible(earnBalance, farmingItem.earnExchangeRate);
      });

    this.pendingRewards = rewardsInUsd.some(isExist)
      ? rewardsInUsd.reduce<BigNumber>(
          (prevValue, currentValue) => prevValue.plus(currentValue ?? ZERO_AMOUNT),
          new BigNumber(ZERO_AMOUNT)
        )
      : this.listStore.data.filter(({ earnBalance }) => earnBalance?.gt(ZERO_AMOUNT)).some(isExist)
      ? new BigNumber(ZERO_AMOUNT)
      : null;
  }
}
