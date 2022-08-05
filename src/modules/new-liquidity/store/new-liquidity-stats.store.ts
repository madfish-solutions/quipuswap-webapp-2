import { makeObservable } from 'mobx';

import { Led, ModelBuilder } from '@shared/model-builder';
import { LoadingErrorDataNew, RootStore } from '@shared/store';

import { getNewLiquidityStatsApi } from '../api';
import { NewLiquidityResponseDto } from '../dto';
import { NewLiquidityResponseModel } from '../models';

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
export class NewLiquidityStatsStore {
  @Led({
    defaultData: DEFAULT_RESPONSE_DATA,
    getData: async () => await getNewLiquidityStatsApi(),
    dto: NewLiquidityResponseDto,
    model: NewLiquidityResponseModel
  })
  readonly statsStore: LoadingErrorDataNew<NewLiquidityResponseModel>;

  constructor(private rootStore: RootStore) {
    makeObservable(this, {});
  }

  get stats() {
    return this.statsStore.model?.stats;
  }

  get blockInfo() {
    return this.statsStore.model?.blockInfo;
  }
}
