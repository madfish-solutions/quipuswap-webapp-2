import { BigNumber } from 'bignumber.js';
import { action, computed, makeObservable, observable } from 'mobx';

import { getFirstElement, isNull } from '@shared/helpers';
import { Led, ModelBuilder } from '@shared/model-builder';
import { LoadingErrorDataNew, RootStore } from '@shared/store';
import { Nullable } from '@shared/types';

import { getStableDividendsItemApi, getStakerInfo } from '../api';
import { StableswapDividendsItemResponseModel, StableswapDividendsItemModel, StakerInfoResponseModel } from '../models';

@ModelBuilder()
export class StableDividendsItemStore {
  poolId: Nullable<BigNumber> = null;

  @Led({
    default: { item: null },
    loader: async self => ({ item: await getStableDividendsItemApi(self.poolId) }),
    model: StableswapDividendsItemResponseModel
  })
  readonly itemStore: LoadingErrorDataNew<StableswapDividendsItemResponseModel, { item: null }>;

  @Led({
    default: { item: null },
    loader: async self => await self.getstakerInfo(),
    model: StakerInfoResponseModel
  })
  readonly stakerInfoStore: LoadingErrorDataNew<StakerInfoResponseModel, { item: null }>;

  constructor(private rootStore: RootStore) {
    makeObservable(this, {
      poolId: observable,

      setPoolId: action,

      item: computed,
      userInfo: computed
    });
  }

  get item(): Nullable<StableswapDividendsItemModel> {
    return this.itemStore.model.item;
  }

  get userInfo() {
    return this.stakerInfoStore.model.item;
  }

  setPoolId(poolId: BigNumber) {
    this.poolId = poolId;
  }

  async getstakerInfo() {
    if (isNull(this.item)) {
      return { item: null };
    }

    const stakerInfo = await getStakerInfo(this.rootStore.tezos, this.item, this.rootStore.authStore.accountPkh);

    return {
      item: getFirstElement(stakerInfo)
    };
  }
}
