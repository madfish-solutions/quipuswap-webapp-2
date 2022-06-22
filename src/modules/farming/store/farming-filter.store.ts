import { action, makeObservable, observable } from 'mobx';

import { isExist } from '@shared/helpers';
import { BaseFilterStore } from '@shared/store';
import { ActiveStatus } from '@shared/types';

import { FarmingItem } from '../interfaces';
import { sortFarmingList } from '../pages/list/helpers'; //TODO
import { FarmingSortField } from '../pages/list/types';

export class FarmingFilterStore extends BaseFilterStore {
  stakedOnly = false;
  activeOnly = true;

  sortField: FarmingSortField = FarmingSortField.ID;

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
        ({ stakedToken, rewardToken, tokens }) =>
          this.tokenMatchesSearch(stakedToken, true) ||
          this.tokenMatchesSearch(rewardToken) ||
          tokens.some(token => this.tokenMatchesSearch(token))
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
