import { BigNumber } from 'bignumber.js';
import { computed, makeObservable, observable } from 'mobx';

import { getFarmingListCommonApi, getFarmingListUserBalances } from '@modules/farming/api';
import {
  FarmingListBalancesModel,
  FarmingListItemBalancesModel,
  FarmingListItemModel,
  FarmingListResponseModel
} from '@modules/farming/models';
import { defined, isEmptyArray, saveBigNumber, toReal } from '@shared/helpers';
import { Led, ModelBuilder } from '@shared/model-builder';
import { LoadingErrorData, RootStore } from '@shared/store';
import { Nullable, Undefined } from '@shared/types';

import { FarmingListItemWithBalances } from '../pages/list/types';

const defaultList = {
  list: []
};

const defaultListBalances = {
  balances: [] as FarmingListItemBalancesModel[]
};

@ModelBuilder()
export class FarmingListStore {
  @Led({
    default: defaultList,
    loader: getFarmingListCommonApi,
    model: FarmingListResponseModel
  })
  readonly listStore: LoadingErrorData<FarmingListResponseModel, typeof defaultList>;

  //#region farming list balances store
  @Led({
    default: defaultListBalances,
    loader: async (self: FarmingListStore) =>
      getFarmingListUserBalances(self.rootStore.authStore.accountPkh, self.rootStore.tezos, self.list),
    model: FarmingListBalancesModel
  })
  readonly listBalancesStore: LoadingErrorData<FarmingListBalancesModel, typeof defaultListBalances>;
  //#endregion farming list balances store

  constructor(private rootStore: RootStore) {
    makeObservable(this, {
      listStore: observable,

      list: computed
    });
  }

  get list() {
    return this.listStore.model.list.map(({ item }) => item);
  }

  get isLoading() {
    return this.listStore.isLoading;
  }

  get farmingItemsWithBalances(): FarmingListItemWithBalances[] {
    return isEmptyArray(this.listBalances) ? this.list : this.listBalances;
  }

  get listBalances(): FarmingListItemWithBalances[] {
    const { balances } = this.listBalancesStore.model;

    return balances
      .map(balance => ({
        balance,
        farmingItemModel: this.getFarmingItemModelById(balance.id, balance.contractAddress)
      }))
      .map(({ balance, farmingItemModel }) => {
        const myBalance =
          farmingItemModel && balance.myBalance
            ? toReal(saveBigNumber(balance.myBalance, new BigNumber('0')), farmingItemModel.stakedToken)
            : null;
        const depositBalance =
          farmingItemModel && balance.depositBalance
            ? toReal(saveBigNumber(balance.depositBalance, new BigNumber('0')), farmingItemModel.stakedToken)
            : null;
        const earnBalance =
          farmingItemModel && balance.earnBalance
            ? toReal(saveBigNumber(balance.earnBalance, new BigNumber('0')), farmingItemModel.rewardToken)
            : null;

        return {
          ...balance,
          ...defined(farmingItemModel, balance.id),
          myBalance,
          depositBalance,
          earnBalance
        };
      });
  }

  getFarmingItemModelById(id: string, contractAddress?: string): Nullable<FarmingListItemModel> {
    return (this.listStore.model as FarmingListResponseModel).getFarmingItemModelById?.(id, contractAddress);
  }

  getFarmingItemBalancesModelById(id: string): Undefined<FarmingListItemBalancesModel> {
    return (this.listBalancesStore.model as FarmingListBalancesModel).getFarmingItemBalancesModelById?.(id);
  }
}
