import BigNumber from 'bignumber.js';
import { action, computed, makeObservable, observable } from 'mobx';

import { getUserBalance } from '@blockchain';
import { FIRST_INDEX, ZERO_AMOUNT_BN } from '@config/constants';
import { defined, isNull, isTokenAddressFa2, t } from '@shared/helpers';
import { Led, ModelBuilder } from '@shared/model-builder';
import { Fled } from '@shared/model-builder/fled';
import { LoadingErrorData, RootStore } from '@shared/store';
import { Nullable, Standard } from '@shared/types';

import { V3LiquidityPoolApi } from '../api';
import { mapV3TokenAddress } from '../helpers';
import { LiquidityContractTokenBalancesModel } from '../models';

const DEFAULT_CONTRACT_TOKENS_BALANCE = { tokenXBalance: ZERO_AMOUNT_BN, tokenYBalance: ZERO_AMOUNT_BN };
@ModelBuilder()
export class LiquidityV3PoolStore {
  poolId: Nullable<BigNumber> = null;
  activeTokenIndex = FIRST_INDEX;

  //# Quipuswap V3 pool tokens balance store
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

  //# Quipuswap V3 pool tokens balance store

  //#region Quipuswap V3 liquidity item store
  readonly itemSore = new Fled(
    async () => await V3LiquidityPoolApi.getPool(defined(this.rootStore.tezos, 'tezos'), defined(this.poolId, 'id')),
    t
  );

  get itemIsLoading() {
    return this.itemSore.isLoading;
  }

  get item() {
    return this.itemSore.model;
  }
  //#endregion Quipuswap V3 liquidity item store

  constructor(private rootStore: RootStore) {
    makeObservable(this, {
      itemSore: observable,
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
    return this.itemSore.error;
  }

  setPoolId(id: BigNumber) {
    this.poolId = id;
  }

  setActiveTokenIndex(tokenIndex: number) {
    this.activeTokenIndex = tokenIndex;
  }

  get itemModel() {
    return this.itemSore.model;
  }

  get feeBps() {
    return this.itemSore.rawData?.storage.constants.fee_bps;
  }

  get sqrtPrice() {
    return this.itemSore.rawData?.storage.sqrt_price;
  }

  get contractAddress() {
    return this.item?.contractAddress;
  }

  async getPoolTokenBalances() {
    const { tezos } = this.rootStore;

    if (isNull(tezos) || isNull(this.item)) {
      return DEFAULT_CONTRACT_TOKENS_BALANCE;
    }

    const tokenXInfo = mapV3TokenAddress(this.item.storage.constants.token_x);
    const tokenYInfo = mapV3TokenAddress(this.item.storage.constants.token_y);

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
