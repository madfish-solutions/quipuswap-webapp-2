import { BigNumber } from 'bignumber.js';
import { computed, makeObservable } from 'mobx';

import { RootStore } from '@shared/store';

import { PoolType } from '../interfaces';

export class NewLiquidityItemStore {
  private readonly _id: BigNumber = new BigNumber(33);
  private readonly _type: string = PoolType.DEX_TWO;

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

  get item() {
    return this.rootStore.newLiquidityListStore!.list.find(
      ({ item: { id, type } }) => Number(id) === Number(this._id) && type === this._type
    )!.item;
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
    return `${this.contractAddress}_${this.item.id}`;
  }

  get accordanceItem() {
    return this.rootStore.newLiquidityListStore!.list.find(itemModel => {
      return itemModel.item.accordanceSlug === this.accordanceSlug;
    });
  }
}
