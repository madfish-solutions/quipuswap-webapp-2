import { computed, makeObservable } from 'mobx';

import { Led, ModelBuilder } from '@shared/model-builder';
import { LoadingErrorDataNew, RootStore } from '@shared/store';

import { getNewLiquidityListApi, getNewLiquidityStatsApi } from '../api';
import { LiquidityListDto, NewLiquidityResponseDto } from '../dto';
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
    defaultData: [],
    getData: getNewLiquidityListApi,
    dto: LiquidityListDto,
    model: LiquidityListModel
  })
  readonly listStore: LoadingErrorDataNew<LiquidityListDto>;

  @Led({
    defaultData: DEFAULT_RESPONSE_DATA,
    getData: async () => await getNewLiquidityStatsApi(),
    dto: NewLiquidityResponseDto,
    model: NewLiquidityResponseModel
  })
  readonly statsStore: LoadingErrorDataNew<NewLiquidityResponseModel>;

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
