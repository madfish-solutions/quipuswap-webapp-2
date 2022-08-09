import { computed, makeObservable } from 'mobx';

import { Led, ModelBuilder } from '@shared/model-builder';
import { LoadingErrorDataNew, RootStore } from '@shared/store';

import { getNewLiquidityStatsApi, getNewLiquidityListApi } from '../api';
import { LiquidityListModel, NewLiquidityResponseModel } from '../models';

const defaultList = {
  list: []
};

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
  //#region liquidity list store
  @Led({
    default: defaultList,
    loader: getNewLiquidityListApi,
    model: LiquidityListModel
  })
  readonly listStore: LoadingErrorDataNew<LiquidityListModel, typeof defaultList>;

  get list() {
    return this.listStore.model.list;
  }
  //#endregion liquidity list store

  //#region liquidity stats store
  @Led({
    default: DEFAULT_RESPONSE_DATA,
    loader: getNewLiquidityStatsApi,
    model: NewLiquidityResponseModel
  })
  readonly statsStore: LoadingErrorDataNew<NewLiquidityResponseModel, typeof DEFAULT_RESPONSE_DATA>;

  get stats() {
    return this.statsStore.model.stats;
  }
  //#endregion liquidity stats store

  constructor(private rootStore: RootStore) {
    makeObservable(this, {
      list: computed,
      stats: computed
    });
  }
}
