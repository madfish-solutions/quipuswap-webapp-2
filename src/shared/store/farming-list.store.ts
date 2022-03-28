import BigNumber from 'bignumber.js';
import { computed, makeObservable } from 'mobx';

import { getFarmingListApi, getFarmingStatsApi } from '../../pages/farming/api';
import { RawFarmingStats, RawFarmingItem, FarmingStats, FarmingItem } from '../../pages/farming/interfaces';
import { Nullable } from '../../types/types';
import { multipliedIfPossible } from '../helpers';
import { mapFarmingItems, mapFarmingStats } from '../mapping';
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
