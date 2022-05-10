import { BigNumber } from 'bignumber.js';
import { action, computed, makeObservable, observable } from 'mobx';

import { LoadingErrorData, RootStore } from '@shared/store';
import { Nullable, Undefined } from '@shared/types';

import { getStableswapItemApi } from '../api';
import { poolItemMapper } from '../mapping';
import { IRawStableswapItem, StableswapItem, StableswapFormTabs } from '../types';

export class StableswapItemStore {
  poolId: Nullable<BigNumber> = null;

  readonly itemStore = new LoadingErrorData<IRawStableswapItem['item'], Nullable<StableswapItem>>(
    null,
    async () => await getStableswapItemApi(this.poolId),
    poolItemMapper
  );

  currentTab: StableswapFormTabs = StableswapFormTabs.add;
  inputAmounts: Array<string> = [];

  constructor(private rootStore: RootStore) {
    makeObservable(this, {
      poolId: observable,
      currentTab: observable,
      inputAmounts: observable,

      initInputAmounts: action,
      setPoolId: action,
      setTab: action,
      setInputAmount: action,

      item: computed
    });
  }

  get item() {
    return this.itemStore.data;
  }

  initInputAmounts(length: number) {
    this.inputAmounts = Array(length).fill('');
  }

  setPoolId(poolId: BigNumber) {
    this.poolId = poolId;
  }

  setTab(tab: StableswapFormTabs) {
    this.currentTab = tab;
  }

  setInputAmount(amount: string, index: number) {
    this.inputAmounts[index] = amount;
  }

  getInputAmount(index: number): Undefined<string> {
    return this.inputAmounts[index];
  }
}
