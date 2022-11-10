import { action, makeObservable, observable } from 'mobx';

import { BaseFilterStore, RootStore } from '@shared/store';

import { StableswapItemModel } from '../models';
import { sortStableswapList } from '../stableswap-liquidity/pages/list/helpers';
import { StableswapSortField } from '../stableswap-liquidity/pages/list/types';

export class StableswapFilterStore extends BaseFilterStore {
  whitelistedOnly = false;
  sortField: StableswapSortField = StableswapSortField.ID;

  constructor(rootStore: RootStore) {
    super(rootStore);

    makeObservable(this, {
      whitelistedOnly: observable,
      sortField: observable,

      setWhitelistedOnly: action,
      onSortFieldChange: action
    });
  }

  filterAndSort(list: Array<StableswapItemModel>) {
    let localList = [...list];
    if (this.whitelistedOnly) {
      localList = localList.filter(({ isWhitelisted }) => isWhitelisted);
    }

    if (this.search) {
      localList = localList.filter(({ tokensInfo }) =>
        tokensInfo.map(({ token }) => this.searchToken(token)).some(Boolean)
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
