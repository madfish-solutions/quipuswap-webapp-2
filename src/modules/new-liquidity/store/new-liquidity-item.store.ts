import { computed, makeObservable } from 'mobx';

import { EMPTY_STRING } from '@config/constants';
import { getSymbolsString } from '@shared/helpers';
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

  get pageTitle() {
    const tokens = this.item?.tokensInfo.map(({ token }) => token);

    return tokens ? getSymbolsString(tokens) : EMPTY_STRING;
  }

  constructor(private rootStore: RootStore) {
    makeObservable(this, {
      item: computed,
      contractAddress: computed,
      id: computed,
      aTokenAtomicTvl: computed,
      bTokenAtomicTvl: computed,
      totalLpSupply: computed,
      type: computed,
      accordanceItem: computed
    });
  }

  setTokenPairSlug(tokenPairSlug: string) {
    this.tokenPairSlug = tokenPairSlug;
  }

  get itemModel() {
    return this.rootStore.newLiquidityListStore!.list.find(
      ({ item: { id, type } }) => Number(id) === Number(this._id) && type === this._type
    )!;
  }

  get contractAddress() {
    return this.itemModel.contractAddress;
  }

  get id() {
    return this.itemModel.id;
  }

  get aTokenAtomicTvl() {
    return this.itemModel.aTokenAtomicTvl;
  }

  get bTokenAtomicTvl() {
    return this.itemModel.bTokenAtomicTvl;
  }

  get totalLpSupply() {
    return this.itemModel.totalLpSupply;
  }

  get type() {
    return this.itemModel.type;
  }

  get accordanceSlug() {
    return `${this.contractAddress}_${this.item?.id}`;
  }

  get accordanceItem() {
    return this.rootStore.newLiquidityListStore!.list.find(itemModel => {
      return itemModel.item.accordanceSlug === this.accordanceSlug;
    });
  }
}
