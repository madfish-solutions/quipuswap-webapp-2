import BigNumber from 'bignumber.js';
import { action, computed, makeObservable, observable } from 'mobx';

import { isNull } from '@shared/helpers';
import { Led, ModelBuilder } from '@shared/model-builder';
import { LoadingErrorData, RootStore } from '@shared/store';
import { Nullable } from '@shared/types';

import { BlockchainLiquidityV3Api } from '../api';
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
    const { tezos } = this.rootStore;
    const { accountPkh } = this.rootStore.authStore;

    if (isNull(tezos) || isNull(accountPkh) || isNull(this.poolId)) {
      return { value: [] };
    }

    return { value: await BlockchainLiquidityV3Api.getPositions(tezos, accountPkh, this.poolId) };
  }
}
