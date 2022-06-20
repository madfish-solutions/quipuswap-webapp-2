import { action, makeObservable, observable } from 'mobx';

import { BaseFilterStore } from '@shared/store';

import { sortStableswapList } from '../stableswap-liquidity/pages/list/helpers';
import { StableswapSortField } from '../stableswap-liquidity/pages/list/types';
import { StableswapItem } from '../types';

export class StableswapFilterStore extends BaseFilterStore {
  whitelistedOnly = true;
  sortField: StableswapSortField = StableswapSortField.ID;

  constructor() {
    super();

    makeObservable(this, {
      whitelistedOnly: observable,
      sortField: observable,

      setWhitelistedOnly: action,
      onSortFieldChange: action
    });
  }

  filterAndSort(list: Array<StableswapItem>) {
    let localList = [...list];
    if (this.whitelistedOnly) {
      localList = localList.filter(({ isWhitelisted }) => isWhitelisted);
    }

    if (this.search) {
      localList = localList.filter(({ tokensInfo }) =>
        tokensInfo.map(({ token }) => this.tokenMatchesSearch(token)).some(Boolean)
      );
    }

    return sortStableswapList(localList, this.sortField, this.sortDirection);
  }

  setWhitelistedOnly(state: boolean) {
    this.whitelistedOnly = state;
  }

  onSortFieldChange(field: StableswapSortField) {
    this.sortField = field;
  }
}
