import BigNumber from 'bignumber.js';
import { action, computed, makeObservable, observable } from 'mobx';

import { Led, ModelBuilder } from '@shared/model-builder';
import { LoadingErrorData, RootStore } from '@shared/store';
import { Nullable } from '@shared/types';

import { LiquidityV3PositionsResponseModel } from '../models';

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
    /* eslint-disable @typescript-eslint/no-magic-numbers */
    return {
      value: [
        {
          id: new BigNumber(0),
          minRange: new BigNumber(1.09e12),
          maxRange: new BigNumber(1.11e12),
          liqAmount: new BigNumber(686),
          tokenXFees: new BigNumber(1e18),
          tokenYFees: new BigNumber(986667)
        },
        {
          id: new BigNumber(1),
          minRange: new BigNumber(1.07e12),
          maxRange: new BigNumber(1.09e12),
          liqAmount: new BigNumber(686),
          tokenXFees: new BigNumber(1e18),
          tokenYFees: new BigNumber(986667)
        },
        {
          id: new BigNumber(2),
          minRange: new BigNumber(1.11e12),
          maxRange: new BigNumber(1.13e12),
          liqAmount: new BigNumber(686),
          tokenXFees: new BigNumber(1e18),
          tokenYFees: new BigNumber(986667)
        }
      ]
    };
    /* eslint-enable */
  }
}
