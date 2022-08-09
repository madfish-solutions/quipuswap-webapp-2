import { makeObservable } from 'mobx';

import { Led, ModelBuilder } from '@shared/model-builder';
import { LoadingErrorDataNew, RootStore } from '@shared/store';
import { Undefined } from '@shared/types';

import { getStableswapListApi, getStableswapStatsApi } from '../api';
import { StableswapItemModel, StableswapListModel, StableswapStatsModel } from '../models';

const defaultStableswapList = {
  list: []
};

@ModelBuilder()
export class StableswapListStore {
  //#region stableswap list store
  @Led({
    default: defaultStableswapList,
    loader: getStableswapListApi,
    model: StableswapListModel
  })
  readonly listStore: LoadingErrorDataNew<StableswapListModel, typeof defaultStableswapList>;

  get list(): Undefined<Array<StableswapItemModel>> {
    return this.rootStore.stableswapFilterStore?.filterAndSort(this.listStore.model.list);
  }
  //#endregion stableswap list store

  //#region stableswap stats store
  @Led({
    default: null,
    loader: getStableswapStatsApi,
    model: StableswapStatsModel
  })
  readonly statsStore: LoadingErrorDataNew<StableswapStatsModel, null>;

  get stats() {
    return this.statsStore.model;
  }
  //#endregion stableswap stats store

  constructor(private rootStore: RootStore) {
    makeObservable(this, {});
  }
}
