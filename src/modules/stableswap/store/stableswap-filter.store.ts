import { action, makeObservable, observable } from 'mobx';

import { BaseFilterStore, RootStore } from '@shared/store';

import { sortStableswapList, SortField } from '../helpers';
import { StableswapItem } from '../types';

export class StableswapFilterStore extends BaseFilterStore {
  whitelistedOnly = true;
  sortField: SortField = SortField.ID;

  constructor(protected rootStore: RootStore) {
    super(rootStore);

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
      localList = localList.filter(({ tokensInfo }) => {
        return tokensInfo.map(({ token }) => this.tokenMatchesSearch(token)).some(Boolean);
      });
    }

    return sortStableswapList(localList, this.sortField, this.sortDirection);
  }

  setWhitelistedOnly(state: boolean) {
    this.whitelistedOnly = state;
  }

  onSortFieldChange(field: SortField) {
    this.sortField = field;
  }
}
