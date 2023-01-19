import { BigNumber } from 'bignumber.js';
import { action, computed, makeObservable, observable } from 'mobx';

import { Led, ModelBuilder } from '@shared/model-builder';
import { LoadingErrorData, RootStore } from '@shared/store';
import { Nullable } from '@shared/types';

import { getStableswapItemApi } from '../api';
import { StableswapItemModel } from '../models';
import { Version } from '../types';

@ModelBuilder()
export class StableswapItemStore {
  poolId: Nullable<BigNumber> = null;
  version: Nullable<Version> = null;
  //#region item store
  @Led({
    default: null,
    loader: async (self: StableswapItemStore) => await getStableswapItemApi(self.poolId, self.version),
    model: StableswapItemModel
  })
  readonly itemStore: LoadingErrorData<StableswapItemModel, null>;

  get item() {
    return this.itemStore.model;
  }
  //#endregion item store

  constructor(private rootStore: RootStore) {
    makeObservable(this, {
      poolId: observable,

      setPoolId: action,

      item: computed
    });
  }

  setPoolId(poolId: BigNumber) {
    this.poolId = poolId;
  }

  setVersion(version: Version) {
    this.version = version;
  }
}
