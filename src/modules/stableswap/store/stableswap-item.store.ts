import { BigNumber } from 'bignumber.js';
import { action, computed, makeObservable, observable } from 'mobx';

import { Led, ModelBuilder } from '@shared/model-builder';
import { LoadingErrorData, RootStore } from '@shared/store';
import { Nullable } from '@shared/types';

import { getStableswapItemApi } from '../api';
import { StableswapItemModel } from '../models';

@ModelBuilder()
export class StableswapItemStore {
  poolId: Nullable<BigNumber> = null;

  @Led({
    default: null,
    loader: async (self: StableswapItemStore) => await getStableswapItemApi(self.poolId),
    model: StableswapItemModel
  })
  readonly itemStore: LoadingErrorData<StableswapItemModel, null>;

  constructor(private rootStore: RootStore) {
    makeObservable(this, {
      poolId: observable,

      setPoolId: action,

      item: computed
    });
  }

  get item() {
    return this.itemStore.model;
  }

  setPoolId(poolId: BigNumber) {
    this.poolId = poolId;
  }
}
