import { action, computed, makeObservable, observable } from 'mobx';

import { defined, isNotFoundError } from '@shared/helpers';
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
      await BlockchainLiquidityV3Api.getPoolContract(defined(this.rootStore.tezos), defined(this.address, 'address')),
    a => a
  );

  get itemIsLoading() {
    return this.itemSore.isLoading;
  }

  get item() {
    return this.itemSore.model;
  }

  get isNotFound() {
    return (
      !this.address || (!this.item && !this.itemIsLoading && !this.error) || (this.error && isNotFoundError(this.error))
    );
  }
  //#endregion dex two liquidity item store

  constructor(private rootStore: RootStore) {
    makeObservable(this, {
      itemSore: observable,
      error: observable,
      item: computed,
      contractAddress: computed,
      isNotFound: computed,
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
