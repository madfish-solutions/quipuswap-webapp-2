import { makeObservable } from 'mobx';

import { Led, ModelBuilder } from '@shared/model-builder';
import { LoadingErrorDataNew, RootStore } from '@shared/store';
import { Undefined } from '@shared/types';

import { getStableswapListApi, getStableswapStatsApi } from '../api';
import { StableswapListDto, StableswapStatsDto } from '../dto';
import { StableswapItemModel, StableswapListModel, StableswapStatsModel } from '../models';

@ModelBuilder()
export class StableswapListStore {
  @Led({
    defaultData: [],
    getData: async () => await getStableswapListApi(),
    dto: StableswapListDto,
    model: StableswapListModel
  })
  readonly listStore: LoadingErrorDataNew<StableswapListModel>;

  @Led({
    defaultData: null,
    getData: async () => await getStableswapStatsApi(),
    dto: StableswapStatsDto,
    model: StableswapStatsModel
  })
  readonly statsStore: LoadingErrorDataNew<StableswapStatsModel>;

  constructor(private rootStore: RootStore) {
    makeObservable(this, {});
  }

  get stats() {
    return this.statsStore.model;
  }

  get list(): Undefined<Array<StableswapItemModel>> {
    return this.rootStore.stableswapFilterStore?.filterAndSort(this.listStore.model?.list ?? []);
  }
}
