import { computed, makeObservable } from 'mobx';

import { noopMap } from '@shared/mapping';
import { LoadingErrorData, RootStore } from '@shared/store';

import { getStableFarmListApi, getStakerInfo } from '../api';
import { farmsListMapper } from '../mapping';
import { RawStableFarmItem, StableFarmItem, StakerInfo } from '../types';

export class StableFarmListStore {
  readonly listStore = new LoadingErrorData<Array<RawStableFarmItem>, Array<StableFarmItem>>(
    [],
    async () => await getStableFarmListApi(),
    farmsListMapper
  );

  readonly stakerInfo = new LoadingErrorData<{ [key: string]: StakerInfo }, { [key: string]: StakerInfo }>(
    {},
    async () => await getStakerInfo(this.rootStore.tezos, this.list, this.rootStore.authStore.accountPkh),
    noopMap
  );

  constructor(private rootStore: RootStore) {
    makeObservable(this, {
      list: computed,
      info: computed
    });
  }

  get list() {
    return this.listStore.data;
  }

  get info() {
    return this.stakerInfo.data;
  }
}
