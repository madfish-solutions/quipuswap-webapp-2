import { computed, makeObservable, observable } from 'mobx';

import { EMPTY_STRING, FIRST_TUPLE_INDEX, SECOND_TUPLE_INDEX, ZERO_AMOUNT_BN } from '@config/constants';
import { getSymbolsString } from '@shared/helpers';
import { Led, ModelBuilder } from '@shared/model-builder';
import { LoadingErrorData, RootStore } from '@shared/store';
import { Undefined } from '@shared/types';

import { getDexTwoLiquidityItemApi } from '../api/get-dex-two-liquidity-item.api';
import { LiquidityItemModel } from '../models';

@ModelBuilder()
export class LiquidityItemStore {
  tokenPairSlug: string;

  //#region dex two liquidity item store
  @Led({
    default: { item: null },
    loader: async self => await getDexTwoLiquidityItemApi(self.tokenPairSlug),
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

  get pageTitle() {
    const tokens = this.item?.tokensInfo.map(({ token }) => token);

    return tokens ? getSymbolsString(tokens) : EMPTY_STRING;
  }

  constructor(private rootStore: RootStore) {
    makeObservable(this, {
      itemSore: observable,
      item: computed,
      contractAddress: computed,
      id: computed,
      aTokenAtomicTvl: computed,
      bTokenAtomicTvl: computed,
      totalLpSupply: computed,
      type: computed,
      accordanceItem: computed,
      itemModel: computed
    });
  }

  setTokenPairSlug(tokenPairSlug: string) {
    this.tokenPairSlug = tokenPairSlug;
  }

  get itemModel() {
    return this.itemSore.model;
  }

  get contractAddress() {
    return this.item?.contractAddress || EMPTY_STRING;
  }

  get id() {
    return this.item?.id || ZERO_AMOUNT_BN;
  }

  get aTokenAtomicTvl() {
    return this.item?.tokensInfo[FIRST_TUPLE_INDEX].atomicTokenTvl || ZERO_AMOUNT_BN;
  }

  get bTokenAtomicTvl() {
    return this.item?.tokensInfo[SECOND_TUPLE_INDEX].atomicTokenTvl || ZERO_AMOUNT_BN;
  }

  get totalLpSupply() {
    return this.item?.totalSupply || ZERO_AMOUNT_BN;
  }

  get type() {
    return this.item?.type || EMPTY_STRING;
  }

  get accordanceSlug() {
    return `${this.contractAddress}_${this.item?.id}`;
  }

  get accordanceItem(): Undefined<LiquidityItemModel> {
    return this.rootStore.liquidityListStore?.list.find(itemModel => {
      return itemModel.item.accordanceSlug === this.accordanceSlug;
    });
  }
}
