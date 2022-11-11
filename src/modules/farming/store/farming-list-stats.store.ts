import { computed, makeObservable } from 'mobx';

import { Led, ModelBuilder } from '@shared/model-builder';
import { LoadingErrorData, RootStore } from '@shared/store';

import { getFarmingStatsApi } from '../api';
import { FarmingListStatsResponseModel } from '../models';

const defaultStats = {
  stats: null,
  blockInfo: null
};

@ModelBuilder()
export class FarmingListStatsStore {
  //#region farming stats store
  @Led({
    default: defaultStats,
    loader: getFarmingStatsApi,
    model: FarmingListStatsResponseModel
  })
  readonly statsStore: LoadingErrorData<FarmingListStatsResponseModel, typeof defaultStats>;

  get stats() {
    return this.statsStore.model.stats;
  }
  //#endregion farming stats store
  constructor(private rootStore: RootStore) {
    makeObservable(this, {
      stats: computed
    });
  }
}
