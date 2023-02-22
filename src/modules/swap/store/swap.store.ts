import { computed, makeObservable } from 'mobx';

import { EMPTY_STRING, ZERO_AMOUNT_BN } from '@config/constants';
import { Led, ModelBuilder } from '@shared/model-builder';
import { LoadingErrorData } from '@shared/store';

import { ThreeRouteBackendApi } from '../api';
import { ThreeRouteSwapResponseModel, ThreeRouteTokenModel, ThreeRouteTokensResponseModel } from '../models';
import { ThreeRouteSwapResponse, ThreeRouteToken } from '../types';

const defaultThreeTokensListResponse = { tokens: [] as ThreeRouteTokenModel[] };
const defaultThreeRouteSwapResponse = {
  input: ZERO_AMOUNT_BN,
  output: ZERO_AMOUNT_BN,
  chains: []
};

// TODO: move all logic from 'providers' directory here
@ModelBuilder()
export class SwapStore {
  //#region don't make them observable
  inputTokenSymbol = EMPTY_STRING;
  outputTokenSymbol = EMPTY_STRING;
  realAmount = ZERO_AMOUNT_BN;
  //#endregion don't make them observable

  //#region 3route tokens
  @Led({
    default: defaultThreeTokensListResponse,
    model: ThreeRouteTokensResponseModel,
    loader: async () => ({ tokens: await ThreeRouteBackendApi.getTokens() })
  })
  readonly threeRouteTokensStore: LoadingErrorData<
    ThreeRouteTokensResponseModel,
    typeof defaultThreeTokensListResponse
  >;

  get threeRouteTokensAreLoading() {
    return this.threeRouteTokensStore.isLoading;
  }

  get threeRouteTokens() {
    return this.threeRouteTokensStore.model.tokens as ThreeRouteToken[];
  }
  //#endregion 3route tokens

  //#region 3route swap
  @Led({
    default: defaultThreeRouteSwapResponse,
    model: ThreeRouteSwapResponseModel,
    loader: async self =>
      await ThreeRouteBackendApi.getSwap(self.inputTokenSymbol, self.outputTokenSymbol, self.realAmount)
  })
  readonly threeRouteSwapStore: LoadingErrorData<ThreeRouteSwapResponseModel, typeof defaultThreeRouteSwapResponse>;

  get threeRouteSwapIsLoading() {
    return this.threeRouteSwapStore.isLoading;
  }

  get threeRouteSwap(): ThreeRouteSwapResponse {
    return this.threeRouteSwapStore.model;
  }
  //#endregion 3route swap

  constructor() {
    makeObservable(this, {
      threeRouteTokensAreLoading: computed,
      threeRouteTokens: computed
    });
  }
}
