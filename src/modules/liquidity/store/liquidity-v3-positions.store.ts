import BigNumber from 'bignumber.js';
import { action, computed, makeObservable, observable } from 'mobx';

import { isExist } from '@shared/helpers';
import { Led, ModelBuilder } from '@shared/model-builder';
import { LoadingErrorData, RootStore } from '@shared/store';
import { Nullable } from '@shared/types';

import { LiquidityV3PositionsResponseModel } from '../models';
import { mockPositions } from '../pages/v3-item-page/mock-positions.constants';

const defaultPositionsResponse = { value: null };

@ModelBuilder()
export class LiquidityV3PositionsStore {
  poolId: Nullable<BigNumber>;
  //#region Quipuswap V3 pool positions
  @Led({
    default: defaultPositionsResponse,
    model: LiquidityV3PositionsResponseModel,
    loader: async self => await self.getPositions()
  })
  readonly positionsStore: LoadingErrorData<LiquidityV3PositionsResponseModel, typeof defaultPositionsResponse>;

  get positionsAreLoading() {
    return this.positionsStore.isLoading;
  }

  get positions() {
    return this.positionsStore.model.value;
  }
  //#endregion Quipuswap V3 pool positions

  constructor(private rootStore: RootStore) {
    makeObservable(this, {
      poolId: observable,
      setPoolId: action,
      positionsAreLoading: computed,
      positions: computed
    });
  }

  setPoolId(id: BigNumber) {
    this.poolId = id;
  }

  async getPositions() {
    const value = isExist(this.rootStore.authStore.accountPkh) ? mockPositions : [];

    return { value };
  }
}
