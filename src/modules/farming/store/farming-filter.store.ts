import { action, makeObservable, observable } from 'mobx';

import { isExist } from '@shared/helpers';
import { BaseFilterStore } from '@shared/store';
import { ActiveStatus } from '@shared/types';

import { FarmingItem } from '../interfaces';
import { sortFarmingList, SortField } from '../pages/list/components'; //TODO

export class FarmingFilterStore extends BaseFilterStore {
  stakedOnly = false;
  activeOnly = true;

  sortField: SortField = SortField.ID;

  constructor() {
    super();

    makeObservable(this, {
      stakedOnly: observable,
      activeOnly: observable,
      sortField: observable,

      setStakedOnly: action,
      setActiveOnly: action,
      onSortFieldChange: action
    });
  }

  filterAndSort(list: Array<FarmingItem>) {
    let localList = [...list];
    if (this.stakedOnly) {
      localList = localList.filter(
        ({ depositBalance }) => isExist(depositBalance) && depositBalance.isGreaterThan('0')
      );
    }

    if (this.activeOnly) {
      localList = localList.filter(({ stakeStatus }) => stakeStatus === ActiveStatus.ACTIVE);
    }

    if (this.search) {
      localList = localList.filter(
        ({ stakedToken, rewardToken, tokenA, tokenB }) =>
          this.tokenMatchesSearch(stakedToken, true) ||
          this.tokenMatchesSearch(rewardToken) ||
          this.tokenMatchesSearch(tokenA) ||
          (isExist(tokenB) && this.tokenMatchesSearch(tokenB))
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

  onSortFieldChange(field: SortField) {
    this.sortField = field;
  }
}
