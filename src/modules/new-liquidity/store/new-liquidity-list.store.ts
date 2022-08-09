import { computed, makeObservable } from 'mobx';

import { Led, ModelBuilder } from '@shared/model-builder';
import { LoadingErrorDataNew, RootStore } from '@shared/store';

import { getNewLiquidityStatsApi, getNewLiquidityListApi } from '../api';
import { LiquidityListModel, NewLiquidityResponseModel } from '../models';

const DEFAULT_RESPONSE_DATA = {
  stats: {
    totalValueLocked: null,
    maxApr: null,
    poolsCount: null
  },
  blockInfo: {
    level: null,
    hash: null,
    timestamp: null
  }
};

@ModelBuilder()
export class NewLiquidityListStore {
  @Led({
    default: [],
    loader: getNewLiquidityListApi,
    model: LiquidityListModel
  })
  readonly listStore: LoadingErrorDataNew<LiquidityListModel>;

  @Led({
    default: DEFAULT_RESPONSE_DATA,
    loader: getNewLiquidityStatsApi,
    model: NewLiquidityResponseModel
  })
  readonly statsStore: LoadingErrorDataNew<NewLiquidityResponseModel, typeof DEFAULT_RESPONSE_DATA>;

  constructor(private rootStore: RootStore) {
    makeObservable(this, {
      list: computed,
      stats: computed
    });
  }

  get list() {
    return this.listStore.model?.list;
  }

  get stats() {
    return this.statsStore.model?.stats;
  }
}
