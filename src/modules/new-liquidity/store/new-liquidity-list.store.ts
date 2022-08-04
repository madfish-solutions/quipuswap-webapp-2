import { makeObservable } from 'mobx';

import { Led, ModelBuilder } from '@shared/model-builder';
import { LoadingErrorDataNew, RootStore } from '@shared/store';

import { getNewLiquidityListApi } from '../api';
import { LiquidityListDto } from '../dto';
import { LiquidityListModel } from '../models';

@ModelBuilder()
export class NewLiquidityListStore {
  @Led({
    defaultData: [],
    getData: getNewLiquidityListApi,
    dto: LiquidityListDto,
    model: LiquidityListModel
  })
  readonly listStore: LoadingErrorDataNew<LiquidityListDto>;

  constructor(private rootStore: RootStore) {
    makeObservable(this, {});
  }

  get list() {
    return this.listStore.model?.list;
  }
}
