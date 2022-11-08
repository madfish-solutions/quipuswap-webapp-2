import { BigNumber } from 'bignumber.js';
import { computed, makeObservable, observable } from 'mobx';

import { getFarmingListCommonApi, getFarmingListUserBalances } from '@modules/farming/api';
import {
  FarmingListBalancesModel,
  FarmingListItemBalancesModel,
  FarmingListItemModel,
  FarmingListResponseModel
} from '@modules/farming/models';
import { isEmptyArray, saveBigNumber, toReal } from '@shared/helpers';
import { Led, ModelBuilder } from '@shared/model-builder';
import { LoadingErrorData, RootStore } from '@shared/store';
import { Undefined } from '@shared/types';

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

  //TODO: change name
  get list() {
    return this.listStore.model.list.map(({ item }) => item);
  }

  get isLoading() {
    return this.listStore.isLoading;
  }

  get farmingItemsWithBalances() {
    return isEmptyArray(this.listBalances) ? this.list : this.listBalances;
  }

  get filteredList() {
    //@ts-ignore
    return this.rootStore.farmingFilterStore?.filterAndSort(this.farmingItemsWithBalances);
  }

  get listBalances() {
    const balances = this.listBalancesStore.model.balances;

    return balances.map(balance => {
      const farmingItemModel = this.getFarmingItemModelById(balance.id, balance.contractAddress);

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
        ...farmingItemModel,
        myBalance,
        depositBalance,
        earnBalance
      };
    });
  }

  getFarmingItemModelById(id: string, contractAddress?: string): Undefined<FarmingListItemModel> {
    return (this.listStore.model as FarmingListResponseModel).getFarmingItemModelById?.(id, contractAddress);
  }

  getFarmingItemBalancesModelById(id: string): Undefined<FarmingListItemBalancesModel> {
    return (this.listBalancesStore.model as FarmingListBalancesModel).getFarmingItemBalancesModelById?.(id);
  }
}
