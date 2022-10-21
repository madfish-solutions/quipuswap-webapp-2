import { action, makeObservable, observable } from 'mobx';

import { isExist } from '@shared/helpers';
import { BaseFilterStore } from '@shared/store';

import { StableswapDividendsItemModel } from '../models';
import { sortStableDividendsList } from '../stabledividends/pages/list/helpers';
import { StableDividendsSortField } from '../stabledividends/pages/list/types';
import { StakerInfo } from '../types';

export class StableDividendsFilterStore extends BaseFilterStore {
  stakedOnly = false;
  whitelistedOnly = true;

  sortField: StableDividendsSortField = StableDividendsSortField.ID;

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

  filterAndSort(list: Array<StableswapDividendsItemModel & StakerInfo>) {
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

    return sortStableDividendsList(localList, this.sortField, this.sortDirection);
  }

  setStakedOnly(state: boolean) {
    this.stakedOnly = state;
  }

  setWhitelistedOnly(state: boolean) {
    this.whitelistedOnly = state;
  }

  onSortFieldChange(field: StableDividendsSortField) {
    this.sortField = field;
  }
}
