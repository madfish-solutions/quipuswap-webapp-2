import { action, computed, makeObservable, observable } from 'mobx';

import { defined, t } from '@shared/helpers';
import { Fled } from '@shared/model-builder/fled';
import { RootStore } from '@shared/store';
import { Nullable } from '@shared/types';

import { BlockchainLiquidityV3Api } from '../api';

export class LiquidityV3ItemStore {
  address: Nullable<string> = null;
  error: Nullable<Error> = null;

  //#region dex two liquidity item store
  readonly itemSore = new Fled(
    async () =>
      await BlockchainLiquidityV3Api.getPoolStorage(
        defined(this.rootStore.tezos, 'tezos'),
        defined(this.address, 'address')
      ),
    t
  );

  get itemIsLoading() {
    return this.itemSore.isLoading;
  }

  get item() {
    return this.itemSore.model;
  }
  //#endregion dex two liquidity item store

  constructor(private rootStore: RootStore) {
    makeObservable(this, {
      itemSore: observable,
      error: observable,
      item: computed,
      contractAddress: computed,
      itemModel: computed,
      setAddress: action,
      setError: action
    });
  }

  setAddress(address: string) {
    this.address = address;
  }

  setError(error: Error) {
    this.error = error;
  }

  get itemModel() {
    return this.itemSore.model;
  }

  get contractAddress() {
    return this.address;
  }
}
