import BigNumber from 'bignumber.js';
import { action, computed, makeObservable, observable } from 'mobx';

import { getUserBalance } from '@blockchain';
import { FIRST_INDEX, ZERO_AMOUNT_BN } from '@config/constants';
import { defined, isNull, isTokenAddressFa2, t } from '@shared/helpers';
import { mapTokenAddress } from '@shared/mapping';
import { Led, ModelBuilder } from '@shared/model-builder';
import { Fled } from '@shared/model-builder/fled';
import { LoadingErrorData, RootStore } from '@shared/store';
import { Nullable, Standard } from '@shared/types';

import { V3LiquidityPoolApi } from '../api';
import { LiquidityContractTokenBalancesModel, LiquidityItemModel } from '../models';

const DEFAULT_CONTRACT_TOKENS_BALANCE = { tokenXBalance: ZERO_AMOUNT_BN, tokenYBalance: ZERO_AMOUNT_BN };
@ModelBuilder()
export class LiquidityV3PoolStore {
  poolId: Nullable<BigNumber> = null;
  activeTokenIndex = FIRST_INDEX;

  //#region Quipuswap V3 pool tokens balance store
  @Led({
    default: DEFAULT_CONTRACT_TOKENS_BALANCE,
    loader: async self => await self.getPoolTokenBalances(),
    model: LiquidityContractTokenBalancesModel
  })
  readonly contractBalanceStore: LoadingErrorData<
    LiquidityContractTokenBalancesModel,
    typeof DEFAULT_CONTRACT_TOKENS_BALANCE
  >;

  get contractBalance() {
    return this.contractBalanceStore.model;
  }
  //#endregion Quipuswap V3 pool tokens balance store

  //#region Quipuswap V3 liquidity pool store
  readonly poolStore = new Fled(
    async () => await V3LiquidityPoolApi.getPool(defined(this.rootStore.tezos, 'tezos'), defined(this.poolId, 'id')),
    t
  );
  //#endregion Quipuswap V3 liquidity pool store

  //#region Quipuswap V3 liquidity item store
  @Led({
    default: { item: null },
    loader: async self => await V3LiquidityPoolApi.getLiquidityV3Item(self.poolId),
    model: LiquidityItemModel
  })
  readonly itemStore: LoadingErrorData<LiquidityItemModel, { item: null }>;
  //#endregion Quipuswap V3 liquidity item store

  get itemIsLoading() {
    return this.poolStore.isLoading || this.itemStore.isLoading;
  }

  get item() {
    return this.poolStore.model;
  }

  constructor(private rootStore: RootStore) {
    makeObservable(this, {
      poolStore: observable,
      activeTokenIndex: observable,
      item: computed,
      itemModel: computed,
      feeBps: computed,
      sqrtPrice: computed,
      contractAddress: computed,
      error: computed,
      setPoolId: action,
      setActiveTokenIndex: action
    });
  }

  get error() {
    return this.poolStore.error;
  }

  setPoolId(id: BigNumber) {
    this.poolId = id;
  }

  setActiveTokenIndex(tokenIndex: number) {
    this.activeTokenIndex = tokenIndex;
  }

  get itemModel() {
    return this.poolStore.model;
  }

  get feeBps() {
    return this.poolStore.rawData?.storage.constants.fee_bps;
  }

  get sqrtPrice() {
    return this.poolStore.rawData?.storage.sqrt_price;
  }

  get contractAddress() {
    return this.item?.contractAddress;
  }

  async getPoolTokenBalances() {
    const { tezos } = this.rootStore;

    if (isNull(tezos) || isNull(this.item)) {
      return DEFAULT_CONTRACT_TOKENS_BALANCE;
    }

    const tokenXInfo = mapTokenAddress(this.item.storage.constants.token_x);
    const tokenYInfo = mapTokenAddress(this.item.storage.constants.token_y);

    const tokenXBalance = await getUserBalance(
      tezos,
      this.item.contractAddress,
      tokenXInfo.contractAddress,
      isTokenAddressFa2(tokenXInfo) ? Standard.Fa2 : Standard.Fa12,
      tokenXInfo.fa2TokenId
    );

    const tokenYBalance = await getUserBalance(
      tezos,
      this.item.contractAddress,
      tokenYInfo.contractAddress,
      isTokenAddressFa2(tokenYInfo) ? Standard.Fa2 : Standard.Fa12,
      tokenYInfo.fa2TokenId
    );

    return {
      tokenXBalance,
      tokenYBalance
    };
  }
}
