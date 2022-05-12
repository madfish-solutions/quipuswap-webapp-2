import { BigNumber } from 'bignumber.js';
import { action, computed, makeObservable, observable } from 'mobx';

import { LoadingErrorData, RootStore } from '@shared/store';
import { Nullable } from '@shared/types';

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

  constructor(private rootStore: RootStore) {
    makeObservable(this, {
      poolId: observable,
      currentTab: observable,

      setPoolId: action,
      setTab: action,

      item: computed
    });
  }

  get item() {
    return this.itemStore.data;
  }

  setPoolId(poolId: BigNumber) {
    this.poolId = poolId;
  }

  setTab(tab: StableswapFormTabs) {
    this.currentTab = tab;
  }
}
