import { BigNumber } from 'bignumber.js';
import { computed, makeObservable, observable } from 'mobx';

import { getFarmingListCommonApi, getFarmingListUserBalances } from '@modules/farming/api';
import {
  FarmingItemBalancesModel,
  FarmingItemCommonModel,
  FarmingListBalancesModel,
  FarmingListCommonResponseModel
} from '@modules/farming/models';
import { isEmptyArray, saveBigNumber, toReal } from '@shared/helpers';
import { Led, ModelBuilder } from '@shared/model-builder';
import { LoadingErrorData, RootStore } from '@shared/store';
import { Undefined } from '@shared/types';

const defaultList = {
  list: []
};

const defaultListBalances = {
  balances: [] as Array<FarmingItemBalancesModel>
};

@ModelBuilder()
export class FarmingListCommonStore {
  @Led({
    default: defaultList,
    loader: getFarmingListCommonApi,
    model: FarmingListCommonResponseModel
  })
  readonly listStore: LoadingErrorData<FarmingListCommonResponseModel, typeof defaultList>;

  //TODO: change name
  get listList() {
    return this.listStore.model.list.map(({ item }) => item);
  }

  get farmingItemsWithBalances() {
    return isEmptyArray(this.listBalances) ? this.listList : this.listBalances;
  }

  get list() {
    //TODO: Check for accountPkh!
    //@ts-ignore
    return this.rootStore.farmingFilterStore?.filterAndSort(this.farmingItemsWithBalances);
  }

  //#region farming list balances store
  @Led({
    default: defaultListBalances,
    loader: async (self: FarmingListCommonStore) =>
      getFarmingListUserBalances(self.accountPkh, self.tezos, self.listList),
    model: FarmingListBalancesModel
  })
  readonly listBalancesStore: LoadingErrorData<FarmingListBalancesModel, typeof defaultListBalances>;

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

  get accountPkh() {
    return this.rootStore.authStore.accountPkh;
  }

  get tezos() {
    return this.rootStore.tezos;
  }
  //#endregion farming list balances store

  constructor(private rootStore: RootStore) {
    makeObservable(this, {
      listStore: observable,

      listList: computed
    });
  }

  getFarmingItemModelById(id: string, contractAddress: string): Undefined<FarmingItemCommonModel> {
    return (this.listStore.model as FarmingListCommonResponseModel).getFarmingItemModelById?.(id, contractAddress);
  }

  getFarmingItemBalancesModelById(id: string): Undefined<FarmingItemBalancesModel> {
    return (this.listBalancesStore.model as FarmingListBalancesModel).getFarmingItemBalancesModelById?.(id);
  }
}
