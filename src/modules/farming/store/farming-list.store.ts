import { computed, makeObservable, observable } from 'mobx';

import { FARMS_LIST_REWARD_UPDATE_INTERVAL } from '@config/constants';
import { getFarmingListCommonApi, getFarmingListUserBalances } from '@modules/farming/api';
import {
  FarmingListBalancesModel,
  FarmingListItemBalancesModel,
  FarmingListItemModel,
  FarmingListResponseModel
} from '@modules/farming/models';
import { defined, isEmptyArray, MakeInterval, toRealIfPossible } from '@shared/helpers';
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

  readonly updateBalancesInterval = new MakeInterval(async () => {
    if (!this.listBalancesStore.isLoading) {
      await this.listBalancesStore.load();
    }
  }, FARMS_LIST_REWARD_UPDATE_INTERVAL);

  constructor(private rootStore: RootStore) {
    makeObservable(this, {
      listStore: observable,

      list: computed
    });
  }

  makePendingRewardsLiveable() {
    this.updateBalancesInterval.start();
  }

  clearIntervals() {
    this.updateBalancesInterval.stop();
  }

  get list() {
    return this.listStore.model.list.map(({ item }) => item);
  }

  get isLoading() {
    return this.listStore.isLoading;
  }

  get balancesAreLoading() {
    return this.listBalancesStore.isLoading;
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
        const depositBalance = toRealIfPossible(balance.depositBalance, farmingItemModel?.stakedToken);
        const earnBalance = toRealIfPossible(balance.earnBalance, farmingItemModel?.rewardToken);
        const fullRewardBalance = toRealIfPossible(balance.fullRewardBalance, farmingItemModel?.rewardToken);

        return {
          ...balance,
          ...defined(farmingItemModel, balance.id),
          depositBalance,
          earnBalance,
          fullRewardBalance
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
