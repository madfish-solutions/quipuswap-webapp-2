import { makeObservable } from 'mobx';

import { Led, ModelBuilder } from '@shared/model-builder';
import { LoadingErrorDataNew, RootStore } from '@shared/store';

import { getNewLiquidityStatsApi } from '../api';
import { NewLiquidityStatsDto } from '../dto';
import { NewLiquidityStatsModel } from '../models';

@ModelBuilder()
export class NewLiquidityStore {
  @Led({
    defaultData: null,
    getData: async () => await getNewLiquidityStatsApi(),
    dto: NewLiquidityStatsDto,
    model: NewLiquidityStatsModel
  })
  readonly statsStore: LoadingErrorDataNew<NewLiquidityStatsModel>;

  constructor(private rootStore: RootStore) {
    makeObservable(this, {});
  }

  get stats() {
    return this.statsStore.data;
  }
}
