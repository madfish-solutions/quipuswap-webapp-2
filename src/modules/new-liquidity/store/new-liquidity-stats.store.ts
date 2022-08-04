import { makeObservable } from 'mobx';

import { Led, ModelBuilder } from '@shared/model-builder';
import { LoadingErrorDataNew, RootStore } from '@shared/store';

import { getNewLiquidityStatsApi } from '../api';
import { NewLiquidityResponseDto } from '../dto';
import { NewLiquidityResponseModel } from '../models';

export const DEFAULT_DATA = {
  totalValueLocked: null,
  maxApr: null,
  poolsCount: null
};

@ModelBuilder()
export class NewLiquidityStatsStore {
  @Led({
    defaultData: null,
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
