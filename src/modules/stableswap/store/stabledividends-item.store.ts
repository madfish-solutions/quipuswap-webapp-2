import { BigNumber } from 'bignumber.js';
import { action, computed, makeObservable, observable } from 'mobx';

import { getFirstElement, isNull } from '@shared/helpers';
import { Led, ModelBuilder } from '@shared/model-builder';
import { LoadingErrorData, RootStore } from '@shared/store';
import { Nullable } from '@shared/types';

import { getStableDividendsItemApi, getStakerInfo } from '../api';
import { StableswapDividendsItemResponseModel, StableswapDividendsItemModel, StakerInfoResponseModel } from '../models';

@ModelBuilder()
export class StableDividendsItemStore {
  poolId: Nullable<BigNumber> = null;

  //#region item store
  @Led({
    default: { item: null },
    loader: async self => ({ item: await getStableDividendsItemApi(self.poolId) }),
    model: StableswapDividendsItemResponseModel
  })
  readonly itemStore: LoadingErrorData<StableswapDividendsItemResponseModel, { item: null }>;

  get item(): Nullable<StableswapDividendsItemModel> {
    return this.itemStore.model.item;
  }
  //#endregion item store

  //#region staker info store
  @Led({
    default: { item: null },
    loader: async self => await self.getstakerInfo(),
    model: StakerInfoResponseModel
  })
  readonly stakerInfoStore: LoadingErrorData<StakerInfoResponseModel, { item: null }>;

  get userInfo() {
    return this.stakerInfoStore.model.item;
  }
  //#endregion staker info store

  constructor(private rootStore: RootStore) {
    makeObservable(this, {
      poolId: observable,

      setPoolId: action,

      item: computed,
      userInfo: computed
    });
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
