import { action, makeObservable, observable } from 'mobx';

import { BaseFilterStore } from '@shared/store';

import { FarmingSortField } from '../pages/list/types';

export class FarmingFilterStore extends BaseFilterStore {
  stakedOnly = false;
  activeOnly = true;

  sortField: FarmingSortField = FarmingSortField.DEFAULT;

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
