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
import { LiquidityContractTokenBalancesModel } from '../models/liquidity-contract-token-balances';

const DEFAULT_CONTRACT_TOKENS_BALANCE = { token_x_balance: ZERO_AMOUNT_BN, token_y_balance: ZERO_AMOUNT_BN };

export class LiquidityV3ItemStore {
  error: Nullable<Error> = null;
  id: Nullable<BigNumber> = null;
  
  //#region Quipuswap V3 contract balance store
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

  //#region Quipuswap V3 contract balance store

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
  
  async getPoolTokenBalances() {
    const { tezos } = this.rootStore;

    if (isNull(tezos) || isNull(this.contractAddress) || isNull(this.item)) {
      return DEFAULT_CONTRACT_TOKENS_BALANCE;
    }

    const tokenInfo = mapTokenAddress(this.item.constants.token_x);

    const token_x_balance = await getUserBalance(
      tezos,
      this.contractAddress,
      tokenInfo.contractAddress,
      isTokenAddressFa2(tokenInfo) ? Standard.Fa2 : Standard.Fa12,
      tokenInfo.fa2TokenId
    );

    const token_y_balance = await getUserBalance(
      tezos,
      this.contractAddress,
      tokenInfo.contractAddress,
      isTokenAddressFa2(tokenInfo) ? Standard.Fa2 : Standard.Fa12,
      tokenInfo.fa2TokenId
    );

    return {
      token_x_balance,
      token_y_balance
    };
  }
}
