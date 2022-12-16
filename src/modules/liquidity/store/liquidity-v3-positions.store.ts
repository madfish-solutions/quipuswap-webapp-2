import { computed, makeObservable } from 'mobx';

import { isNull } from '@shared/helpers';
import { Led, ModelBuilder } from '@shared/model-builder';
import { LoadingErrorData, RootStore } from '@shared/store';

import { V3LiquidityPoolApi } from '../api';
import { LiquidityV3PositionsResponseModel } from '../models';

const defaultPositionsResponse = { value: null };
const emptyPositionsListResponse = { value: [] };

@ModelBuilder()
export class LiquidityV3PositionsStore {
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

  get poolId() {
    return this.rootStore.liquidityV3PoolStore?.poolId ?? null;
  }

  constructor(private rootStore: RootStore) {
    makeObservable(this, {
      poolId: computed,
      positionsAreLoading: computed,
      positions: computed
    });
  }

  async getPositions() {
    const { tezos } = this.rootStore;
    const { accountPkh } = this.rootStore.authStore;

    if (isNull(tezos) || isNull(accountPkh) || isNull(this.poolId)) {
      return emptyPositionsListResponse;
    }

    return { value: await V3LiquidityPoolApi.getUserPositionsWithTicks(tezos, accountPkh, this.poolId) };
  }
}
