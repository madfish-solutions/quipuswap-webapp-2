import { action, makeObservable, observable } from 'mobx';

import { isExist } from '@shared/helpers';
import { BaseFilterStore, RootStore } from '@shared/store';
import { ActiveStatus } from '@shared/types';

import { sortFarmingList } from '../pages/list/helpers'; //TODO
import { FarmingListItemWithBalances, FarmingSortField } from '../pages/list/types';

export class FarmingFilterStore extends BaseFilterStore {
  stakedOnly = false;
  activeOnly = true;

  sortField: FarmingSortField = FarmingSortField.DEFAULT;

  constructor(rootStore: RootStore) {
    super(rootStore);

    makeObservable(this, {
      stakedOnly: observable,
      activeOnly: observable,
      sortField: observable,

      setStakedOnly: action,
      setActiveOnly: action,
      onSortFieldChange: action
    });
  }

  filterAndSort(list: Array<FarmingListItemWithBalances>) {
    let localList = [...list];
    if (this.stakedOnly) {
      localList = localList.filter(
        localItem => isExist(localItem.depositBalance) && localItem.depositBalance.isGreaterThan('0')
      );
    }

    if (this.activeOnly) {
      localList = localList.filter(({ stakeStatus }) => stakeStatus === ActiveStatus.ACTIVE);
    }

    if (this.search) {
      localList = localList.filter(
        ({ stakedToken, rewardToken, tokens }) =>
          this.searchToken(stakedToken, true) ||
          this.searchToken(rewardToken) ||
          tokens.some(token => this.searchToken(token))
      );
    }

    return sortFarmingList(localList, this.sortField, this.sortDirection);
  }

  setStakedOnly(state: boolean) {
    this.stakedOnly = state;
  }

  setActiveOnly(state: boolean) {
    this.activeOnly = state;
  }

  onSortFieldChange(field: FarmingSortField) {
    this.sortField = field;
  }
}
