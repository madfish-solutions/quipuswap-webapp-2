import { computed, makeObservable } from 'mobx';

import { Led, ModelBuilder } from '@shared/model-builder';
import { LoadingErrorData, RootStore } from '@shared/store';

import { getDexTwoLiquidityItemApi } from '../api/get-dex-two-liquidity-item.api';
import { LiquidityItemModel } from '../models';

@ModelBuilder()
export class NewLiquidityItemStore {
  tokenPairSlug: string;

  //#region dex two liquidity item store
  @Led({
    default: { item: null },
    loader: async self => await getDexTwoLiquidityItemApi(self.tokenPairSlug),
    model: LiquidityItemModel
  })
  readonly itemSore: LoadingErrorData<LiquidityItemModel, { item: null }>;

  get item() {
    return this.itemSore?.model.item;
  }
  //#endregion dex two liquidity item store

  constructor(private rootStore: RootStore) {
    makeObservable(this, {
      item: computed
    });
  }

  setTokenPairSlug(tokenPairSlug: string) {
    this.tokenPairSlug = tokenPairSlug;
  }
}
