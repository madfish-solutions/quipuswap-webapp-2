import { BigNumber } from 'bignumber.js';
import { computed, makeObservable } from 'mobx';

import { RootStore } from '@shared/store';

import { PoolType } from '../interfaces';

export class NewLiquidityItemStore {
  id: BigNumber = new BigNumber(3);
  type: string = PoolType.DEX_TWO;

  constructor(private rootStore: RootStore) {
    makeObservable(this, {
      item: computed
    });
  }

  get item() {
    return this.rootStore.newLiquidityListStore?.list.filter(
      ({ item: { id, type } }) => Number(id) === Number(this.id) && type === this.type
    )[0].item;
  }
}
