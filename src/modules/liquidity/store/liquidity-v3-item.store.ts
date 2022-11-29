import BigNumber from 'bignumber.js';
import { action, computed, makeObservable, observable } from 'mobx';

import { getUserBalance } from '@blockchain';
import { ZERO_AMOUNT_BN } from '@config/constants';
import { defined, isNull, isTokenAddressFa2, t } from '@shared/helpers';
import { mapTokenAddress } from '@shared/mapping';
import { Led, ModelBuilder } from '@shared/model-builder';
import { Fled } from '@shared/model-builder/fled';
import { LoadingErrorData, RootStore } from '@shared/store';
import { Nullable, Standard } from '@shared/types';

import { BlockchainLiquidityV3Api } from '../api';
import { LiquidityContractTokenBalancesModel } from '../models';

const DEFAULT_CONTRACT_TOKENS_BALANCE = { tokenXBalance: ZERO_AMOUNT_BN, tokenYBalance: ZERO_AMOUNT_BN };

@ModelBuilder()
export class LiquidityV3ItemStore {
  error: Nullable<Error> = null;
  id: Nullable<BigNumber> = null;

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
    async () => await BlockchainLiquidityV3Api.getPool(defined(this.rootStore.tezos, 'tezos'), defined(this.id, 'id')),
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
      error: observable,
      item: computed,
      itemModel: computed,
      setId: action,
      setError: action
    });
  }

  setId(id: BigNumber) {
    this.id = id;
  }

  setError(error: Error) {
    this.error = error;
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

  async getPoolTokenBalances() {
    const { tezos } = this.rootStore;

    if (isNull(tezos) || isNull(this.item)) {
      return DEFAULT_CONTRACT_TOKENS_BALANCE;
    }

    const tokenXInfo = mapTokenAddress(this.item.storage.constants.token_x);
    const tokenYInfo = mapTokenAddress(this.item.storage.constants.token_x);

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
