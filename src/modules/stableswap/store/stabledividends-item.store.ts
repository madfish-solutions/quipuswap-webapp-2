import { BigNumber } from 'bignumber.js';
import { action, computed, makeObservable, observable } from 'mobx';

import { getFirstElement, isNull } from '@shared/helpers';
import { noopMap } from '@shared/mapping';
import { LoadingErrorData, RootStore } from '@shared/store';
import { Nullable } from '@shared/types';

import { getStableDividendsItemApi, getStakerInfo } from '../api';
import { stableDividendsItemMapper } from '../mapping';
import { IRawStableDividendsItem, RawStakerInfo, StableDividendsItem } from '../types';

export class StableDividendsItemStore {
  poolId: Nullable<BigNumber> = null;

  readonly itemStore = new LoadingErrorData<IRawStableDividendsItem['item'], Nullable<StableDividendsItem>>(
    null,
    async () => await getStableDividendsItemApi(this.poolId),
    stableDividendsItemMapper
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

    const stakerInfo = await getStakerInfo(this.rootStore.tezos, this.item, this.rootStore.authStore.accountPkh);

    return getFirstElement(stakerInfo);
  }
}
