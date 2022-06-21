import { BigNumber } from 'bignumber.js';
import { action, computed, makeObservable, observable } from 'mobx';

import { getFirstElement, isNull } from '@shared/helpers';
import { noopMap } from '@shared/mapping';
import { LoadingErrorData, RootStore } from '@shared/store';
import { Nullable } from '@shared/types';

import { getStableFarmItemApi, getStakerInfo } from '../api';
import { farmItemMapper } from '../mapping';
import { IRawStableFarmItem, RawStakerInfo, StableFarmItem } from '../types';

export class StableFarmItemStore {
  poolId: Nullable<BigNumber> = null;

  readonly itemStore = new LoadingErrorData<IRawStableFarmItem['item'], Nullable<StableFarmItem>>(
    null,
    async () => await getStableFarmItemApi(this.poolId),
    farmItemMapper
  );

  readonly stakerInfoStore = new LoadingErrorData<Nullable<RawStakerInfo>, Nullable<RawStakerInfo>>(
    null,
    async () => await this.getstakerInfo(),
    noopMap
  );

  constructor(private rootStore: RootStore) {
    makeObservable(this, {
      poolId: observable,

      setPoolId: action,

      item: computed,
      userInfo: computed
    });
  }

  get item() {
    return this.itemStore.data;
  }

  get userInfo() {
    return this.stakerInfoStore.data;
  }

  setPoolId(poolId: BigNumber) {
    this.poolId = poolId;
  }

  private async getstakerInfo() {
    if (isNull(this.item)) {
      return null;
    }

    const stakerInfo = await getStakerInfo(this.rootStore.tezos, [this.item], this.rootStore.authStore.accountPkh);

    return getFirstElement(stakerInfo);
  }
}
