import { action, computed, makeObservable, observable } from 'mobx';

import { Led, ModelBuilder } from '@shared/model-builder';
import { BaseFilterStore, LoadingErrorData, RootStore } from '@shared/store';

import { getNewLiquidityStatsApi, getNewLiquidityListApi } from '../api';
import { LiquidityItemModel, LiquidityListModel, NewLiquidityResponseModel } from '../models';
import { sortLiquidityList } from '../pages/list/helpers';
import { LiquiditySortField } from '../pages/list/types';

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
export class NewLiquidityListStore extends BaseFilterStore {
  showDust = false;
  sortField: LiquiditySortField = LiquiditySortField.ID;

  //#region liquidity list store
  @Led({
    default: defaultList,
    loader: getNewLiquidityListApi,
    model: LiquidityListModel
  })
  readonly listStore: LoadingErrorData<LiquidityListModel, typeof defaultList>;

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
  readonly statsStore: LoadingErrorData<NewLiquidityResponseModel, typeof DEFAULT_RESPONSE_DATA>;

  get stats() {
    return this.statsStore.model.stats;
  }
  //#endregion liquidity stats store

  constructor(private rootStore: RootStore) {
    super();

    makeObservable(this, {
      list: computed,
      stats: computed,

      activeOnly: observable,

      setShowDust: action,
      onSortFieldChange: action
    });
  }

  activeOnly = true;

  filterAndSort(list: Array<LiquidityItemModel>) {
    return sortLiquidityList(list, this.sortField, this.sortDirection);
  }

  setShowDust(state: boolean) {
    this.showDust = state;
  }

  onSortFieldChange(field: LiquiditySortField) {
    this.sortField = field;
  }
}
