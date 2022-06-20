import { BigNumber } from 'bignumber.js';
import { action, computed, makeObservable, observable } from 'mobx';

import { LoadingErrorData, RootStore } from '@shared/store';
import { Nullable } from '@shared/types';

import { getStableFarmItemApi } from '../api';
import { farmItemMapper } from '../mapping';
import { IRawStableFarmItem, StableFarmItem } from '../types';

export class StableFarmItemStore {
  poolId: Nullable<BigNumber> = null;

  readonly itemStore = new LoadingErrorData<IRawStableFarmItem['item'], Nullable<StableFarmItem>>(
    null,
    async () => await getStableFarmItemApi(this.poolId),
    farmItemMapper
  );

  constructor(private rootStore: RootStore) {
    makeObservable(this, {
      poolId: observable,

      setPoolId: action,

      item: computed
    });
  }

  get item() {
    return this.itemStore.data;
  }

  setPoolId(poolId: BigNumber) {
    this.poolId = poolId;
  }
}
