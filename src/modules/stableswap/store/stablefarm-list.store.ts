import { computed, makeObservable } from 'mobx';

import { LoadingErrorData, RootStore } from '@shared/store';

import { getStableFarmListApi, getStableFarmStatsApi, getStakerInfo } from '../api';
import { farmsListMapper, stakerInfoMapper, statsMapper } from '../mapping';
import { listWithUserInfo } from '../stableswap-farm/pages/list/helpers';
import { RawStableFarmItem, RawStableFarmStats, StableFarmItem, StableFarmStats, StakerInfo } from '../types';

export class StableFarmListStore {
  readonly statsStore = new LoadingErrorData<RawStableFarmStats, Nullable<StableFarmStats>>(
    null,
    async () => await getStableFarmStatsApi(),
    statsMapper
  );

  readonly listStore = new LoadingErrorData<Array<RawStableFarmItem>, Array<StableFarmItem>>(
    [],
    async () => await getStableFarmListApi(),
    farmsListMapper
  );

  readonly stakerInfo = new LoadingErrorData<Array<StakerInfo>, Array<StakerInfo>>(
    [],
    async () => await getStakerInfo(this.rootStore.tezos, this.list, this.rootStore.authStore.accountPkh),
    stakerInfoMapper
  );

  constructor(private rootStore: RootStore) {
    makeObservable(this, {
      stats: computed,
      list: computed,
      info: computed
    });
  }

  get stats() {
    return this.statsStore.data;
  }

  get list() {
    return this.listStore.data;
  }

  get info() {
    return this.stakerInfo.data;
  }

  get listWithUserInfo() {
    return listWithUserInfo(this.list, this.info);
  }

  get filteredList() {
    return this.rootStore.stableFarmFilterStore?.filterAndSort(this.listWithUserInfo);
  }
}
