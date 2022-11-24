import BigNumber from 'bignumber.js';
import { action, computed, makeObservable, observable } from 'mobx';

import { defined, t } from '@shared/helpers';
import { Fled } from '@shared/model-builder/fled';
import { RootStore } from '@shared/store';
import { Nullable } from '@shared/types';

import { BlockchainLiquidityV3Api } from '../api';

export class LiquidityV3ItemStore {
  error: Nullable<Error> = null;
  id: Nullable<BigNumber> = null;

  //#region Quipuswap V3 liquidity item store
  readonly itemSore = new Fled(
    async () => await BlockchainLiquidityV3Api.getPool(defined(this.rootStore.tezos, 'tezos'), defined(this.id, 'id')),
    t
  );

  get itemIsLoading() {
    return this.itemSore.isLoading;
  }

  get item() {
    return this.itemSore.model;
  }
  //#endregion Quipuswap V3 liquidity item store

  constructor(private rootStore: RootStore) {
    makeObservable(this, {
      itemSore: observable,
      error: observable,
      item: computed,
      itemModel: computed,
      setId: action,
      setError: action
    });
  }

  setId(id: BigNumber) {
    this.id = id;
  }

  setError(error: Error) {
    this.error = error;
  }

  get itemModel() {
    return this.itemSore.model;
  }
}
