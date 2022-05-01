import { makeObservable } from 'mobx';

import { LoadingErrorData, RootStore } from '@shared/store';
import { Nullable } from '@shared/types';

import { getStableswapListApi, getStableswapStatsApi } from '../api';
import { poolsListMapper, statsMapper } from '../mapping';
import { RawStableswapList, RawStableswapStats, StableswapList, StableswapStats } from '../types';

export class StableswapListStore {
  readonly listStore = new LoadingErrorData<RawStableswapList['list'], StableswapList['list']>(
    [],
    async () => await getStableswapListApi(),
    poolsListMapper
  );

  readonly statsStore = new LoadingErrorData<RawStableswapStats, Nullable<StableswapStats>>(
    null,
    async () => await getStableswapStatsApi(),
    statsMapper
  );

  constructor(private rootStore: RootStore) {
    makeObservable(this, {});
  }

  get stats() {
    return this.statsStore.data;
  }

  get list() {
    return this.rootStore.stableswapFilterStore?.filterAndSort(this.listStore.data);
  }
}
