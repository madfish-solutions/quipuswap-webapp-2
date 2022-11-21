import { action, computed, makeObservable, observable } from 'mobx';

import { defined } from '@shared/helpers';
import { Led, ModelBuilder } from '@shared/model-builder';
import { LoadingErrorData, RootStore } from '@shared/store';
import { Nullable } from '@shared/types';

import { getV3LiquidityItemApi } from '../api';
import { LiquidityItemModel } from '../models';

@ModelBuilder()
export class LiquidityV3ItemStore {
  address: Nullable<string> = null;
  error: Nullable<Error> = null;

  //#region dex two liquidity item store
  @Led({
    default: { item: null },
    loader: async (self: LiquidityV3ItemStore) => await getV3LiquidityItemApi(defined(self.address, 'address')),
    model: LiquidityItemModel
  })
  readonly itemSore: LoadingErrorData<LiquidityItemModel, { item: null }>;

  get itemIsLoading() {
    return this.itemSore.isLoading;
  }

  get item() {
    return this.itemSore.model.item;
  }
  //#endregion dex two liquidity item store

  constructor(private rootStore: RootStore) {
    makeObservable(this, {
      itemSore: observable,
      error: observable,
      item: computed,
      contractAddress: computed,
      id: computed,
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

  get id() {
    return this.item?.id || null;
  }
}
