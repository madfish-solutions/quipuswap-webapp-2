import { action, makeObservable, observable } from 'mobx';

import { isExist } from '@shared/helpers';
import { BaseFilterStore } from '@shared/store';

import { sortStableswapFarmList } from '../stableswap-farm/pages/list/helpers';
import { StableswapFarmSortField } from '../stableswap-farm/pages/list/types';
import { StableFarmItem, StakerInfo } from '../types';

export class StableswapFarmFilterStore extends BaseFilterStore {
  stakedOnly = false;
  whitelistedOnly = true;

  sortField: StableswapFarmSortField = StableswapFarmSortField.ID;

  constructor() {
    super();

    makeObservable(this, {
      stakedOnly: observable,
      whitelistedOnly: observable,
      sortField: observable,

      setStakedOnly: action,
      setWhitelistedOnly: action,
      onSortFieldChange: action
    });
  }

  filterAndSort(list: Array<StableFarmItem & StakerInfo>) {
    let localList = [...list];
    if (this.stakedOnly) {
      localList = localList.filter(({ yourDeposit }) => isExist(yourDeposit) && yourDeposit.isGreaterThan('0'));
    }

    if (this.whitelistedOnly) {
      localList = localList.filter(({ isWhitelisted }) => isWhitelisted);
    }

    if (this.search) {
      localList = localList.filter(({ tokensInfo }) =>
        tokensInfo.map(({ token }) => this.tokenMatchesSearch(token)).some(Boolean)
      );
    }

    return sortStableswapFarmList(localList, this.sortField, this.sortDirection);
  }

  setStakedOnly(state: boolean) {
    this.stakedOnly = state;
  }

  setWhitelistedOnly(state: boolean) {
    this.whitelistedOnly = state;
  }

  onSortFieldChange(field: StableswapFarmSortField) {
    this.sortField = field;
  }
}
