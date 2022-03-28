import BigNumber from 'bignumber.js';
import { computed, makeObservable } from 'mobx';

import { multipliedIfPossible } from '@shared/helpers';
import { mapFarmingItems, mapFarmingStats } from '@shared/mapping';
import { RootStore, LoadingErrorData } from '@shared/store';
import { Nullable } from '@shared/types/types';

import { getFarmingListApi, getFarmingStatsApi } from '../api';
import { RawFarmingStats, RawFarmingItem, FarmingStats, FarmingItem } from '../interfaces';

const ZERO_AMOUNT = 0;

export class FarmingListStore {
  listStore = new LoadingErrorData<RawFarmingItem[], FarmingItem[]>(
    [],
    async () => await getFarmingListApi(this.rootStore.authStore.accountPkh, this.rootStore.tezos),
    mapFarmingItems
  );

  statsStore = new LoadingErrorData<RawFarmingStats, Nullable<FarmingStats>>(null, getFarmingStatsApi, mapFarmingStats);

  get pendingRewards() {
    const rewardsInUsd = this.listStore.data.map(({ earnBalance, earnExchangeRate }) =>
      multipliedIfPossible(earnBalance, earnExchangeRate)
    );

    return rewardsInUsd.reduce<BigNumber>(
      (prevValue, currentValue) => prevValue.plus(currentValue ?? ZERO_AMOUNT),
      new BigNumber(ZERO_AMOUNT)
    );
  }

  get list() {
    return this.rootStore.farmingFilterStore?.filterAndSort(this.listStore.data);
  }

  constructor(private rootStore: RootStore) {
    makeObservable(this, {
      pendingRewards: computed,
      list: computed
    });
  }
}
