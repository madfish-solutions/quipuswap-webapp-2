import { action, makeObservable, observable } from 'mobx';

import { BaseFilterStore } from '@shared/store';

import { filterByStableSwap, sortLiquidityList } from '../helpers';
import { LiquidityItemModel } from '../models';
import { LiquiditySortField } from '../pages/list/types';

export class LiquidityListFiltersStore extends BaseFilterStore {
  showDust = false;
  investedOnly = false;

  showStable = false;
  showBridged = false;
  showQuipu = false;
  showTezotopia = false;
  showBTC = false;
  showDexTwo = false;

  sortField: LiquiditySortField = LiquiditySortField.ID;

  constructor() {
    super();

    makeObservable(this, {
      showDust: observable,
      investedOnly: observable,
      showStable: observable,
      showBridged: observable,
      showQuipu: observable,
      showTezotopia: observable,
      showBTC: observable,
      showDexTwo: observable,
      sortField: observable,

      setShowDust: action,
      setInvestedOnly: action,
      setShowStable: action,
      setShowBridged: action,
      setShowQuipu: action,
      setShowTezotopia: action,
      setShowBTC: action,
      setShowDexTwo: action,
      onSortFieldChange: action
    });
  }

  filterAndSort(list: Array<LiquidityItemModel>): Array<LiquidityItemModel> {
    const filtered = list.filter(filterByStableSwap(this.showStable));

    return sortLiquidityList(filtered, this.sortField, this.sortDirection);
  }

  setShowDust(state: boolean) {
    this.showDust = state;
  }
  setInvestedOnly(state: boolean) {
    this.investedOnly = state;
  }

  setShowStable(state: boolean) {
    this.showStable = state;
  }
  setShowBridged(state: boolean) {
    this.showBridged = state;
  }
  setShowQuipu(state: boolean) {
    this.showQuipu = state;
  }
  setShowTezotopia(state: boolean) {
    this.showTezotopia = state;
  }
  setShowBTC(state: boolean) {
    this.showBTC = state;
  }
  setShowDexTwo(state: boolean) {
    this.showDexTwo = state;
  }

  onSortFieldChange(field: LiquiditySortField) {
    this.sortField = field;
  }
}
