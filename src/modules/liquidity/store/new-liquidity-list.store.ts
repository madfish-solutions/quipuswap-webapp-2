import { computed, makeObservable } from 'mobx';

import { defined } from '@shared/helpers';
import { Led, ModelBuilder } from '@shared/model-builder';
import { LoadingErrorData, RootStore } from '@shared/store';

import { getLiquidityListApi, getLiquidityStatsApi } from '../api';
import { isHotPool } from '../helpers';
import { LiquidityListModel, LiquidityResponseModel } from '../models';

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
    loader: getLiquidityListApi,
    model: LiquidityListModel
  })
  readonly listStore: LoadingErrorData<LiquidityListModel, typeof defaultList>;

  get list() {
    return this.listStore.model.list;
  }

  get filteredList() {
    return defined(this.rootStore.liquidityListFiltersStore).filterAndSort(this.listStore.model.list);
  }

  get hotPools() {
    return this.listStore.model.list.filter(({ id, type }) => isHotPool(id, type));
  }
  //#endregion liquidity list store

  //#region liquidity stats store
  @Led({
    default: DEFAULT_RESPONSE_DATA,
    loader: getLiquidityStatsApi,
    model: LiquidityResponseModel
  })
  readonly statsStore: LoadingErrorData<LiquidityResponseModel, typeof DEFAULT_RESPONSE_DATA>;

  get stats() {
    return this.statsStore.model.stats;
  }
  //#endregion liquidity stats store

  constructor(private rootStore: RootStore) {
    makeObservable(this, {
      list: computed,
      filteredList: computed,
      hotPools: computed,
      stats: computed
    });
  }
}
